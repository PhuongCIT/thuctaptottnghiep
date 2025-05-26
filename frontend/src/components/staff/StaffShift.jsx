import React, { useState } from "react";
import MyScheduleCalendar from "../admin/shift/MyScheduleCalendar";
import DatePicker from "../admin/shift/DatePicker";
import ShiftRegistrationCard from "../admin/shift/ShiftRegistrationCard";

const StaffShift = () => {
  const [shifts, setShifts] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleRegister = async (shiftId, date) => {
    // API call to register
    const newReg = {
      _id: Math.random().toString(36).substring(7),
      shift: shifts.find((s) => s._id === shiftId),
      date,
      status: "pending",
    };
    setRegistrations([...registrations, newReg]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Đăng ký ca làm</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">Lịch tháng</h2>
            <MyScheduleCalendar registrations={registrations} />
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
              <ShiftRegistrationCard
                shift={shifts}
                date={selectedDate}
                onRegister={handleRegister}
                isRegistered={registrations.some(
                  (r) =>
                    new Date(r.date).toDateString() ===
                    selectedDate.toDateString()
                )}
              />
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
