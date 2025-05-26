// controllers/appointmentController.js
import Appointment from "../models/appointmentModel.js";
import User from "../models/userModel.js";
import Service from "../models/serviceModel.js";
import WorkShift from "../models/workShiftModel.js";

// Helper function: Tính giờ kết thúc dựa trên thời lượng dịch vụ
const calculateEndTime = (startTime, totalDuration) => {
  const [hours, minutes] = startTime.split(":").map(Number);
  const endDate = new Date();
  endDate.setHours(hours + Math.floor(totalDuration / 60));
  endDate.setMinutes(minutes + (totalDuration % 60));
  return `${endDate.getHours().toString().padStart(2, "0")}:${endDate
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

// Tạo lịch hẹn mới
export const createAppointment = async (req, res) => {
  try {
    const {
      customerId,
      staffId,
      services,
      date,
      startTime,
      notes,
      totalPrice,
    } = req.body;

    // VALIDATION
    if (!customerId || !services || !date || !startTime) {
      return res.status(400).json({
        success: false,
        message:
          "Thiếu thông tin bắt buộc (customer, services, date, startTime)",
      });
    }

    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime)) {
      return res.status(400).json({
        success: false,
        message: "Định dạng thời gian không hợp lệ (HH:MM)",
      });
    }

    // KIỂM TRA DỮ LIỆU
    const [customerUser, serviceList] = await Promise.all([
      User.findById(customerId),
      Service.find({ _id: { $in: services } }),
    ]);

    if (!customerUser || customerUser.role !== "customer") {
      return res.status(400).json({
        success: false,
        message: "Chỉ khách hàng được đặt",
      });
    }

    if (serviceList.length !== services.length) {
      return res.status(400).json({
        success: false,
        message: "Một số dịch vụ không tồn tại",
      });
    }

    // TÍNH TOÁN THỜI GIAN
    const totalDuration = serviceList.reduce((sum, s) => sum + s.duration, 0);
    const endTime = calculateEndTime(startTime, totalDuration);

    const customerConflictingAppointment = await Appointment.findOne({
      customerId,
      date,
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
      status: { $in: ["pending", "confirmed"] },
    });

    if (customerConflictingAppointment) {
      return res.status(409).json({
        success: false,
        message: "Bạn đã có lịch hẹn khác trùng thời gian này",
        conflictingAppointment: {
          id: customerConflictingAppointment._id,
          services: customerConflictingAppointment.services,
          time: `${customerConflictingAppointment.startTime}-${customerConflictingAppointment.endTime}`,
        },
      });
    }

    // XỬ LÝ KHI CHỌN NHÂN VIÊN
    if (staffId) {
      const staffUser = await User.findById(staffId);
      if (!staffUser || staffUser.role !== "staff") {
        return res.status(400).json({
          success: false,
          message: "Nhân viên không hợp lệ",
        });
      }

      const appointmentDate = new Date(date);
      if (isNaN(appointmentDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Ngày không hợp lệ",
        });
      }

      const workShift = await WorkShift.findOne({
        staffId,
        isActive: true,
      });

      if (!workShift) {
        return res.status(400).json({
          success: false,
          message: "Nhân viên không làm việc vào ngày này",
        });
      }

      // KIỂM TRA GIỜ LÀM VIỆC
      if (startTime < workShift.startTime || endTime > workShift.endTime) {
        return res.status(400).json({
          success: false,
          message: `Nhân viên chỉ làm việc từ ${workShift.startTime} đến ${workShift.endTime}`,
        });
      }

      // KIỂM TRA TRÙNG LỊCH
      const conflictingAppointment = await Appointment.findOne({
        staffId,
        date,
        $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
        status: { $in: ["pending", "confirmed"] },
      });

      if (conflictingAppointment) {
        return res.status(409).json({
          success: false,
          message: "Nhân viên đã có lịch hẹn trùng giờ này",
        });
      }
    }

    // TẠO APPOINTMENT (dùng chung cho cả 2 trường hợp)
    const newAppointment = await Appointment.create({
      customerId,
      staffId: staffId || null, // Cho phép null khi không chọn staff
      services,
      date,
      startTime,
      endTime, // Giờ đã được định nghĩa ở trên
      totalPrice,
      notes,
      status: "pending",
      paymentMethod: "cash",
      paymentStatus: "pending",
    });

    res.status(201).json({
      success: true,
      data: newAppointment,
      message: "Đặt lịch thành công",
    });
  } catch (error) {
    console.error("Lỗi khi đặt lịch:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi đặt lịch",
      error: error.message,
    });
  }
};

// Lấy danh sách lịch hẹn theo nhân viên/ngày
export const getAppointments = async (req, res) => {
  try {
    const { staffId, date } = req.query;
    const query = {};

    if (staffId) query.staffId = staffId;
    if (date) query.date = new Date(date);

    const appointments = await Appointment.find(query)
      .populate("customer", "name phone")
      .populate("services", "name price duration");

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi hệ thống" });
  }
};

// Lấy tất cả appointments (lọc theo role)
export const getAllAppointments = async (req, res) => {
  let filter = {};

  // Customer chỉ xem được lịch của mình
  if (req.user.role === "customer") {
    filter.customerId = req.user._id;
  }

  // Staff chỉ xem được lịch của mình
  if (req.user.role === "staff") {
    filter.staffId = req.user._id;
  }

  // Lọc theo query params
  if (req.query.status) filter.status = req.query.status;
  if (req.query.date) filter.date = req.query.date;

  const appointments = await Appointment.find(filter)
    .populate("customerId", "name email phone")
    .populate("staffId", "name")
    .populate("services", "name price duration");

  res.status(200).json({
    success: true,
    results: appointments.length,
    data: { appointments },
  });
};

// Lấy appointment cụ thể
export const getAppointment = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate("customer", "name email phone")
    .populate("staff", "name")
    .populate("services", "name price duration");

  if (!appointment) {
    return res
      .status(404)
      .json({ success: false, message: "Appointment not found" });
  }

  // Kiểm tra quyền truy cập
  if (
    req.user.role === "customer" &&
    appointment.customerId._id.toString() !== req.user.id
  ) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  if (
    req.user.role === "staff" &&
    appointment.staffId._id.toString() !== req.user.id
  ) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  res.status(200).json({
    success: true,
    data: { appointment },
  });
};

//cap nhat status tu pending sang confirmed
export const confirmAppointment = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: "Appointment not found",
    });
  }
  // Kiểm tra quyền truy cập
  // if (
  //   req.user.role === "customer" &&
  //   appointment.customerId._id.toString() !== req.user.id
  // ) {
  //   return res.status(403).json({ success: false, message: "Forbidden" });
  // }
  // if (
  //   req.user.role === "staff" &&
  //   appointment.staffId._id.toString() !== req.user.id
  // ) {
  //   return res.status(403).json({ success: false, message: "Forbidden" });
  // }
  // Cập nhật trạng thái
  appointment.status = "confirmed";
  await appointment.save();
  res.status(200).json({
    success: true,
    data: { appointment },
  });
};

// Cập nhật appointment
export const updateAppointment = async (req, res) => {
  // Chỉ cho phép cập nhật một số trường nhất định
  const allowedUpdates = ["status", "notes", "paymentStatus"];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid updates!" });
  }

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res
      .status(404)
      .json({ success: false, message: "Appointment not found" });
  }

  // Kiểm tra quyền cập nhật
  if (req.user.role === "customer" && updates.includes("status")) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  updates.forEach((update) => (appointment[update] = req.body[update]));
  await appointment.save();

  res.status(200).json({
    success: true,
    message: "Appointment updated successfully",
    data: { appointment },
  });
};

// Hủy appointment
export const cancelAppointment = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy lịch hẹn với id này",
    });
  }

  // Chỉ customer tạo lịch hoặc admin mới được hủy
  if (
    req.user.role === "customer" &&
    appointment.customerId.toString() !== req.user.id
  ) {
    return res
      .status(403)
      .json({ success: false, message: "Bạn không có quyền hủy lịch này" });
  }

  // Chỉ hủy được lịch ở trạng thái pending hoặc confirmed
  if (!["pending", "confirmed"].includes(appointment.status)) {
    return res
      .status(403)
      .json({ success: false, message: "Lịch này không thể hủy" });
  }

  appointment.status = "cancelled";
  await appointment.save();

  res.status(200).json({
    success: true,
    message: "Lịch hẹn đã bị hủy",
    data: { appointment },
  });
};

export default {
  createAppointment,
  getAppointments,
  getAllAppointments,
  getAppointment,
  updateAppointment,
  cancelAppointment,
};
