import cloudinary from "../config/cloudinary.js";
// import connectCloudinary from "../config/cloudinary.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import fs from "fs";

// Helper function để lọc các trường được phép cập nhật
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// [GET] /api/v1/users - Lấy danh sách users (Admin only)
export const getAllUsers = async (req, res) => {
  const users = await User.find().select(" -password");

  res.status(200).json({
    success: true,

    results: users.length,
    data: { users },
  });
};

//create for admin
export const createUser = async (req, res) => {
  // const newStaff = await User.create(req.body);

  // res.status(201).json({
  //   success: true,
  //   data: { newStaff },
  // });
  try {
    const { name, email, password, phone, address, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role,
    });
    await user.save();
    user.password = undefined; // remove password from response

    res.json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [GET] /api/v1/staff - lấy user là nhân viên
export const getAllStaffs = async (req, res) => {
  const staff = await User.find({ role: "staff" }).select(" -password");
  res.status(200).json({
    success: true,
    data: { staff },
  });
};
export const getAllCustomers = async (req, res) => {
  const customers = await User.find({ role: "customer" }).select(" -password");
  res.status(200).json({
    success: true,
    data: { customers },
  });
};

// [GET] /api/v1/users/:id - Lấy thông tin user cụ thể
export const getUserDetail = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId).select("-__v -password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy người dùng với ID này",
    });
  }

  res.status(200).json({
    success: true,
    message: "Lấy thông tin người dùng thành công",
    data: { user },
  });
};

// [PATCH] /api/v1/users/updateMe - Cập nhật thông tin cá nhân (không đổi password)
export const updateMe = async (req, res) => {
  // 1) Lỗi nếu user POST password
  if (req.body.password || req.body.passwordConfirm) {
    return res.status(400).json({
      success: false,
      message:
        "Không thể cập nhật password qua đây. Vui lòng sử dụng /updateMyPassword.",
    });
  }

  // 2) Lọc các trường không được phép cập nhật
  const filteredBody = filterObj(req.body, "email");

  // 3) Cập nhật user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
  });

  res.status(200).json({
    success: true,
    message: "Cập nhật thông tin cá nhân thành công",
    user: updatedUser,
  });
};

// API to update user controller
export const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    // 1. Validate input
    if (!userId || !phone || !name || !dob || !gender || !address) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc",
      });
    }

    // 2. Kiểm tra user tồn tại
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    // 3. Xử lý upload ảnh (nếu có)
    let imageURL;
    if (imageFile) {
      try {
        const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
          folder: "user_profiles",
          resource_type: "auto",
        });
        imageURL = uploadResult.secure_url;
        fs.unlinkSync(imageFile.path); // Xóa file tạm
      } catch (uploadError) {
        console.error("Upload ảnh thất bại:", uploadError);
        fs.unlinkSync(imageFile.path);
        return res.status(500).json({
          success: false,
          message: "Lỗi khi tải lên ảnh đại diện",
        });
      }
    }

    // 4. Cập nhật thông tin
    const updateData = {
      name,
      phone,
      address,
      gender,
      dob,
      ...(imageURL && { image: imageURL }), // Chỉ cập nhật nếu có ảnh mới
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true } // Trả về bản ghi đã cập nhật
    );

    // 5. Trả về kết quả
    const responseUser = updatedUser.toObject();
    delete responseUser.password;
    delete responseUser.__v;

    return res.status(200).json({
      success: true,
      message: "Cập nhật thông tin thành công",
      user: responseUser,
    });
  } catch (error) {
    console.error("Lỗi cập nhật profile:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi hệ thống",
    });
  }
};

// [DELETE] /api/v1/users/deleteMe - Xóa tài khoản (soft delete)
export const deleteMe = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { isActive: false });

  res.status(204).json({
    success: true,
    message: "Xóa tài khoản thành công",
    data: null,
  });
};

// [PATCH] /api/v1/users/:id - Cập nhật user (Admin only)
export const updateUser = async (req, res) => {
  // Cho phép admin thay đổi role
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy người dùng với ID này",
    });
  }

  res.status(200).json({
    success: true,
    data: { user },
  });
};

// [DELETE] /api/v1/users/:id - Xóa user (Admin only)
export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy người dùng với ID này",
    });
  }

  res.status(204).json({
    success: true,
    message: "Xóa người dùng thành công",
    data: null,
  });
};
