import { FiTrash2, FiEdit } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { toast } from "react-toastify";
import appointmentApi from "../../services/appointmentsService";
import MyScheduleCalendar from "../MyScheduleCalendar";

const StaffAppointment = () => {
  const { appointments, getAllAppointments } = useAuth();
  // const { formatPrice } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Số item mỗi trang

  // Lọc lịch hẹn để loại bỏ trạng thái "cancelled" hoặc "completed"
  const appointmentsPendingandConf = appointments.filter(
    (item) => item.status !== "cancelled" && item.status !== "completed"
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

  const confirmAppointment = async (id) => {
    const { data } = await appointmentApi.confirmed(id);
    console.log("data ", data);
    if (data.success) {
      toast.success("Xác nhận thành công");
      getAllAppointments();
    } else {
      toast.error("Xác nhận thất bại");
    }
  };

  return (
    <div className="sm:block md:block lg:flex xl:flex 2xl:flex ">
      <div className="">
        <MyScheduleCalendar registrations={appointments} />
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Appointments Table */}
        <div className=" rounded-lg overflow-hidden mb-4">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Customer & Phone
                </th>

                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Services
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Staff name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Date & Time
                </th>

                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {currentAppoitments.length > 0 ? (
                currentAppoitments?.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
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
                      {appointment.staffId.name}
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
    </div>
  );
};

export default StaffAppointment;
