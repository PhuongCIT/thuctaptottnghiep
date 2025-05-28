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

  isActive: { type: Boolean, default: false }, // chờ admin duyệt
  isRejected: { type: Boolean, default: false }, // đã bị admin từ chối
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

const WorkShift = mongoose.model("WorkShift", workShiftSchema);
export default WorkShift;
