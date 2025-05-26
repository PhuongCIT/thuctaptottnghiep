import axios from "axios";

// Tạo instance của axios với baseURL của API
const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

const reviewApi = {
  // Tạo hàm để lấy danh sách đánh giá
  getReviews: async () => api.get("/reviews"),
  // Tạo hàm để thêm đánh giá
  addReview: async (data) => api.post("/reviews", data),
};

export default reviewApi;
