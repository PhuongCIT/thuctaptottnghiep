import React, { useCallback, useContext, useState } from "react";
import {
  FiCalendar,
  FiCheck,
  FiClock,
  FiInfo,
  FiUser,
  FiX,
} from "react-icons/fi";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import appointmentApi from "../services/appointmentsService";

const BookingPage = () => {
  const { services, formatPrice, staffs } = useContext(AppContext);
  const { getAllAppointments } = useAuth();
  const { user } = useAuth();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState("");

  const validateForm = useCallback(() => {
    const errors = {};
    if (selectedServices.length === 0)
      errors.services = "Vui lòng chọn ít nhất một dịch vụ";
    if (!date) errors.date = "Vui lòng chọn ngày";
    if (!startTime) errors.time = "Vui lòng chọn giờ";
    // if (!selectedStaffId) errors.staff = "Vui lòng chọn nhân viên";

    // Kiểm tra ngày giờ hợp lệ
    if (date && startTime) {
      const selectedDateTime = new Date(`${date}T${startTime}`);
      if (selectedDateTime < new Date()) {
        errors.date = "Thời gian phải trong tương lai";
      }
    }
    // Thêm vào validateForm()
    if (startTime) {
      const [hours] = startTime.split(":");
      if (hours < 8 || hours > 20) {
        errors.time = "Giờ làm việc: 8h - 20h";
      }
    }
    return errors;
  }, [selectedServices, date, startTime]);

  const toggleService = useCallback((service) => {
    setSelectedServices((prev) =>
      prev.some((s) => s._id === service._id)
        ? prev.filter((s) => s._id !== service._id)
        : [...prev, service]
    );
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const validationError = validateForm();
      if (Object.keys(validationError).length) {
        setErrors(validationError);
        return;
      }
      setErrors({});
      setIsSubmitting(true);

      try {
        const appointmentData = {
          appointmentDate: new Date(`${date}T${startTime}`).toISOString(),
          date: date,
          startTime: startTime,
          notes: notes,
          customerId: user._id,
          staffId: selectedStaffId,
          services: selectedServices.map((service) => service._id),
          totalPrice: selectedServices.reduce((sum, s) => sum + s.price, 0),
        };

        console.log("appointmentData: ", appointmentData);

        const res = await appointmentApi.create(appointmentData);
        const response = res.data;
        console.log("resData :", response);
        if (response.success) {
          setSelectedServices([]);
          setDate("");
          setStartTime("");
          setNotes("");
          setSelectedStaffId("");
          toast.success("Đặt lịch thành công!");
          getAllAppointments();
        }
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      validateForm,
      date,
      startTime,
      notes,
      user._id,
      selectedStaffId,
      selectedServices,
      getAllAppointments,
    ]
  );

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-bold mb-4 font-[Poppins]">
            Đặt lịch
          </h2>
          <p className="text-blue-600 text-lg sm:text-xl font-medium">
            Chúng tôi luôn sẵn sàng đón tiếp bạn
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border-2 border-gray-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Thông tin khách hàng */}
            <div className="relative group">
              <FiUser className="absolute left-4 top-4 text-blue-400 text-xl" />
              <input
                type="text"
                placeholder="Tên khách hàng"
                disabled
                value={user?.name || ""}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-300 transition-all duration-300  text-blue-700 font-medium"
              />
            </div>

            {/* Chọn nhân viên */}
            <div className="relative group">
              <FiUser className="absolute left-4 top-4 text-blue-400 text-xl" />
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all duration-300 0 text-blue-700 font-medium"
              >
                <option value="">Chọn nhân viên ( nếu muốn)</option>
                {staffs?.map((staff) => (
                  <option key={staff._id} value={staff._id}>
                    {staff.name}
                  </option>
                ))}
              </select>
              {errors.staff && (
                <p className="text-red-400 text-sm mt-1 ml-2 flex items-center gap-1">
                  <FiInfo className="inline" />
                  {errors.staff}
                </p>
              )}
            </div>

            {/* Dịch vụ */}
            <div className="md:col-span-2">
              <label className="block text-lg font-medium mb-3 sm:mb-4">
                Chọn dịch vụ
              </label>

              <div className="flex flex-wrap gap-2 mb-4">
                {selectedServices.map((service) => (
                  <div
                    key={service._id}
                    className="flex items-center bg-blue-100 rounded-full px-4 py-2 text-sm  font-medium transition-all hover:bg-blue-200"
                  >
                    <span>{service.name}</span>
                    <button
                      type="button"
                      onClick={() => toggleService(service)}
                      className="ml-2 hover:text-blue-900"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                {services?.map((service) => (
                  <div
                    key={service._id}
                    onClick={() => toggleService(service)}
                    className={`flex items-center p-4 rounded-xl cursor-pointer transition-all ${
                      selectedServices.some((s) => s._id === service._id)
                        ? "bg-blue-400 text-white  shadow-lg"
                        : "bg-blue-50  hover:bg-blue-100 border-2 border-blue-100"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        selectedServices.some((s) => s._id === service._id)
                          ? "bg-white text-blue-600"
                          : "bg-blue-200 text-transparent"
                      }`}
                    >
                      <FiCheck className="w-4 h-4" />
                    </div>
                    <span className="ml-3 text-sm font-medium">
                      {service.name}
                    </span>
                    <span className="ml-auto text-sm font-medium">
                      {formatPrice(service.price)} VNĐ
                    </span>
                  </div>
                ))}
              </div>
              {errors.services && (
                <p className="text-red-500 text-sm mt-2">{errors.services}</p>
              )}
            </div>

            {/* Ngày */}
            <div className="relative group">
              <FiCalendar className="absolute left-4 top-4 text-blue-500 text-xl" />
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-300 placeholder-blue-300 text-blue-700 font-medium"
              />
              {errors.date && (
                <p className="text-red-400 text-sm mt-1 ml-2 flex items-center gap-1">
                  <FiInfo className="inline" />
                  {errors.date}
                </p>
              )}
            </div>

            {/* Giờ */}
            <div className="relative group">
              <FiClock className="absolute left-4 top-4 text-blue-400 text-xl" />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-300 placeholder-blue-300 text-blue-700 font-medium"
              />
              {errors.time && (
                <p className="text-red-400 text-sm mt-1 ml-2 flex items-center gap-1">
                  <FiInfo className="inline" />
                  {errors.time}
                </p>
              )}
            </div>

            {/* Ghi chú */}
            <div className="md:col-span-2">
              <label className="block text-blue-700 text-lg font-medium mb-3 sm:mb-4">
                Ghi chú thêm (nếu có)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Vui lòng cho chúng tôi biết thêm yêu cầu của bạn..."
                className="w-full px-4 py-3 rounded-xl border-2 border-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-300 placeholder-blue-300 text-blue-700 font-medium"
                rows={3}
              />
            </div>
          </div>
          <div className="md:col-span-2 p-4 bg-blue-50 rounded-xl mt-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedServices.map((service) => (
                <div
                  key={service._id}
                  className="flex items-center bg-blue-100 rounded-full px-4 py-2 text-sm  font-medium transition-all hover:bg-blue-200"
                >
                  <span>{service.name}</span>
                </div>
              ))}
            </div>
            <p className="">
              Tổng cộng:{" "}
              <span className="font-bold text-red-500">
                {formatPrice(
                  selectedServices.reduce((sum, s) => sum + s.price, 0)
                )}
              </span>{" "}
              VNĐ{" "}
            </p>
            <p>
              Làm trong{" "}
              {selectedServices.reduce((sum, s) => sum + s.duration, 0)} phút
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-8 bg-gradient-to-r from-blue-400 to-blue-600 text-white py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-blue-200 hover:scale-[1.02] transition-all duration-300 ${
              isSubmitting ? "opacity-80 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Đang đặt lịch..." : "Xác nhận đặt lịch"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default BookingPage;
