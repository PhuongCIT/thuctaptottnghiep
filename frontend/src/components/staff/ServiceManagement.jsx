// import React, { useContext, useState } from "react";
// import ServiceAdd from "./service/ServiceAdd";
// import { AppContext } from "../../context/AppContext";

// const ServiceManagement = () => {
//   const { getAllServices, services, formatPrice } = useContext(AppContext);
//   // const [loadingStaffs, setLoadingStaff] = useState(false);
//   // const [errorStaffs, setErrorStaff] = useState(null);
//   const [openAdd, setOpenAdd] = useState(false);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [openView, setOpenView] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10); // Số item mỗi trang

//   // Tính toán phân trang
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentServices = services.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(services.length / itemsPerPage);

//   // Chuyển trang
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);
//   const nextPage = () =>
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages));
//   const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

//   const handleCloseAdd = () => setOpenAdd(false);

//   const handleEdit = (id) => {
//     // setSelectedServiceId(id);
//     // setOpenEdit(true);
//   };
//   const handleDelete = async (id) => {
//     // if (window.confirm("Bạn có chắc muốn xóa dịch vụ này?")) {
//     //   try {
//     //     await ServiceService.delete(id);
//     //     alert("Dịch vụ đã bị xóa thành công!");
//     //     setLoadingService(false);
//     //   } catch (error) {
//     //     console.error("Lỗi khi xoá dịch vụ:", error);
//     //     alert("Có lỗi khi xóa dịch vụ. Vui lòng thử lại!");
//     //   }
//     // }
//   };

//   const handleView = (service) => {
//     // setSelectedService(service);
//     // setOpenView(true);
//   };

//   return (
//     <div className="bg-white shadow-md rounded-lg p-6">
//       {/* Header với nút thêm */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">Service Management</h2>
//         <button
//           onClick={() => setOpenAdd(true)}
//           className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
//         >
//           Thêm dịch vụ
//         </button>
//       </div>

//       <ServiceAdd
//         open={openAdd}
//         onClose={() => setOpenAdd(false)}
//         onSuccess={() => {
//           getAllServices(); // Cập nhật danh sách dịch vụ sau khi thêm mới
//           handleCloseAdd();
//         }}
//       />
//       {/* Bảng dữ liệu */}
//       <div className="overflow-x-auto mb-4">
//         <table className="w-full border-collapse border border-gray-200">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border border-gray-300 px-4 py-2 text-left">
//                 Service Name
//               </th>
//               <th className="border border-gray-300 px-4 py-2 text-left">
//                 Description
//               </th>
//               <th className="border border-gray-300 px-4 py-2 text-left">
//                 Price
//               </th>
//               <th className="border border-gray-300 px-4 py-2 text-left">
//                 Duration
//               </th>
//               <th className="border border-gray-300 px-4 py-2 text-left">
//                 Action
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentServices.length > 0 ? (
//               currentServices.map((service) => (
//                 <tr key={service._id} className="hover:bg-gray-50">
//                   <td className="border border-gray-300 px-4 py-2">
//                     {service.name}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {service.description}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     giá từ{" "}
//                     <span className="text-red-500">
//                       {formatPrice(service.price)}
//                     </span>{" "}
//                     vnd
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {service.duration}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     <button
//                       className="bg-green-200 cursor-pointer"
//                       onClick={() => handleView(service)}
//                     >
//                       Xem |
//                     </button>

//                     <button
//                       className="bg-amber-200 cursor-pointer"
//                       onClick={() => handleEdit(service.id)}
//                     >
//                       Sửa |
//                     </button>
//                     <button
//                       className="bg-red-300 cursor-pointer"
//                       onClick={() => handleDelete(service.id)}
//                     >
//                       Xóa
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="text-center py-4 text-gray-500">
//                   Không có dịch vụ nào
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//       {/* Phân trang */}
//       {services.length > itemsPerPage && (
//         <div className="flex justify-between items-center">
//           <span className="text-sm text-gray-600">
//             Hiển thị {indexOfFirstItem + 1}-
//             {Math.min(indexOfLastItem, services.length)} trong tổng{" "}
//             {services.length} dịch vụ
//           </span>

//           <div className="flex space-x-2">
//             <button
//               onClick={prevPage}
//               disabled={currentPage === 1}
//               className={`px-3 py-1 rounded-md ${
//                 currentPage === 1
//                   ? "bg-gray-200 cursor-not-allowed"
//                   : "bg-white border hover:bg-gray-50"
//               }`}
//             >
//               Trước
//             </button>

//             {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//               (number) => (
//                 <button
//                   key={number}
//                   onClick={() => paginate(number)}
//                   className={`px-3 py-1 rounded-md ${
//                     currentPage === number
//                       ? "bg-blue-500 text-white"
//                       : "bg-white border hover:bg-gray-50"
//                   }`}
//                 >
//                   {number}
//                 </button>
//               )
//             )}

//             <button
//               onClick={nextPage}
//               disabled={currentPage === totalPages}
//               className={`px-3 py-1 rounded-md ${
//                 currentPage === totalPages
//                   ? "bg-gray-200 cursor-not-allowed"
//                   : "bg-white border hover:bg-gray-50"
//               }`}
//             >
//               Sau
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ServiceManagement;
