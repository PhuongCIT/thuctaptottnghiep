import Shift from "../models/shiftModel.js";

// Tạo ca làm việc mới với tự động phân loại sáng/chiều/tối
export const createShift = async (req, res) => {
  try {
    const { date, startTime, endTime, shiftName } = req.body;
    // const { role, _id: adminId } = req.user; // Lấy thông tin user từ middleware xác thực

    // 1. Kiểm tra quyền admin
    // if (role !== "admin") {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Chỉ admin có quyền tạo ca làm việc",
    //   });
    // }

    // 2. Validate input
    if (!date || !startTime || !endTime || !shiftName) {
      return res.status(400).json({
        success: false,
        message:
          "Thiếu thông tin bắt buộc (date, startTime, endTime, shiftName)",
      });
    }

    // 3. Kiểm tra thời gian hợp lệ
    const startHour = parseInt(startTime.split(":")[0]);
    const endHour = parseInt(endTime.split(":")[0]);

    if (startHour < 8 || endHour >= 22) {
      return res.status(400).json({
        success: false,
        message: "Thời gian làm việc chỉ từ 8:00 đến trước 22:00",
      });
    }

    // 4. Kiểm tra ca trùng lặp
    const existingShift = await Shift.findOne({
      date: new Date(date),
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
    });

    if (existingShift) {
      return res.status(400).json({
        success: false,
        message: "Đã có ca làm việc trong khoảng thời gian này",
      });
    }

    // 5. Tạo ca làm việc mới (không gán staffId)
    const newShift = await Shift.create({
      shiftName,
      date: new Date(date),
      startTime,
      endTime,
      createdBy: adminId,
      status: "available", // Trạng thái ban đầu là có thể đăng ký
    });

    res.status(201).json({
      success: true,
      data: newShift,
      message: `Tạo ca ${shiftName} thành công (${startTime}-${endTime})`,
    });
  } catch (error) {
    console.error("Error creating shift:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi khi tạo ca làm việc",
    });
  }
};
// controllers/shiftController.js
export const createFixedShifts = async (req, res) => {
  try {
    // Verify admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Chỉ admin có quyền tạo ca",
      });
    }

    const { date } = req.body;

    // Tạo 2 ca cố định trong ngày
    const shifts = await Shift.create([
      {
        shiftType: "morning",
        date: new Date(date),
      },
      {
        shiftType: "afternoon",
        date: new Date(date),
      },
    ]);

    res.status(201).json({
      success: true,
      data: shifts,
      message: "Đã tạo ca sáng (8h-16h) và ca chiều (15h-22h)",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const registerShift = async (req, res) => {
  try {
    const { shiftId } = req.body;
    const staffId = req.user._id;

    // Kiểm tra nhân viên đã đăng ký ca nào trong ngày chưa
    const existingShift = await Shift.findOne({
      date: { $eq: new Date(new Date().setHours(0, 0, 0, 0)) },
      staffId,
      status: "booked",
    });

    if (existingShift) {
      return res.status(400).json({
        success: false,
        message: "Mỗi nhân viên chỉ được đăng ký 1 ca/ngày",
      });
    }

    // Đăng ký ca
    const shift = await Shift.findByIdAndUpdate(
      shiftId,
      {
        staffId,
        status: "booked",
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: shift,
      message: "Đăng ký ca thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Lấy danh sách ca làm theo ngày và loại ca
export const getShifts = async (req, res) => {
  try {
    const { date, shiftType, staffId } = req.query;
    const filter = {};

    if (date) filter.date = new Date(date);
    if (shiftType) filter.shiftType = shiftType;
    if (staffId) filter.staffId = staffId;

    const shifts = await Shift.find(filter)
      .populate("staff", "name specialization")
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      data: shifts,
      summary: generateShiftSummary(shifts), // Thống kê tự động
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi khi lấy danh sách ca làm",
    });
  }
};

// Cập nhật ca làm việc (tự động điều chỉnh shiftType)
export const updateShift = async (req, res) => {
  try {
    const updatedShift = await Shift.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedShift) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy ca làm việc" });
    }

    res.status(200).json({
      success: true,
      data: updatedShift,
      message: `Cập nhật ca ${updatedShift.shiftType} thành công`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || " Lỗi khi cập nhật ca làm",
    });
  }
};

// Hàm thống kê tự động
function generateShiftSummary(shifts) {
  const summary = {
    morning: { count: 0, staff: [] },
    afternoon: { count: 0, staff: [] },
    evening: { count: 0, staff: [] },
    totalHours: 0,
  };

  shifts.forEach((shift) => {
    summary[shift.shiftType].count++;
    summary[shift.shiftType].staff.push(shift.staff._id);

    const duration =
      parseInt(shift.endTime.split(":")[0]) -
      parseInt(shift.startTime.split(":")[0]);
    summary.totalHours += duration;
  });

  return summary;
}
