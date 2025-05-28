import React, { useContext, useState } from "react";
import CreateShiftModal from "./shift/CreateShiftModal";
import ApprovalTable from "./shift/ApprovalTable";
import { AppContext } from "../../context/AppContext";
import { FiTrash2, FiEdit } from "react-icons/fi";
import shiftApi from "../../services/shiftService";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const ShiftManagement = () => {
  const { shifts, getAllShifts } = useContext(AppContext);
  const { workShifts } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (_id) => {
    // API call to delete
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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
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
                {shifts.map((item) => (
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
        </div>
      </div>
    </div>
  );
};

export default ShiftManagement;
