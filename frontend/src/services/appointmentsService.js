import axios from "axios";

// Tạo instance của axios với baseURL của API
const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Tạo hàm để lấy dữ liệu từ API
const appointmentApi = {
  create: (data) => api.post("/appointments", data),
  getAll: () =>
    api.get("/appointments", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),
  confirmed: (id) => api.put(`/appointments/confirm/${id}`),
};

export default appointmentApi;
