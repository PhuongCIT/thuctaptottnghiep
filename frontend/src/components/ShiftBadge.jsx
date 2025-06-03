const ShiftBadge = ({ status }) => {
  const statusConfig = {
    pending: { text: "text-amber-600", label: "Chờ duyệt" },
    confirmed: {
      text: "text-green-500",

      label: "Đã duyệt",
    },
    cancelled: { text: "text-red-600", label: "Đã hủy" },
    completed: { text: "text-green-600", label: "Đã hoàn thành" },
    approved: { text: "text-green-600", bg: "bg-green-100", label: "Đã duyệt" },
    rejected: { text: "text-red-600", bg: "bg-red-100", label: "Từ chối" },
    Ca1: { text: "text-blue-600", bg: "bg-blue-100", label: "Ca 1" },
    Ca2: {
      text: "text-purple-600",
      bg: "bg-purple-100",
      label: "Ca 2",
    },
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium  ${
        statusConfig[status]?.text || "text-gray-800"
      }`}
    >
      {statusConfig[status]?.label || status}
    </span>
  );
};
export default ShiftBadge;
