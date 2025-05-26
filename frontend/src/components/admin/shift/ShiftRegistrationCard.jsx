import { useState } from "react";
import ShiftBadge from "./ShiftBadge";

const ShiftRegistrationCard = ({ shift, date, onRegister, isRegistered }) => {
  const [selectedShift, setSelectedShift] = useState(null);

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium">
          {new Date(date).toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "numeric",
            month: "numeric",
          })}
        </h4>
        {isRegistered ? (
          <ShiftBadge status="approved" />
        ) : (
          <span className="text-sm text-gray-500">Chưa đăng ký</span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        {shift.map((s) => (
          <div
            key={s._id}
            onClick={() => setSelectedShift(s._id)}
            className={`p-3 border rounded cursor-pointer ${
              selectedShift === s._id
                ? "border-blue-500 bg-blue-50"
                : "hover:bg-gray-50"
            }`}
          >
            <div className="flex justify-between">
              <ShiftBadge status={s.name} />
              <span className="text-sm">
                {s.startTime} - {s.endTime}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {s.maxEmployees - s.currentRegistrations} chỗ trống
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => onRegister(selectedShift, date)}
        disabled={!selectedShift || isRegistered}
        className={`w-full py-2 rounded ${
          !selectedShift || isRegistered
            ? "bg-gray-200 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {isRegistered ? "Đã đăng ký" : "Đăng ký ca này"}
      </button>
    </div>
  );
};

export default ShiftRegistrationCard;
