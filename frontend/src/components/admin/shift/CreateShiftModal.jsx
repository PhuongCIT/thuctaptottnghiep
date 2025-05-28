import { useContext, useState } from "react";
import Modal from "../../../lib/modal";
import shiftApi from "../../../services/shiftService";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";

const CreateShiftModal = ({ isOpen, onClose }) => {
  const { getAllShifts } = useContext(AppContext);
  const [shift, setShift] = useState({
    shiftType: "",
    date: "",
    max: 0,
  });

  //gọi api tạo ca làm
  const handleCreateShift = async () => {
    try {
      console.log("shift", shift);
      const response = await shiftApi.create(shift);
      console.log("resData ", response);
      const data = response.data;
      if (data.success) {
        toast.success(data.message);
        //tạo ca làm thành công
        getAllShifts();
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-lg font-semibold mb-4">Tạo ca làm mới</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Loại ca</label>
          <select
            value={shift.shiftType}
            onChange={(e) => setShift({ ...shift, shiftType: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">Chọn ca</option>
            <option value="Ca1">Ca 1</option>
            <option value="Ca2">Ca 2</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm font-medium mb-1">Ngày</label>
          <input
            type="date"
            value={shift.date}
            onChange={(e) => setShift({ ...shift, date: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <label className="block text-sm font-medium mb-1">Số lượng</label>
          <input
            type="number"
            value={shift.max}
            onChange={(e) => setShift({ ...shift, max: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={handleCreateShift}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Tạo ca làm
        </button>
      </div>
    </Modal>
  );
};
export default CreateShiftModal;
