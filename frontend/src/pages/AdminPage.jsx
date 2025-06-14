import React, { useState } from "react";
import StaffManagement from "../components/admin/StaffManagement";
import ServiceManagement from "../components/admin/ServiceManagement";
import AppointmentManagement from "../components/admin/AppointmentManagement";
import Dasboard from "../components/admin/Dasboard";
import { useAuth } from "../context/AuthContext";
import ShiftManagement from "../components/admin/ShiftManagement";
import ContactManaement from "../components/admin/ContactManagement";
import CustomerManagement from "../components/admin/CustomerManagement";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dasboard");
  const { user } = useAuth();
  return user?.role === "admin" ? (
    <div className="mt-10 mb-20">
      <div className="min-h-max bg-gray-100">
        {/* Tabs */}
        <div className=" mx-auto px-6 py-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("dasboard")}
              className={`px-4 py-2 rounded-lg font-bold cursor-pointer ${
                activeTab === "dasboard"
                  ? "bg-blue-500 hover:bg-blue-400 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-200"
              }`}
            >
              Dasboard
            </button>
            <button
              onClick={() => setActiveTab("staffs")}
              className={`px-4 py-2 rounded-lg font-bold cursor-pointer ${
                activeTab === "staffs"
                  ? "bg-blue-500 hover:bg-blue-400 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-200"
              }`}
            >
              Staffs
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`px-4 py-2 rounded-lg font-bold cursor-pointer ${
                activeTab === "services"
                  ? "bg-blue-500 hover:bg-blue-400 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-200"
              }`}
            >
              Services
            </button>

            <button
              onClick={() => setActiveTab("appointments")}
              className={`px-4 py-2 rounded-lg font-bold cursor-pointer ${
                activeTab === "appointments"
                  ? "bg-blue-500 hover:bg-blue-400 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-200"
              }`}
            >
              Appointments
            </button>

            <button
              onClick={() => setActiveTab("shift")}
              className={`px-4 py-2 rounded-lg font-bold cursor-pointer ${
                activeTab === "shift"
                  ? "bg-blue-500 hover:bg-blue-400 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-200"
              }`}
            >
              Shift
            </button>

            <button
              onClick={() => setActiveTab("customer")}
              className={`px-4 py-2 rounded-lg font-bold cursor-pointer ${
                activeTab === "customer"
                  ? "bg-blue-500 hover:bg-blue-400 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-200"
              }`}
            >
              Customer
            </button>

            <button
              onClick={() => setActiveTab("contact")}
              className={`px-4 py-2 rounded-lg font-bold cursor-pointer ${
                activeTab === "contact"
                  ? "bg-blue-500 hover:bg-blue-400 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-200"
              }`}
            >
              Contact
            </button>
          </div>
        </div>

        {/* Content */}
        <div className=" mx-auto px-6 py-4">
          {activeTab === "staffs" && <StaffManagement />}
          {activeTab === "services" && <ServiceManagement />}
          {activeTab === "appointments" && <AppointmentManagement />}
          {activeTab === "dasboard" && <Dasboard />}
          {activeTab === "shift" && <ShiftManagement />}
          {activeTab === "contact" && <ContactManaement />}
          {activeTab === "customer" && <CustomerManagement />}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        Vui lòng dùng tài khoản admin để truy cập
      </h1>
      <p className="text-gray-600 mb-4">
        You need to be logged in to access this page.
      </p>
      <button
        onClick={() => (window.location.href = "/login")}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
      >
        Go to Login
      </button>
    </div>
  );
};

export default AdminPage;
