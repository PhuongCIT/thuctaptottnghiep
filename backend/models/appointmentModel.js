import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    services: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    ],
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    notes: { type: String },
    paymentMethod: {
      type: String,
      enum: ["cash", "vnpay", "momo"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
