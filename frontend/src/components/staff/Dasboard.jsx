import React, { useContext } from "react";
import { customers } from "../../assets/data/db";
import { AppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

const Dasboard = () => {
  const { services, staffs } = useContext(AppContext);
  const { appointments } = useAuth();

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          <p className="text-2xl font-bold">{customers.length}</p>
          <h2 className="text-gray-500">Khách hàng</h2>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <p className="text-2xl font-bold">{staffs.length}</p>
          <h2 className="text-gray-500">Nhân viên</h2>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <p className="text-2xl font-bold">{services.length}</p>
          <h2 className="text-gray-500">Dịch vụ</h2>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <p className="text-2xl font-bold">{appointments.length}</p>
          <h2 className="text-gray-500">Cuộc hẹn</h2>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <p className="text-2xl font-bold">$12,500</p>
          <h2 className="text-gray-500">Tổng doanh thu</h2>
        </div>
      </div>
    </div>
  );
};

export default Dasboard;
