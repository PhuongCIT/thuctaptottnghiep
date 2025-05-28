import React, { useContext, useState } from "react";
import {} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { AppContext } from "../context/AppContext";
import reviewApi from "../services/reviewService";
import { toast } from "react-toastify";

const MyAppointments = () => {
  const { appointments, cancelAppointment, getAllAppointments } = useAuth();
  const { formatPrice, getReviews } = useContext(AppContext);
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createReview = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await reviewApi.addReview(data);
      console.log("Review created:", res);
      // Có thể thêm toast notification ở đây
      toast.success("Đánh giá thành công!");
      getAllAppointments();
      getReviews();
      setRating(0);
    } catch (error) {
      console.error("Lỗi khi tạo review:", error);
      toast.error("Có lỗi xảy ra khi gửi đánh giá");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="">
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </p>
      <div className="space-y-4">
        {appointments.map((item, index) => (
          <div
            className="grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr] gap-1 sm:flex sm:gap-6 py-2 border-b"
            key={index}
          >
            <div className="space-y-1">
              {item.services.map((service) => (
                <span
                  key={service._id}
                  className="block text-neutral-800 font-semibold"
                >
                  {service.name}
                </span>
              ))}
            </div>

            <p className="text-zinc-700 font-medium mt-1">
              Nhân viên: {item.staffId?.name || "Chưa xác định"}
            </p>

            <p className="text-xs mt-1">
              <span className="text-sm text-neutral-700 font-medium">
                Date & Time:
              </span>{" "}
              {new Date(item.date).toLocaleDateString("vi-VN")} -{" "}
              {new Date(`2000-01-01T${item.startTime}`).toLocaleTimeString(
                "vi-VN",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                }
              )}
            </p>
            <div className="">
              <spann className="text-red-500">
                {formatPrice(item.totalPrice)}
              </spann>
              <span>VNĐ</span>
            </div>

            <div className="w-32">
              <p
                className={`text-sm text-center font-medium mt-1 ${
                  item.status === "confirmed"
                    ? "text-green-600"
                    : item.status === "pending"
                    ? "text-yellow-500"
                    : item.status === "cancelled"
                    ? "text-red-500"
                    : "text-neutral-700" // Mặc định
                }`}
              >
                {item.status}
              </p>
            </div>

            {item.isReviewed === false ? (
              <div className="flex flex-col gap-2 justify-end">
                {item.status === "completed" ? (
                  <div className="space-y-4">
                    <div className="">
                      <p>Đã thanh toán</p>
                    </div>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const reviewData = {
                          customerId: user._id,
                          appointmentId: item._id,
                          serviceId: item.services[0]._id,
                          staffId: item.staff?._id,
                          rating: formData.get("rating"),
                          comment: formData.get("comment"),
                        };
                        console.log("reviewData ", reviewData);
                        await createReview(reviewData);
                      }}
                    >
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`text-2xl ${
                              rating >= star
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            onClick={() => setRating(star)}
                          >
                            ★
                          </button>
                        ))}
                        <input type="hidden" name="rating" value={rating} />
                      </div>
                      <textarea
                        name="comment"
                        rows={3}
                        placeholder="Nhận xét về dịch vụ..."
                        className="w-full p-2 border rounded-md"
                        required
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : item.status === "cancelled" ? (
                  <div className="text-red-500">
                    <p>Đã hủy</p>
                  </div>
                ) : (
                  <div className="flex space-x-3">
                    <button className="text-sm text-center sm:min-w-36 py-2 border rounded-xl bg-gray-500 text-white transition-all duration-300 cursor-no-drop">
                      Thanh toán online
                    </button>
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="text-sm text-stone-500 text-center sm:min-w-36 py-2 border rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer"
                    >
                      Hủy
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="">
                <p>Đã thanh toán</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
