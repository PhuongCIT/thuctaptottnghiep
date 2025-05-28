import Shift from "../models/shiftModel.js";
import WorkShift from "../models/workShiftModel.js";

// Tạo ca làm việc mới
export const createShift = async (req, res) => {
  try {
    const { shiftType, date, max } = req.body;

    // Kiểm tra ca đã tồn tại trong ngày chưa
    const existingShift = await Shift.findOne({ shiftType, date });
    if (existingShift) {
      return res
        .status(400)
        .json({ message: "Ca làm việc đã tồn tại trong ngày này" });
    }

    const newShift = await Shift.create({ shiftType, date, max });
    res.status(200).json({
      success: true,
      message: "Tạo ca làm việc thành công",
      data: newShift,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Lấy danh sách ca
export const getAllShifts = async (req, res) => {
  try {
    const shifts = await Shift.find();
    res.json(shifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách ca theo khoảng thời gian
export const getShifts = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const shifts = await Shift.find(query).sort({ date: 1, shiftType: 1 });
    res.status(200).json({
      success: true,
      data: shifts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật thông tin ca (ví dụ: tăng số lượng tối đa)
export const updateShift = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedShift = await Shift.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedShift);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa ca làm việc (kiểm tra nếu có nhân viên đăng ký thì không xóa)
export const deleteShift = async (req, res) => {
  try {
    const { id } = req.params;
    // const registeredStaff = await WorkShift.findOne({ shiftId: id });

    // if (registeredStaff) {
    //   return res
    //     .status(400)
    //     .json({ message: "Không thể xóa ca đã có nhân viên đăng ký" });
    // }

    await Shift.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Ca làm việc đã được xóa thành công",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
