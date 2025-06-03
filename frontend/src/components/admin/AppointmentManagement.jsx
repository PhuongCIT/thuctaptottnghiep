import { FiTrash2, FiEdit, FiCheck, FiBell } from "react-icons/fi"; // Thêm FiBell
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify"; // Thêm toast
import axios from "axios";

const AppointmentManagement = () => {
  const { appointments, completeAppointment, confirmAppointment } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAppointments, setSelectedAppointments] = useState([]); // State cho việc chọn lịch hẹn
  const [isSendingNotification, setIsSendingNotification] = useState(false); // Loading state

  // Filter appointments
  const filteredAppointments = appointments.filter((appointment) => {
    if (statusFilter === "all") return true;
    return appointment.status === statusFilter;
  });

  // Tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppoitments = filteredAppointments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  // Chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  // Reset về trang 1 khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  // Thêm hàm xử lý chọn lịch hẹn
  const handleSelectAppointment = (appointmentId) => {
    setSelectedAppointments((prev) => {
      if (prev.includes(appointmentId)) {
        return prev.filter((id) => id !== appointmentId);
      }
      return [...prev, appointmentId];
    });
  };

  // Thêm hàm gửi thông báo
  const handleSendNotifications = async () => {
    if (selectedAppointments.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một lịch hẹn");
      return;
    }

    setIsSendingNotification(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/notifications/send-reminders",
        {
          appointmentIds: selectedAppointments,
        }
      );

      console.log("response ", response);

      if (response.data.success) {
        toast.success(
          `Đã gửi thông báo thành công cho ${response.data.message}`
        );
        setSelectedAppointments([]); // Reset selection
      } else {
        toast.error(response.message || "Có lỗi xảy ra khi gửi thông báo");
      }
    } catch (error) {
      toast.error("Không thể kết nối đến server");
      console.error("Error sending notifications:", error);
    } finally {
      setIsSendingNotification(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* Thêm phần controls */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={handleSendNotifications}
            disabled={
              selectedAppointments.length === 0 || isSendingNotification
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              selectedAppointments.length === 0 || isSendingNotification
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            <FiBell className="w-5 h-5" />
            {isSendingNotification ? "Đang gửi..." : "Gửi thông báo"}
            {selectedAppointments.length > 0 &&
              ` (${selectedAppointments.length})`}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Lọc theo trạng thái:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>
      {/* Appointments Table */}
      <div className="rounded-lg overflow-hidden mb-4">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    currentAppoitments.length > 0 &&
                    currentAppoitments.every((apt) =>
                      selectedAppointments.includes(apt._id)
                    )
                  }
                  onChange={() => {
                    const validAppointments = currentAppoitments.filter((apt) =>
                      ["pending", "confirmed"].includes(apt.status)
                    );

                    if (
                      validAppointments.every((apt) =>
                        selectedAppointments.includes(apt._id)
                      )
                    ) {
                      setSelectedAppointments((prev) =>
                        prev.filter(
                          (id) =>
                            !validAppointments.find((apt) => apt._id === id)
                        )
                      );
                    } else {
                      setSelectedAppointments((prev) => [
                        ...prev,
                        ...validAppointments
                          .map((apt) => apt._id)
                          .filter((id) => !prev.includes(id)),
                      ]);
                    }
                  }}
                  className="rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Customer & Phone
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Services
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Tổng giá
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Staff name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 flex items-center">
                Status
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="ml-2 p-1 border rounded text-sm"
                >
                  <option value="all">Tất cả</option>
                  <option value="pending">pending</option>
                  <option value="confirmed">confirmed</option>
                  <option value="completed">completed</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentAppoitments.length > 0 ? (
              currentAppoitments?.map((appointment) => (
                <tr
                  key={appointment._id}
                  className={`border-b transition ${
                    selectedAppointments.includes(appointment._id)
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedAppointments.includes(appointment._id)}
                      onChange={() => handleSelectAppointment(appointment._id)}
                      disabled={
                        !["pending", "confirmed"].includes(appointment.status)
                      }
                      className="rounded"
                    />
                  </td>
                  <td className="px-3 py-2  ">
                    <p className="font-semibold">
                      {appointment.customerId.name}
                    </p>
                    <p>{appointment.customerId.phone}</p>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-800">
                    {appointment.services.map((service) => (
                      <span
                        key={service._id}
                        className="bg-blue-200 rounded-2xl mx-1"
                      >
                        {service.name}
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {formatPrice(appointment.totalPrice)} VNĐ
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {appointment.staffId?.name || "Null"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {new Date(appointment.date).toLocaleDateString("vi-VN")} |
                    {new Date(
                      `2000-01-01T${appointment.startTime}`
                    ).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  {appointment.status === "pending" && (
                    <td className="px-6 py-4 text-sm text-gray-800 ">
                      <span
                        onClick={() => confirmAppointment(appointment._id)}
                        className="bg-amber-200 border-r-amber-200  px-2 rounded cursor-pointer hover:bg-amber-100"
                      >
                        {appointment.status}
                      </span>
                    </td>
                  )}
                  {appointment.status === "confirmed" && (
                    <td className="px-6 py-4 text-sm text-yellow-500 font-bold">
                      {appointment.status}
                    </td>
                  )}
                  {appointment.status === "cancelled" && (
                    <td className="px-6 py-4 text-sm text-red-500 font-bold">
                      {appointment.status}
                    </td>
                  )}
                  {appointment.status === "completed" && (
                    <td className="px-6 py-4 text-sm text-green-500 font-bold">
                      {appointment.status}
                    </td>
                  )}
                  <td className="px-6 py-4 text-center flex gap-2">
                    {appointment.status === "completed" ||
                      (appointment.status !== "cancelled" && (
                        <button
                          onClick={() => completeAppointment(appointment._id)}
                          className="ml-4 w-7 h-7 text-green-500 hover:text-green-700 transition border rounded-full cursor-pointer"
                        >
                          <FiCheck className="inline w-5 h-5" />
                        </button>
                      ))}
                    <button
                      // onClick={() => handleDelete(appointment.id)}
                      className="text-red-500 hover:text-red-700 transition cursor-pointer"
                    >
                      <FiTrash2 className="inline w-5 h-5" />
                    </button>
                    <button className="ml-4 text-yellow-500 hover:text-yellow-700 transition cursor-pointer">
                      <FiEdit className="inline w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  Không có lịch hẹn nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Phân trang */}
      {filteredAppointments.length > itemsPerPage && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Hiển thị {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, filteredAppointments.length)} trong tổng{" "}
            {filteredAppointments.length} Lịch hẹn
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
  );
};

export default AppointmentManagement;
