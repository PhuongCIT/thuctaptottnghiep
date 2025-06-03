import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import StaffShift from "../components/staff/StaffShift";
import StaffAppointment from "../components/staff/StaffAppointment";

const StaffPage = () => {
  const [activeTab, setActiveTab] = useState("shift");
  const { user } = useAuth();
  return user?.role === "staff" ? (
    <div className="mt-10">
      <div className="min-h-screen bg-gray-100">
        {/* Tabs */}
        <div className=" mx-auto px-6 py-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("appointments")}
              className={`px-4 py-2 rounded-lg font-bold cursor-pointer ${
                activeTab === "appointments"
                  ? "bg-blue-400 hover:bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-200"
              }`}
            >
              Appointments
            </button>

            <button
              onClick={() => setActiveTab("shift")}
              className={`px-4 py-2 rounded-lg font-bold cursor-pointer ${
                activeTab === "shift"
                  ? "bg-blue-400 hover:bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-200"
              }`}
            >
              Shift
            </button>
          </div>
        </div>

        {/* Content */}
        <div className=" mx-auto px-6 py-4">
          {activeTab === "appointments" && <StaffAppointment />}

          {activeTab === "shift" && <StaffShift />}
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

export default StaffPage;
