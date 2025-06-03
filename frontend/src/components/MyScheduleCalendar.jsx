import { useState } from "react";
import ShiftBadge from "./ShiftBadge";

const MyScheduleCalendar = ({ registrations }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getRegistrationsForDate = (date) => {
    return registrations.filter(
      (reg) => new Date(reg.date).toDateString() === date.toDateString()
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const endDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );

    // Thêm các ngày trống từ đầu tuần
    const firstDayOfMonth = startDate.getDay();
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="border p-2 h-24 bg-gray-50"></div>
      );
    }

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dayRegistrations = getRegistrationsForDate(d);
      const isToday = d.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={d.toISOString()}
          className={`border p-2 h-24 ${
            isToday ? "bg-blue-50" : "bg-white"
          } hover:bg-gray-50 transition-colors`}
        >
          <div className="flex justify-between items-start">
            <span
              className={`text-sm ${
                isToday
                  ? "bg-red-300 rounded-full w-6 h-6 flex items-center justify-center"
                  : ""
              }`}
            >
              {d.getDate()}
            </span>
            {dayRegistrations.length > 3 && (
              <span className="text-xs text-blue-600 font-medium">
                +{dayRegistrations.length - 2}
              </span>
            )}
          </div>

          <div className="mt-1 space-y-1 overflow-hidden">
            {dayRegistrations.slice(0, 3).map((reg, index) => (
              <div
                key={reg._id || index}
                className="flex items-center gap-1 text-xs bg-white rounded p-1 shadow-sm"
              >
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {reg.startTime}
                  <ShiftBadge status={reg.status} size="xs" />
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
    );
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
    );
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="flex justify-between items-center p-3 bg-gray-50 border-b">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          &lt;
        </button>
        <h3 className="font-medium">
          {currentMonth.toLocaleDateString("vi-VN", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
          <div
            key={day}
            className="bg-gray-50 p-2 text-center text-sm font-medium"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">{renderDays()}</div>
    </div>
  );
};

export default MyScheduleCalendar;
