import { useState } from "react";
import Modal from "../../../lib/modal";

const CreateShiftModal = ({ isOpen, onClose, onCreate }) => {
  const [shift, setShift] = useState({
    name: "morning",
    startTime: "08:00",
    endTime: "12:00",
    maxEmployees: 5,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-lg font-semibold mb-4">Tạo ca làm mới</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Loại ca</label>
          <select
            value={shift.name}
            onChange={(e) => setShift({ ...shift, name: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="morning">Ca sáng</option>
            <option value="afternoon">Ca chiều</option>
            <option value="evening">Ca tối</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Giờ bắt đầu
            </label>
            <input
              type="time"
              value={shift.startTime}
              onChange={(e) =>
                setShift({ ...shift, startTime: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Giờ kết thúc
            </label>
            <input
              type="time"
              value={shift.endTime}
              onChange={(e) => setShift({ ...shift, endTime: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <button
          onClick={() => onCreate(shift)}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Tạo ca làm
        </button>
      </div>
    </Modal>
  );
};
export default CreateShiftModal;
