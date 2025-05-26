// backend/middleware/auth.js
import jwt from "jsonwebtoken";

export const auth = (roles = []) => {
  return (req, res, next) => {
    try {
      const token =
        req.headers.authorization?.split(" ")[1] || req.headers.token; // Format: Bearer <token>
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Authorization token missing",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Gán thông tin user vào request
      req.user = decoded;

      // Kiểm tra role
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Insufficient permissions",
        });
      }

      next();
    } catch (error) {
      const message =
        error.name === "JsonWebTokenError" ? "Invalid token" : error.message;
      res.status(401).json({
        success: false,
        message,
      });
    }
  };
};

// Middleware xác thực
export const authenticate = (req, res, next) => {
  try {
    // 1. Lấy token từ header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new Error("Vui lòng đăng nhập");

    // 2. Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Gắn thông tin user vào request
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
