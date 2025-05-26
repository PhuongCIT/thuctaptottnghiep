import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Vui lòng chọn khách hàng"],
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Vui lòng chọn dịch vụ"],
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: [true, "Vui lòng chọn lịch hẹn"],
    },
    rating: {
      type: Number,
      min: [1, "Đánh giá tối thiểu là 1 sao"],
      max: [5, "Đánh giá tối đa là 5 sao"],
      required: [true, "Vui lòng chọn số sao đánh giá"],
    },
    comment: {
      type: String,
      maxlength: [500, "Bình luận không vượt quá 500 ký tự"],
    },
  },
  {
    timestamps: true,
  }
);

// Thêm compound index quan trọng
reviewSchema.index(
  { appointmentId: 1, serviceId: 1 },
  {
    // unique: true,
    name: "unique_review_per_service",
    partialFilterExpression: {
      appointmentId: { $exists: true },
      serviceId: { $exists: true },
    },
  }
);

// Middleware validate trước khi save
reviewSchema.pre("save", async function (next) {
  const review = this;

  // Kiểm tra service có thuộc appointment không
  const appointment = await mongoose.model("Appointment").findOne({
    _id: review.appointmentId,
    services: review.serviceId,
  });

  if (!appointment) {
    throw new Error(
      `Dịch vụ ${review.serviceId} không tồn tại trong lịch hẹn này`
    );
  }

  // Gán staffId tự động từ appointment
  if (!review.staffId) {
    review.staffId = appointment.staffId;
  }

  next();
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
