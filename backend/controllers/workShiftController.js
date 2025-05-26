// controllers/workShiftController.js
// const WorkShift = require("../models/workShiftModel");
// const User = require("../models/userModel");

import User from "../models/userModel.js";
import WorkShift from "../models/workShiftModel.js";

// [POST] /api/v1/work-shifts - Tạo ca làm việc mới (Admin)
export const createWorkShift = async (req, res) => {
  // Kiểm tra staff tồn tại và là nhân viên

  try {
    const { staffId, date, dayOfWeek, startTime, endTime } = req.body;

    const isStaff = await User.findById(req.body.staff);
    if (!isStaff || isStaff.role !== "staff") {
      return res.status(400).json({
        success: false,
        message: "Nhân viên không hợp lệ hoặc không phải là nhân viên",
      });
    }
    // Xử lý date/dayOfWeek
    let resolvedDayOfWeek;
    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res
          .status(400)
          .json({ error: "Ngày không hợp lệ (YYYY-MM-DD)" });
      }
      resolvedDayOfWeek = parsedDate.getDay(); // 0-6
    } else if (dayOfWeek !== undefined) {
      if (dayOfWeek < 0 || dayOfWeek > 6) {
        return res.status(400).json({ error: "dayOfWeek phải từ 0-6" });
      }
      resolvedDayOfWeek = dayOfWeek;
    } else {
      return res.status(400).json({ error: "Thiếu dayOfWeek hoặc date" });
    }

    // Validate time format
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({ error: "Thời gian phải là HH:MM (24h)" });
    }

    // Kiểm tra xung đột ca làm
    const conflictingShift = await WorkShift.findOne({
      staffId,
      dayOfWeek: resolvedDayOfWeek,
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
    });

    if (conflictingShift) {
      return res.status(409).json({
        error: "Xung đột ca làm việc",
        existingShift: conflictingShift,
      });
    }

    // Tạo ca làm
    const newShift = await WorkShift.create({
      date,
      staffId,
      dayOfWeek: resolvedDayOfWeek,
      startTime,
      endTime,

      ...(date && { dateReference: new Date(date) }), // Lưu thêm ngày tham chiếu nếu có
    });

    res.status(201).json({
      success: true,
      data: newShift,
    });
  } catch (error) {
    console.error("Lỗi tạo ca làm:", error);
    res.status(500).json({
      error: "Lỗi server",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// [GET] /api/v1/work-shifts - Lấy tất cả ca làm việc
export const getAllWorkShifts = async (req, res) => {
  const filter = { isActive: true };

  if (req.query.staff) filter.staff = req.query.staff;
  if (req.query.dayOfWeek) filter.dayOfWeek = req.query.dayOfWeek;

  const workShifts = await WorkShift.find(filter).populate("staff", "name");

  res.status(200).json({
    success: true,
    message: "Lấy danh sách ca làm việc thành công",
    results: workShifts.length,
    data: { workShifts },
  });
};

// [PATCH] /api/v1/work-shifts/:id - Cập nhật ca làm việc
export const updateWorkShift = async (req, res) => {
  const workShift = await WorkShift.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("staff", "name");

  if (!workShift) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy ca làm việc với ID này",
    });
  }

  res.status(200).json({
    success: true,
    message: "Cập nhật ca làm việc thành công",
    data: { workShift },
  });
};

// [DELETE] /api/v1/work-shifts/:id - Vô hiệu hóa ca làm việc (soft delete)
export const deleteWorkShift = async (req, res) => {
  const workShift = await WorkShift.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!workShift) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy ca làm việc với ID này",
    });
  }

  res.status(200).json({
    success: true,
    message: "Vô hiệu hóa ca làm việc thành công",
    data: { workShift },
  });
};
