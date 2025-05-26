import Appointment from "../models/appointmentModel.js";
import Review from "../models/reviewModel.js";
import Service from "../models/serviceModel.js";

export const createReview = async (req, res) => {
  try {
    const { appointmentId, rating, comment, customerId, serviceId } = req.body;

    // 1. Kiểm tra rating hợp lệ
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating phải từ 1-5 sao" });
    }

    // 2. Kiểm tra appointment có thể đánh giá
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      customerId,
      status: "completed",
      isReviewed: false,
    });
    if (!appointment) {
      return res
        .status(400)
        .json({ message: "Không thể đánh giá lịch hẹn này" });
    }

    // 3. Tạo review và cập nhật dữ liệu liên quan
    const review = await Review.create({
      appointmentId,
      serviceId,
      customerId,
      staffId: appointment.staffId,
      rating,
      comment,
    });

    await Appointment.updateOne({ _id: appointmentId }, { isReviewed: true });
    await Service.updateOne(
      { _id: serviceId },
      {
        $inc: { totalRatings: 1, sumRatings: rating },
      }
    );

    return res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message:
        error.code === 11000
          ? "Đã tồn tại đánh giá cho lịch hẹn này"
          : "Lỗi hệ thống",
    });
  }
};

// [GET] /api/v1/reviews - Lấy tất cả reviews (có thể lọc theo service/staff)
export const getAllReviews = async (req, res) => {
  const filter = {};

  if (req.query.serviceId) filter.serviceId = req.query.serviceId;
  if (req.query.staffId) filter.staffId = req.query.staffId;

  const reviews = await Review.find(filter)
    .populate("customer", "name image")
    .populate("staff", "name")
    .populate("service", "name");

  res.status(200).json({
    success: true,
    message: "Lấy danh sách đánh giá thành công",
    results: reviews.length,
    data: { reviews },
  });
};

// [DELETE] /api/v1/reviews/:id - Xóa review (Admin hoặc người tạo)
export const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy đánh giá với ID này",
    });
  }

  // Kiểm tra quyền xóa (admin hoặc người tạo)
  if (
    req.user.role !== "admin" &&
    review.customerId.toString() !== req.user.id
  ) {
    return res.status(403).json({
      success: false,
      message: "Bạn không có quyền xóa đánh giá này",
    });
  }

  await Review.findByIdAndDelete(req.params.id);

  res.status(204).json({
    success: true,
    message: "Xóa đánh giá thành công",
    data: null,
  });
};
