import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/index.js"; // Lưu ý thêm /index.js nếu dùng folder routes
import { setupAppointmentReminders } from "./controllers/notificationController.js";

// Cấu hình biến môi trường
dotenv.config();

const app = express();

// Middleware cơ bản
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

setupAppointmentReminders();
// Router chính
app.use("/api", router);

const port = process.env.PORT || 8080; // Thêm fallback port

// Khởi động server sau khi kết nối DB
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`🟢 Server đang chạy trên port ${port}`);
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
    });
  })
  .catch((error) => {
    console.error("❌ Lỗi kết nối database:", error);
    // Thoát nếu không kết nối được DB
  });

// Xử lý lỗi toàn cục
process.on("unhandledRejection", (err) => {
  console.error("⚠️ Lỗi chưa được xử lý:", err);
});
