import React, { useContext, useState } from "react";
import CreateShiftModal from "./shift/CreateShiftModal";
import ApprovalTable from "./shift/ApprovalTable";
import { AppContext } from "../../context/AppContext";
import { FiTrash2, FiEdit } from "react-icons/fi";
import shiftApi from "../../services/shiftService";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import ReactPaginate from "react-paginate";

const ShiftManagement = () => {
  const { shifts, getAllShifts } = useContext(AppContext);
  const { workShifts } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Số item mỗi trang

  // Tính toán dữ liệu phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentShifts = shifts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(shifts.length / itemsPerPage);

  // Hàm chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (_id) => {
    if (window.confirm("Bạn có chắc muốn xóa ca làm này?")) {
      try {
        await shiftApi.delete(_id);
        toast.success("Xóa thành công");
        getAllShifts();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="p-6">
      {/* Phần header giữ nguyên */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý ca làm</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Tạo ca mới
        </button>
      </div>

      <CreateShiftModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="flex gap-3">
        {/* Phần bên trái giữ nguyên */}
        <div className="w-full">
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">
              Yêu cầu đăng ký chờ duyệt
            </h2>
            <ApprovalTable
              registrations={workShifts.filter((r) => r.status === "pending")}
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Tất cả đăng ký</h2>
            <ApprovalTable
              registrations={workShifts.filter((r) => r.status !== "pending")}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Tất cả ca làm</h2>
          <div className="overflow-x-auto border rounded border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                    Ca
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                    Ngày
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                    Số lượng
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentShifts.map((item) => (
                  <tr key={item._id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {item.shiftType}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(item.date).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.max}</td>
                    <td className="px-4 py-3 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-500 hover:text-red-700 transition cursor-pointer"
                      >
                        <FiTrash2 className="inline w-5 h-5" />
                      </button>
                      <button className="ml-4 text-yellow-500 hover:text-yellow-700 transition cursor-pointer">
                        <FiEdit className="inline w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-5">
            <div className="text-sm text-gray-500">
              {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, shifts.length)}{" "}
              trên {shifts.length}
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
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
                )
              )}

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
      </div>
    </div>
  );
};

export default ShiftManagement;
