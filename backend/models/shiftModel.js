import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema(
  {
    shiftType: {
      type: String,
      enum: ["Morning", "Afternoon", "Night"],
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
        return this.shiftType === "Morning"
          ? "08:00"
          : this.shiftType === "Afternoon"
          ? "13:00"
          : "18:00";
      },
    },
    endTime: {
      type: String,
      default: function () {
        return this.shiftType === "Morning"
          ? "12:00"
          : this.shiftType === "Afternoon"
          ? "17:00"
          : "22:00";
      },
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Completed"],
      default: "Pending",
    },
    adminNote: {
      type: String,
    },
    staffNote: {
      type: String,
    },
  },
  { timestamps: true }
);

const Shift = mongoose.model("Shift", shiftSchema);
export default Shift;
