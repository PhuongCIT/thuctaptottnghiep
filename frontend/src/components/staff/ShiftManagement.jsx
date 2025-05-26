import React, { useState } from "react";
import CreateShiftModal from "./shift/CreateShiftModal";
import ApprovalTable from "./shift/ApprovalTable";

const ShiftManagement = () => {
  const [shifts, setShifts] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApprove = async (id, action) => {
    // API call to approve/reject
    const updated = registrations.map((r) =>
      r._id === id ? { ...r, status: action } : r
    );
    setRegistrations(updated);
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
        onCreate={(newShift) => setShifts([...shifts, newShift])}
      />

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Yêu cầu đăng ký chờ duyệt
        </h2>
        <ApprovalTable
          registrations={registrations.filter((r) => r.status === "pending")}
          onApprove={handleApprove}
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Tất cả đăng ký</h2>
        <ApprovalTable
          registrations={registrations}
          onApprove={handleApprove}
        />
      </div>
    </div>
  );
};

export default ShiftManagement;
