import mongoose from "mongoose";

const workShiftSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shiftId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shift",
    required: true,
  },
  date: { type: Date, required: true },
  dayOfWeek: { type: Number, min: 0, max: 6, required: true }, // 0: Sunday, 6: Saturday
  startTime: { type: String, required: true }, // "09:00"
  endTime: { type: String, required: true }, // "17:00"
  isActive: { type: Boolean, default: true },
});

const WorkShift = mongoose.model("WorkShift", workShiftSchema);
export default WorkShift;
