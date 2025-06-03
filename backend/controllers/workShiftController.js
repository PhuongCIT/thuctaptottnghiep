import WorkShift from "../models/workShiftModel.js";
import Shift from "../models/shiftModel.js";

// Nhân viên đăng ký ca
export const registerWorkShift = async (req, res) => {
  try {
    const { staffId, shiftId } = req.body;

    // Kiểm tra ca có tồn tại không
    const shift = await Shift.findById(shiftId);
    if (!shift) {
      return res.status(404).json({
        success: false,
        message: "Ca làm việc không tồn tại",
      });
    }

    // Kiểm tra nhân viên đã đăng ký ca này chưa
    const existingRegistration = await WorkShift.findOne({ staffId, shiftId });
    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã đăng ký ca này rồi",
      });
    }

    // Kiểm tra số lượng đăng ký có vượt quá giới hạn không
    const currentRegistrations = await WorkShift.countDocuments({ shiftId });
    if (currentRegistrations >= shift.max) {
      return res.status(400).json({ message: "Ca làm việc đã đủ số lượng" });
    }

    const newWorkShift = await WorkShift.create({ staffId, shiftId });
    res.status(200).json({
      success: true,
      message: "Đăng ký ca làm việc thành công",
      data: newWorkShift,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin duyệt đăng ký ca
export const approveWorkShift = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedWorkShift = await WorkShift.findByIdAndUpdate(
      id,
      {
        status: "approved",
      },
      { new: true }
    ).populate("staffId shiftId");

    res.status(200).json({
      success: true,
      message: "Đã cập nhật trạng thái đăng ký ca làm việc",
      data: updatedWorkShift,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin từ chối đăng ký ca
export const rejectWorkShift = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedWorkShift = await WorkShift.findByIdAndUpdate(
      id,
      {
        status: "rejected",
      },
      { new: true }
    ).populate("staffId shiftId");

    res.status(200).json({
      success: true,
      message: "Đã cập nhật trạng thái đăng ký ca làm việc",
      data: updatedWorkShift,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách đăng ký theo ca hoặc trạng thái
// export const getWorkShifts = async (req, res) => {
//   try {
//     const { shiftId, status } = req.query; // status: 'pending', 'approved', 'rejected'
//     const query = {};

//     if (shiftId) query.shiftId = shiftId;
//     if (status === "pending") {
//       query.isActive = false;
//       query.isRejected = false;
//     } else if (status === "approved") {
//       query.isActive = true;
//     } else if (status === "rejected") {
//       query.isRejected = true;
//     }
//     // Staff chỉ xem được lịch của mình
//     if (req.user.role === "staff") {
//       filter.staffId = req.user._id;
//     }

//     const workShifts = await WorkShift.find(query)
//       .populate("staffId", "name email")
//       .populate("shiftId", "shiftType date startTime endTime");

//     res.status(200).json(workShifts);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// Lấy danh sách đăng ký ca làm việc theo bộ lọc
export const getWorkShifts = async (req, res) => {
  try {
    const { shiftId, status } = req.query;
    const query = {};
    const filter = {}; // Tách biệt query và filter để rõ ràng

    // Xử lý bộ lọc trạng thái
    if (status) {
      switch (
        status.toLowerCase() // Chuẩn hóa đầu vào
      ) {
        case "pending":
          query.isActive = false;
          query.isRejected = false;
          break;
        case "approved":
          query.isActive = true;
          query.isRejected = false; // Thêm điều kiện phụ
          break;
        case "rejected":
          query.isRejected = true;
          break;
        default:
          return res.status(400).json({ message: "Trạng thái không hợp lệ" });
      }
    }

    // Lọc theo shiftId nếu có
    if (shiftId) {
      if (!mongoose.Types.ObjectId.isValid(shiftId)) {
        return res.status(400).json({ message: "ID ca làm việc không hợp lệ" });
      }
      query.shiftId = shiftId;
    }

    // Phân quyền: Staff chỉ xem được lịch của mình
    if (req.user.role === "staff") {
      query.staffId = req.user._id; // Sửa từ 'filter' sang 'query'
    } else if (req.user.role === "manager") {
      // Manager có thể thêm bộ lọc khác nếu cần
    }

    // Truy vấn với populate và sắp xếp
    const workShifts = await WorkShift.find(query)
      .populate("staffId", "name email avatar") // Thêm trường avatar
      .populate({
        path: "shiftId",
        select: "shiftType date startTime endTime",
        options: { sort: { date: 1 } }, // Sắp xếp theo ngày tăng dần
      })
      .lean(); // Chuyển sang plain object để tối ưu hiệu năng

    // Format lại ngày tháng theo múi giờ VN (nếu cần)
    const formattedShifts = workShifts.map((shift) => ({
      ...shift,
      shiftId: {
        ...shift.shiftId,
        date: shift.shiftId?.date?.toLocaleDateString("vi-VN"), // Định dạng dd/mm/yyyy
      },
    }));

    res.status(200).json({
      data: formattedShifts,
      message: "Lấy lịch ca làm việc thành công",
      success: true,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách ca làm:", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
      details: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};
