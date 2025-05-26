import axios from "axios";

// Tạo instance của axios với baseURL của API
const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

const userApi = {
  create: (userData) => api.post("/user/create", userData),
  getAllStaffs: () => api.get("/staffs"),
  getAllCustomers: () => api.get("/customers"),
  getUserById: (id) => api.get(`/user/${id}`),
  updateStaff: (id, data) => api.patch(`/staff/${id}`, data),
  deleteStaff: (id) => api.delete(`/staff/${id}`),
};

export default userApi;
