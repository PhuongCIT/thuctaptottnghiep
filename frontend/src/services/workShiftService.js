import axios from "axios";

// Tạo instance của axios với baseURL của API
const api = axios.create({
  baseURL: "http://localhost:8080/api/workshifts",
});

const workShiftApi = {
  register: (data) => api.post("/register", data),
  getAll: () =>
    api.get("/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }),
  approve: (id) => api.put(`/${id}`),
};

export default workShiftApi;
