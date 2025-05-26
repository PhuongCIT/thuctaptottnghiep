import React, { useContext, useState } from "react";
import ServiceAdd from "./service/ServiceAdd";
import { AppContext } from "../../context/AppContext";
import serviceApi from "../../services/serviceService";
import { toast } from "react-toastify";
import ServiceEdit from "./service/ServiceEdit";

const ServiceManagement = () => {
  const {
    getAllServices,
    services,
    formatPrice,
    errorService,
    loadingService,
  } = useContext(AppContext);
  // const [loadingStaffs, setLoadingStaff] = useState(false);
  // const [errorStaffs, setErrorStaff] = useState(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [serviceId, setServiceId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Số item mỗi trang

  // Tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServices = services.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(services.length / itemsPerPage);

  // Chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleCloseAdd = () => setOpenAdd(false);

  const handleEdit = (id) => {
    setServiceId(id);
    setEditModalOpen(true);
  };
  const handleDelete = async (_id) => {
    if (window.confirm("Bạn có chắc muốn xóa dịch vụ này?")) {
      try {
        await serviceApi.delete(_id);
        toast.success("Dịch vụ đã bị xóa thành công!");
        getAllServices();
      } catch (error) {
        console.error("Lỗi khi xoá dịch vụ:", error);
        toast.error("Có lỗi khi xóa dịch vụ. Vui lòng thử lại!");
      }
    }
  };
  if (loadingService) {
    return (
      <section className="relative bg-gray-100 px-4 sm:px-8 lg:px-16 xl:px-40 2xl:px-64 py-16 lg:py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xl animate-pulse">Đang tải dịch vụ...</div>
        </div>
      </section>
    );
  }

  if (errorService) {
    return (
      <section className="relative bg-gray-100 px-4 sm:px-8 lg:px-16 xl:px-40 2xl:px-64 py-16 lg:py-32">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-red-600 mb-4">{errorService}</div>
          <button
            onClick={getAllServices}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-300"
          >
            Thử lại
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* Header với nút thêm */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Service Management</h2>
        <button
          onClick={() => setOpenAdd(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Thêm dịch vụ
        </button>
      </div>

      <ServiceAdd
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={() => {
          getAllServices(); // Cập nhật danh sách dịch vụ sau khi thêm mới
          handleCloseAdd();
        }}
      />
      <ServiceEdit
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={() => {
          getAllServices(); // Cập nhật danh sách dịch vụ sau khi thêm mới
          setEditModalOpen(false);
        }}
        serviceId={serviceId}
      />
      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 w-10 ">#</th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Hình ảnh
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Tên dịch vụ
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Mô tả
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Giá
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left w-22">
                Thời gian
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Chức năng
              </th>
            </tr>
          </thead>
          <tbody>
            {currentServices.length > 0 ? (
              currentServices.map((service, index) => (
                <tr key={service._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-2 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <img
                      src={service.image}
                      alt="Hinh anhr"
                      className="w-15 h-15"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {service.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {service.description}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    giá từ{" "}
                    <span className="text-red-500">
                      {formatPrice(service.price)}
                    </span>{" "}
                    vnd
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {service.duration}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="bg-amber-200 cursor-pointer rounded px-1"
                      onClick={() => handleEdit(service._id)}
                    >
                      Sửa
                    </button>
                    <button
                      className="bg-red-300 cursor-pointer ml-3 rounded px-1"
                      onClick={() => handleDelete(service._id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  Không có dịch vụ nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Phân trang */}
      {services.length > itemsPerPage && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Hiển thị {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, services.length)} trong tổng{" "}
            {services.length} dịch vụ
          </span>

          <div className="flex space-x-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-white border hover:bg-gray-50"
              }`}
            >
              Trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === number
                      ? "bg-blue-500 text-white"
                      : "bg-white border hover:bg-gray-50"
                  }`}
                >
                  {number}
                </button>
              )
            )}

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-white border hover:bg-gray-50"
              }`}
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
