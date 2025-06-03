import React, { useContext, useState } from "react";
import {} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { AppContext } from "../context/AppContext";
import reviewApi from "../services/reviewService";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import MyScheduleCalendar from "../components/MyScheduleCalendar";

const MyAppointments = () => {
  const { appointments, cancelAppointment, getAllAppointments } = useAuth();
  const { formatPrice, getReviews } = useContext(AppContext);
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Số item mỗi trang

  // Tạo mảng các ngày có lịch hẹn
  const appointmentDates = appointments.map((app) => new Date(app.date));

  // Lọc appointments theo ngày được chọn
  const filterAppointmentsByDate = (apps) => {
    if (!selectedDate) return apps;

    return apps.filter((app) => {
      const appDate = new Date(app.date);
      return appDate.toDateString() === selectedDate.toDateString();
    });
  };

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

  // Lọc lịch hẹn và áp dụng filter theo ngày
  const appointmentsPendingandConf = filterAppointmentsByDate(
    appointments.filter(
      (item) => item.status !== "cancelled" && item.status !== "completed"
    )
  );

  const appointmentsCancelledAndCompleted = filterAppointmentsByDate(
    appointments.filter(
      (item) => item.status !== "pending" && item.status !== "confirm"
    )
  );
  // Tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppoitments = appointmentsPendingandConf.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(
    appointmentsPendingandConf.length / itemsPerPage
  );

  // Chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Custom CSS cho các ngày có lịch hẹn
  const highlightWithCount = (date) => {
    const appointmentsOnDate = appointments.filter(
      (app) => new Date(app.date).toDateString() === date.toDateString()
    );

    if (appointmentsOnDate.length > 0) {
      return "has-appointments";
    }
    return undefined;
  };

  return (
    <div className="p-4">
      {/* DatePicker Section */}
      <div className=" w-full">
        <MyScheduleCalendar registrations={appointments} />
      </div>
      <div className="sm:block md:flex lg:flex xl:flex 2xl:flex ">
        <div className=" px-4 w-full">
          <p className="pb-3 mt-12 font-bold text-white px-4 mr-4 bg-blue-400">
            My Appointments
          </p>
          <div className="relative">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              highlightDates={appointmentDates}
              dayClassName={highlightWithCount}
              isClearable
              placeholderText="Chọn ngày để lọc lịch hẹn"
              className="w-full p-2 border rounded-lg pl-10"
            />
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          {selectedDate && (
            <button
              onClick={() => setSelectedDate(null)}
              className="mt-2 text-sm text-blue-500 hover:text-blue-700"
            >
              Xem tất cả lịch hẹn
            </button>
          )}

          <div className="space-y-4">
            {currentAppoitments.map((item, index) => (
              <div
                className="grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr] gap-1 sm:flex sm:gap-6 py-2 border-b items-baseline"
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
                    ) : (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => cancelAppointment(item._id)}
                          className="text-sm  text-center px-6  py-2 border rounded-xl bg-red-500 text-white hover:bg-red-400 transition-all duration-300 cursor-pointer"
                        >
                          Hủy
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="">
                    <p>Đã Hoàn thành</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Phân trang */}
          {appointmentsPendingandConf.length > itemsPerPage && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Hiển thị {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, appointmentsPendingandConf.length)}{" "}
                trong tổng {appointmentsPendingandConf.length} Lịch hẹn
              </span>

              <div className="flex space-x-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-white border hover:bg-gray-50"
                  }`}
                >
                  Trước
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === number
                          ? "bg-blue-500 text-white"
                          : "bg-white border hover:bg-gray-50"
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-white border hover:bg-gray-50"
                  }`}
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="px-4 w-full">
          <p className="pb-3 mt-12 font-bold sssssssss bg-red-500 text-white px-4">
            Lịch sử
          </p>
          <div className="space-y-4 ml-3  max-h-[300px] overflow-y-auto  ">
            {appointmentsCancelledAndCompleted.map((item, index) => (
              <div
                className="flex justify-between items-baseline m-2 bg-blue-50 hover:bg-blue-100"
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

                <div className="">
                  <spann className="text-red-500">
                    {formatPrice(item.totalPrice)}
                  </spann>
                  <span>VNĐ</span>
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
                    ) : (
                      <div className="text-red-500">
                        <p>Đã hủy</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="">
                    <p>Đã Hoàn thành</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;
