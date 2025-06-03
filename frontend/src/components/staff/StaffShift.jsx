import React, { useContext, useState, useMemo } from "react";
import DatePicker from "../DatePicker";
import { AppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import workShiftApi from "../../services/workShiftService";
import { toast } from "react-toastify";

const StaffShift = () => {
  const { shifts } = useContext(AppContext);
  const { workShifts, getAllWorkShift } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { user } = useAuth();

  // Hàm để format date thành chuỗi YYYY-MM-DD
  const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  // Lọc ca làm theo ngày đã chọn
  const filteredShifts = useMemo(() => {
    return shifts.filter(
      (shift) => formatDate(shift.date) === formatDate(selectedDate)
    );
  }, [shifts, selectedDate]);

  // Lọc workShifts (ca làm đã đăng ký) theo ngày
  // const filteredWorkShifts = useMemo(() => {
  //   return workShifts.filter(
  //     (workShift) =>
  //       formatDate(workShift.shiftId.date) === formatDate(selectedDate)
  //   );
  // }, [workShifts, selectedDate]);

  // Kiểm tra xem một ca đã được đăng ký chưa
  const isShiftRegistered = (shiftId) => {
    return workShifts.some(
      (workShift) =>
        workShift.shiftId._id === shiftId &&
        (workShift.status === "pending" || workShift.status === "approved")
    );
  };

  const handleRegister = async (shiftId) => {
    try {
      // Kiểm tra xem ca này đã được đăng ký chưa
      if (isShiftRegistered(shiftId)) {
        toast.warning("Bạn đã đăng ký ca này rồi!");
        return;
      }

      const newReg = {
        shiftId: shiftId,
        staffId: user._id,
      };

      const response = await workShiftApi.register(newReg);
      const data = response.data;

      if (data.success) {
        toast.success("Đăng ký thành công, chờ admin duyệt");
        getAllWorkShift();
      }
    } catch (error) {
      console.error("Error registering shift:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi đăng ký ca"
      );
    }
  };

  const handleCancelShift = async (workShiftId) => {
    try {
      // Thêm API call để hủy ca làm
      const response = await workShiftApi.cancelShift(workShiftId);
      if (response.data.success) {
        toast.success("Hủy ca làm thành công");
        getAllWorkShift();
      }
    } catch (error) {
      console.error("Error canceling shift:", error);
      toast.error("Không thể hủy ca làm");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Đăng ký ca làm</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium text-gray-600">
                    Ca Làm
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-600">
                    Ngày
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-600">
                    Giờ bắt đầu & kết thúc
                  </th>

                  <th className="px-6 py-3 text-sm font-medium text-gray-600">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {workShifts.length > 0 ? (
                  workShifts.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-200">
                      <td className="text-center">{item.shiftId.shiftType}</td>
                      <td className="text-center">
                        {new Date(item.shiftId.date).toLocaleDateString(
                          "vi-VN"
                        )}
                      </td>
                      <td className="text-center">
                        {item.shiftId.startTime}-{item.shiftId.endTime}
                      </td>
                      <td
                        className={`text-center ${
                          item.status === "pending"
                            ? "text-yellow-500"
                            : item.status === "approved"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {item.status}
                      </td>
                      <td className="text-center">
                        {item.status === "pending" && (
                          <button
                            onClick={() => handleCancelShift(item._id)}
                            className="bg-red-500 hover:bg-red-400 px-2 py-1 rounded-2xl text-white cursor-pointer"
                          >
                            Hủy
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      Không có ca làm nào trong ngày này
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow sticky top-4">
          <h2 className="text-lg font-semibold mb-4">Đăng ký ca</h2>
          <DatePicker
            selectedDate={selectedDate}
            onChange={setSelectedDate}
            className="mb-4"
          />

          <div className="max-h-[400px] overflow-y-auto">
            {filteredShifts.length > 0 ? (
              filteredShifts.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-3 m-2 justify-between items-center p-2 hover:bg-gray-50 rounded"
                >
                  <p className="flex-1">{item.shiftType}</p>
                  <p className="flex-1 text-sm text-gray-600">
                    {new Date(item.date).toLocaleDateString("vi-VN")}
                  </p>
                  <p className="flex-1 text-sm">
                    {item.startTime}-{item.endTime}
                  </p>
                  <button
                    onClick={() => handleRegister(item._id)}
                    disabled={isShiftRegistered(item._id)}
                    className={`px-3 py-1 rounded-lg cursor-pointer transition
                      ${
                        isShiftRegistered(item._id)
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-400"
                      }`}
                  >
                    {isShiftRegistered(item._id) ? "Đã đăng ký" : "Đăng ký"}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                Không có ca làm nào trong ngày này
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffShift;
