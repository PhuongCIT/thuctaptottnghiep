import axios from "axios";

// Tạo instance của axios với baseURL của API
const api = axios.create({
  baseURL: "http://localhost:8080/api/shifts",
});

const shiftApi = {
  create: (data) => api.post("/create", data),
  getAll: () => api.get("/"),
  delete: (id) => api.delete(`/delete/${id}`),
};

export default shiftApi;
