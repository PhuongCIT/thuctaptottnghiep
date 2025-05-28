import { useContext, useState } from "react";
import ShiftBadge from "../../ShiftBadge";
import workShiftApi from "../../../services/workShiftService";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";

const ApprovalTable = ({ registrations }) => {
  const { getAllShifts } = useContext(AppContext);

  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Số item mỗi trang

  // Tính toán dữ liệu phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = registrations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(registrations.length / itemsPerPage);

  // Hàm chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleApprove = async (id) => {
    try {
      // API call to approve/reject

      const res = await workShiftApi.approve(id);
      const data = res.data;
      console.log("updatedShift ", data);
      if (data.success) {
        getAllShifts();
        toast.success("Duyệt thành công");
      } else {
        toast.error("Duyệt thất bại");
      }
    } catch (error) {
      console.error(error);
      // toast.error(error.response.data.error);
    }
  };
  return (
    <div className="space-y-4">
      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Phần header giữ nguyên như cũ */}
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Nhân viên
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Ngày
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Ca
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Hành động
              </th>
            </tr>
          </thead>

          {/* Hiển thị dữ liệu đã phân trang */}
          <tbody className="divide-y divide-gray-200">
            {currentItems.map((reg) => (
              <tr key={reg._id}>
                {/* Các cột dữ liệu giữ nguyên */}
                <td className="px-4 py-3 whitespace-nowrap">
                  {reg.staffId.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {/* {new Date(reg.shiftId.date).toLocaleDateString("vi-VN")} */}
                  {reg.shiftId.date}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <ShiftBadge status={reg.shiftId.shiftType} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <ShiftBadge status={reg.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap space-x-2">
                  {reg.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(reg._id)}
                        className="text-white hover:bg-green-400 bg-green-500 px-2 rounded cursor-pointer"
                      >
                        Duyệt
                      </button>
                      <button
                        // onClick={() => onApprove(reg._id, "rejected")}
                        className="text-white hover:bg-red-400 bg-red-500 px-2 rounded cursor-pointer"
                      >
                        Từ chối
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phần điều hướng phân trang */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Hiển thị {indexOfFirstItem + 1}-
          {Math.min(indexOfLastItem, registrations.length)} trên{" "}
          {registrations.length} kết quả
        </div>

        <div className="flex space-x-1">
          {/* Nút quay lại trang trước */}
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            &larr; Trước
          </button>

          {/* Hiển thị số trang */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded ${
                currentPage === number
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 hover:bg-blue-50"
              }`}
            >
              {number}
            </button>
          ))}

          {/* Nút chuyển đến trang sau */}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Sau &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalTable;
