import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema(
  {
    shiftType: {
      type: String,
      enum: ["Ca1", "Ca2"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      default: function () {
        // Tự động tính giờ theo ca
        return this.shiftType === "Ca1" ? "07:00" : "15:00";
      },
    },
    endTime: {
      type: String,
      default: function () {
        return this.shiftType === "Ca1" ? "15:00" : "23:00";
      },
    },
    max: { type: Number },
  },
  { timestamps: true }
);

const Shift = mongoose.model("Shift", shiftSchema);
export default Shift;
