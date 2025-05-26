const ShiftBadge = ({ status }) => {
  const statusConfig = {
    pending: { text: "text-amber-600", bg: "bg-amber-100", label: "Chờ duyệt" },
    approved: { text: "text-green-600", bg: "bg-green-100", label: "Đã duyệt" },
    rejected: { text: "text-red-600", bg: "bg-red-100", label: "Từ chối" },
    morning: { text: "text-blue-600", bg: "bg-blue-100", label: "Ca sáng" },
    afternoon: {
      text: "text-purple-600",
      bg: "bg-purple-100",
      label: "Ca chiều",
    },
    evening: { text: "text-gray-600", bg: "bg-gray-100", label: "Ca tối" },
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        statusConfig[status]?.bg || "bg-gray-100"
      } ${statusConfig[status]?.text || "text-gray-800"}`}
    >
      {statusConfig[status]?.label || status}
    </span>
  );
};
export default ShiftBadge;
