import Service from "../models/serviceModel.js";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";
// [POST] /api/v1/services - Tạo dịch vụ mới (Admin)
export const createService = async (req, res) => {
  // 1) Kiểm tra quyền admin
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Bạn không có quyền thực hiện thao tác này",
    });
  }

  const { name, description, price, duration } = req.body;
  const imageFile = req.file;

  // 2) Kiểm tra các trường bắt buộc
  if (!name || !price || !duration) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập đầy đủ thông tin",
    });
  }

  // 3) Kiểm tra dịch vụ đã tồn tại chưa
  const existingService = await Service.findOne({ name });
  if (existingService) {
    return res.status(400).json({
      success: false,
      message: "Dịch vụ đã tồn tại",
    });
  }

  // 4) Kiểm tra giá và thời gian hợp lệ
  if (price <= 0 || duration <= 0) {
    return res.status(400).json({
      success: false,
      message: "Giá và thời gian phải lớn hơn 0",
    });
  }

  // 5) Xử lý upload ảnh
  let imageURL = null;
  if (imageFile) {
    try {
      const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
        folder: "services",
        resource_type: "auto",
      });
      imageURL = uploadResult.secure_url;
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi tải lên ảnh",
      });
    } finally {
      fs.unlinkSync(imageFile.path); // Xóa file tạm
    }
  }

  // 6) Tạo dịch vụ mới
  try {
    const newService = await Service.create({
      name,
      description,
      price,
      duration,
      image: imageURL,
    });

    return res.status(201).json({
      success: true,
      message: "Tạo dịch vụ thành công",
      data: { service: newService },
    });
  } catch (error) {
    console.error("Lỗi khi tạo dịch vụ:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo dịch vụ",
    });
  }
};

// [GET] /api/v1/services - Lấy tất cả dịch vụ (Public)
export const getAllServices = async (req, res) => {
  // 1) Lọc cơ bản
  // const queryObj = { ...req.query };
  // const excludedFields = ["page", "sort", "limit", "fields"];
  // excludedFields.forEach((el) => delete queryObj[el]);

  // // 2) Lọc nâng cao (thêm $)
  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  // let query = Service.find(JSON.parse(queryStr));

  // // 3) Sắp xếp
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(",").join(" ");
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort("-createdAt");
  // }

  // // 4) Phân trang
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 10;
  // const skip = (page - 1) * limit;

  // query = query.skip(skip).limit(limit);

  const services = await Service.find();
  res.status(200).json({
    success: true,
    message: "Lấy tất cả dịch vụ thành công",
    results: services.length,
    data: { services },
  });
};

// [GET] /api/v1/services/:id - Lấy dịch vụ theo ID
export const getService = async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy dịch vụ với ID này",
    });
  }

  res.status(200).json({
    success: true,
    message: "Lấy dịch vụ thành công",
    data: { service },
  });
};

// [PATCH] /api/v1/services/:id - Cập nhật dịch vụ (Admin)
export const updateService = async (req, res) => {
  // 1) Kiểm tra quyền admin
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Bạn không có quyền thực hiện thao tác này",
    });
  }

  const { serviceId } = req.params;
  const { name, description, price, duration } = req.body;
  const imageFile = req.file;

  // 2) Kiểm tra serviceId hợp lệ
  if (!serviceId) {
    return res.status(400).json({
      success: false,
      message: "Thiếu ID dịch vụ cần cập nhật",
    });
  }

  // 3) Tìm dịch vụ hiện có
  const existingService = await Service.findById(serviceId);
  if (!existingService) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy dịch vụ",
    });
  }

  // 4) Kiểm tra trùng tên (nếu có thay đổi tên)
  if (name && name !== existingService.name) {
    const nameExists = await Service.findOne({ name });
    if (nameExists) {
      return res.status(401).json({
        success: false,
        message: "Tên dịch vụ đã tồn tại",
      });
    }
  }

  // 5) Kiểm tra giá và thời gian hợp lệ (nếu có)
  if (price && price <= 0) {
    return res.status(402).json({
      success: false,
      message: "Giá phải lớn hơn 0",
    });
  }
  if (duration && duration <= 0) {
    return res.status(403).json({
      success: false,
      message: "Thời gian phải lớn hơn 0",
    });
  }

  // 6) Xử lý ảnh mới (nếu có)
  let imageURL = existingService.image;
  if (imageFile) {
    try {
      // Xóa ảnh cũ trên Cloudinary (nếu có)
      if (existingService.image) {
        const publicId = existingService.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`services/${publicId}`);
      }

      // Upload ảnh mới
      const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
        folder: "services",
        resource_type: "auto",
      });
      imageURL = uploadResult.secure_url;
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi tải lên ảnh",
      });
    } finally {
      fs.unlinkSync(imageFile.path); // Xóa file tạm
    }
  }

  // 7) Cập nhật dịch vụ
  try {
    const updatedData = {
      name: name || existingService.name,
      description: description || existingService.description,
      price: price || existingService.price,
      duration: duration || existingService.duration,
      image: imageURL,
      updatedAt: Date.now(),
    };

    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      updatedData,
      { new: true } // Trả về document sau khi update
    );

    return res.status(200).json({
      success: true,
      message: "Cập nhật dịch vụ thành công",
      data: { service: updatedService },
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật dịch vụ:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật dịch vụ",
    });
  }
};

// [DELETE] /api/v1/services/:id - Xóa dịch vụ (Admin)
export const deleteService = async (req, res) => {
  try {
    // 1. Kiểm tra quyền admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền thực hiện thao tác này",
      });
    }

    // 2. Tìm dịch vụ trước khi xóa để lấy thông tin ảnh
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ với ID này",
      });
    }

    // 3. Xóa ảnh trên Cloudinary nếu tồn tại
    if (service.image) {
      try {
        // Lấy public_id từ URL ảnh (Cloudinary lưu public_id trong URL)
        const publicId = service.image
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error("Lỗi khi xóa ảnh trên Cloudinary:", error);
        // Vẫn tiếp tục xóa dịch vụ dù xóa ảnh thất bại
      }
    }

    // 4. Xóa dịch vụ trong database
    await Service.findByIdAndDelete(req.params.id);

    // 5. Trả về response thành công
    return res.status(204).json({
      success: true,
      data: null,
    });
  } catch (error) {
    console.error("Lỗi khi xóa dịch vụ:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa dịch vụ",
    });
  }
};
