import React, { useContext, useEffect, useState } from "react";
import MyScheduleCalendar from "../MyScheduleCalendar";
import DatePicker from "../DatePicker";
import ShiftRegistrationCard from "../ShiftRegistrationCard";
import { AppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import workShiftApi from "../../services/workShiftService";
import { toast } from "react-toastify";

const StaffShift = () => {
  const { shifts } = useContext(AppContext);
  const { workShifts, getAllWorkShift } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  console.log("workShift Data", workShifts);
  const { user } = useAuth();

  const handleRegister = async (shiftId) => {
    try {
      const newReg = {
        shiftId: shiftId,
        staffId: user._id,
      };

      // API call to register workshift
      const response = await workShiftApi.register(newReg);
      const data = response.data;
      // console.log("res Data", data);
      if (data.success) {
        toast.success("Đăng ký thành công, chờ admin duyệt");
        getAllWorkShift();
      }
    } catch (error) {
      console.error("Error registering shift:", error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Đăng ký ca làm</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Ca Làm
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Ngày
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    action
                  </th>
                </tr>
              </thead>
              <tbody>
                {workShifts.length > 0 ? (
                  workShifts.map((item) => (
                    <tr key={item._id}>
                      <td>{item.shiftId.shiftType}</td>
                      <td>{item.shiftId.date}</td>
                      {item.status === "pending" ? (
                        <td className="text-yellow-500">{item.status}</td>
                      ) : item.status === "approved" ? (
                        <td className="text-green-500">{item.status}</td>
                      ) : (
                        <td className="text-red-50">{item.status}</td>
                      )}
                      <td>xoa</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      Không có ca làm nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="bg-white p-4 rounded-lg shadow sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Đăng ký ca</h2>
            <DatePicker
              selectedDate={selectedDate}
              onChange={setSelectedDate}
              className="mb-4"
            />

            {shifts.length > 0 ? (
              shifts.map((item) => (
                <div key={item._id} className="flex gap-3 m-2 justify-between">
                  <p>{item.shiftType}</p>
                  <p>{new Date(item.date).toLocaleDateString("vi-VN")}</p>
                  <p>
                    {item.startTime}-{item.endTime}
                  </p>
                  <button
                    onClick={() => handleRegister(item._id)}
                    className="bg-blue-500 text-white px-2 rounded-2xl cursor-pointer hover:bg-blue-400"
                  >
                    Đăng ký
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                Đang tải ca làm...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffShift;
