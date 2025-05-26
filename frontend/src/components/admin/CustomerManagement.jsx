import React, { useContext, useState } from "react";
import AddUser from "./user/AddUser";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import userApi from "../../services/userService";

const CustomerManagement = () => {
  const { getCustomers, customers } = useContext(AppContext);
  const [openAdd, setOpenAdd] = useState(false);

  const handleCloseAdd = () => setOpenAdd(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Số item mỗi trang

  // Tính toán dữ liệu phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = customers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(customers.length / itemsPerPage);

  // Chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // const handleEdit = (_id) => {
  // setSelectedServiceId(id);
  // setOpenEdit(true);
  // };
  const handleDelete = async (_id) => {
    if (window.confirm("Bạn có chắc muốn Khách hàng này?")) {
      try {
        await userApi.deleteCustomer(_id);
        toast.success("Khách hàng đã bị xóa thành công!");
        getCustomers();
      } catch (error) {
        console.error("Lỗi khi xoá Khách hàng:", error);
        toast.error("Có lỗi khi xóa Khách hàng. Vui lòng thử lại!");
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Customers List</h2>
        <button
          onClick={() => setOpenAdd(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Add Customer
        </button>
      </div>
      <AddUser
        open={openAdd}
        onClose={handleCloseAdd}
        onSuccess={() => {
          getCustomers(); // Cập nhật danh sách dịch vụ sau khi thêm mới
          handleCloseAdd();
        }}
      />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 text-center">#</th>

              <th className="border border-gray-300 px-4 py-2 text-left">
                Tên Khách hàng
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Hình
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Email
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Số điện thoại
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Giới tính
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                ngày sinh
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((Customer, index) => (
              <tr key={Customer._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {Customer.name}
                </td>
                <td className="border border-gray-300 px-4 py-2 ">
                  <img
                    src={Customer.image}
                    alt={Customer.name}
                    className="w-20 h-20 rounded-full"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {Customer.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {Customer.phone}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {Customer.gender}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {Customer?.dob || "Null"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="bg-amber-200 cursor-pointer rounded px-1"
                    // onClick={() => handleEdit(Customer._id)}
                  >
                    Sửa
                  </button>
                  <button
                    className="bg-red-300 cursor-pointer ml-3 rounded px-1"
                    onClick={() => handleDelete(Customer._id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phần phân trang */}
      <div className="flex justify-between items-center mt-6">
        <span className="text-gray-600">
          Showing {indexOfFirstItem + 1}-
          {Math.min(indexOfLastItem, customers.length)} of {customers.length}
        </span>

        <div className="flex space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg border ${
              currentPage === 1
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-4 py-2 rounded-lg border ${
                currentPage === number
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg border ${
              currentPage === totalPages
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;
