import { Calendar } from "lucide-react";

const DatePicker = ({ selectedDate, onChange }) => (
  <div className="relative">
    <input
      type="date"
      min={new Date().toISOString().split("T")[0]}
      value={selectedDate}
      onChange={(e) => onChange(new Date(e.target.value))}
      className="pl-10 pr-3 py-2 border rounded-lg w-full"
    />
    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
  </div>
);
export default DatePicker;
