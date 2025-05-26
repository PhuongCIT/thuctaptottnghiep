import { useState } from "react";
import ShiftBadge from "./ShiftBadge";

const MyScheduleCalendar = ({ registrations }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dayReg = registrations.find(
        (r) => new Date(r.date).toDateString() === d.toDateString()
      );

      days.push(
        <div key={d} className="border p-2 h-24">
          <div className="flex justify-between">
            <span
              className={`text-sm ${
                d.toDateString() === new Date().toDateString()
                  ? "bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center"
                  : ""
              }`}
            >
              {d.getDate()}
            </span>
            {dayReg && <ShiftBadge status={dayReg.shift.name} size="xs" />}
          </div>
          {dayReg && (
            <div className="mt-1 text-xs">
              <div>
                {dayReg.shift.startTime} - {dayReg.shift.endTime}
              </div>
              <ShiftBadge status={dayReg.status} size="xs" />
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-3 bg-gray-50">
        <button
          onClick={() =>
            setCurrentMonth(
              (prev) => new Date(prev.setMonth(prev.getMonth() - 1))
            )
          }
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
          onClick={() =>
            setCurrentMonth(
              (prev) => new Date(prev.setMonth(prev.getMonth() + 1))
            )
          }
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
