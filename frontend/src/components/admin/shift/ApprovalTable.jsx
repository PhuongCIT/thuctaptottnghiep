const ApprovalTable = ({ registrations, onApprove }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
              Nhân viên
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
              Ngày
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
              Ca
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
              Trạng thái
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {registrations.map((reg) => (
            <tr key={reg._id}>
              <td className="px-4 py-3 whitespace-nowrap">
                {reg.employee.name}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {new Date(reg.date).toLocaleDateString("vi-VN")}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <ShiftBadge status={reg.shift.name} />
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <ShiftBadge status={reg.status} />
              </td>
              <td className="px-4 py-3 whitespace-nowrap space-x-2">
                {reg.status === "pending" && (
                  <>
                    <button
                      onClick={() => onApprove(reg._id, "approved")}
                      className="text-green-600 hover:text-green-800"
                    >
                      Duyệt
                    </button>
                    <button
                      onClick={() => onApprove(reg._id, "rejected")}
                      className="text-red-600 hover:text-red-800"
                    >
                      Từ chối
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApprovalTable;
