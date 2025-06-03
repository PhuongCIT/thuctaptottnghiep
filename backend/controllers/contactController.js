import Contact from "../models/contactModel.js";
// const { sendContactEmail } = require("../utils/emailService");

// @desc    Tạo liên hệ mới
// @route   POST /api/contacts
// @access  Public
export const createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate input
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin bắt buộc",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Địa chỉ email không hợp lệ",
      });
    }

    // Validate phone number (Vietnamese format)
    const phoneRegex = /^(0|\+84)(\d{9,10})$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message:
          "Số điện thoại không hợp lệ (định dạng: 0xxxxxxxxx hoặc +84xxxxxxxxx)",
      });
    }

    const newContact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    // Gửi email xác nhận (async - không cần đợi)
    // sendContactEmail(email, name, subject).catch((err) =>
    //   console.error("Lỗi gửi email:", err)
    // );

    res.status(201).json({
      success: true,
      data: newContact,
      message: "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.",
    });
  } catch (error) {
    console.error("Lỗi khi tạo liên hệ:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi gửi liên hệ",
      error: error.message,
    });
  }
};

//   Lấy danh sách liên hệ (phân trang, lọc)

export const getContacts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      isRead,
      search,
      sortBy = "-createdAt",
    } = req.query;

    // Build query
    const query = {};
    if (isRead !== undefined) query.isRead = isRead;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }

    const contacts = await Contact.find(query)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách liên hệ:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy danh sách liên hệ",
      error: error.message,
    });
  }
};

//    Đánh dấu đã đọc liên hệ

export const markAsRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy liên hệ",
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
      message: "Đã đánh dấu liên hệ là đã đọc",
    });
  } catch (error) {
    console.error("Lỗi khi đánh dấu đã đọc:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi cập nhật trạng thái liên hệ",
      error: error.message,
    });
  }
};

//    Xóa liên hệ

export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy liên hệ",
      });
    }

    res.status(200).json({
      success: true,
      message: "Đã xóa liên hệ thành công",
    });
  } catch (error) {
    console.error("Lỗi khi xóa liên hệ:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi xóa liên hệ",
      error: error.message,
    });
  }
};

//thống kê
export const getContactStats = async (req, res) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
          unread: {
            $sum: { $cond: [{ $eq: ["$isRead", false] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Lỗi thống kê:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thống kê liên hệ",
    });
  }
};
