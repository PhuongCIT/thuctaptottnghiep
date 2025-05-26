import axios from "axios";

// Tạo instance của axios với baseURL của API
const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

const contactApi = {
  create: (data) => api.post("/contact/create", data),
  getAll: () => api.get("/contacts"),
  getContactById: (id) => api.get(`/contact/${id}`),
  update: (id, data) => api.patch(`/contact/${id}`, data),
  delete: (id) => api.delete(`/contact/${id}`),
};

export default contactApi;
