import { createContext, useEffect, useState } from "react";
// import { reviews } from "../assets/data/db";
import userApi from "../services/userService";
import serviceApi from "../services/serviceService";
import reviewApi from "../services/reviewService";
import shiftApi from "../services/shiftService";

export const AppContext = createContext(null);

export const AppContextProvider = (props) => {
  const [loadingStaffs, setLoadingStaff] = useState(false);
  const [errorStaffs, setErrorStaff] = useState(null);
  const [staffs, setStaffs] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [errorReviews, setErrorReviews] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [errorCustomers, setErrorCustomers] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [errorService, setErrorService] = useState(null);
  const [loadingService, setLoadingService] = useState(false);
  const [shifts, setShifts] = useState([]);

  const getAllServices = async () => {
    try {
      setLoadingService(true);
      setErrorService(null);
      const res = await serviceApi.getAll();
      setServices(res.data.data.services.reverse());
    } catch (err) {
      console.error("Chi tiết lỗi:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setErrorService(err.response?.data?.message || "Lỗi không xác định");
      setErrorService("Không thể lấy dịch vụ. Hãy tải lại");
    } finally {
      setLoadingService(false);
    }
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const handleImageError = (e) => {
    e.target.src = "/placeholder-service.jpg"; // Ảnh mặc định khi lỗi
    e.target.classList.add("image-error");
  };

  const getAllStaffs = async () => {
    try {
      setLoadingStaff(true);
      setErrorStaff(null);

      // Gọi API
      const response = await userApi.getAllStaffs();
      const data = response.data.data.staff;
      // console.log("Data Staffs :", data);
      if (data && Array.isArray(data)) {
        setStaffs(data);
      } else {
        setStaffs([]);
      }
    } catch (error) {
      console.error("Error loading services:", error);
      setErrorStaff("Không thể tải dữ liệu nhân viên. Vui lòng thử lại sau.");
    } finally {
      setLoadingStaff(false);
    }
  };
  const getAllCustomers = async () => {
    try {
      setLoadingStaff(true);
      setErrorStaff(null);

      // Gọi API
      const response = await userApi.getAllCustomers();
      const data = response.data.data.customers;
      // console.log("Data Customers :", data);
      if (data && Array.isArray(data)) {
        setCustomers(data);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error("Error loading services:", error);
      setErrorCustomers(
        "Không thể tải dữ liệu nhân viên. Vui lòng thử lại sau."
      );
    } finally {
      setLoadingCustomers(false);
    }
  };
  //get review
  const getReviews = async () => {
    try {
      setLoadingReviews(true);
      setErrorReviews(null);
      // Gọi API
      const response = await reviewApi.getReviews();
      const data = response.data.data.reviews;
      // console.log("Data Review :", data);
      if (data && Array.isArray(data)) {
        setReviews(data);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Error loading services:", error);
      setErrorReviews("Không thể tải dữ liệu");
    } finally {
      setLoadingReviews(false);
    }
  };
  const getAllShifts = async () => {
    const response = await shiftApi.getAll();
    // console.log("Shift Data ", response.data);
    setShifts(response.data);
  };

  useEffect(() => {
    getAllServices();
    getReviews();
    getAllShifts();
    getAllCustomers();
    if (staffs.length === 0 && !loadingStaffs) {
      getAllStaffs();
    }
  }, []);
  const value = {
    staffs,
    loadingStaffs,
    errorStaffs,
    setErrorStaff,
    getAllStaffs,
    reviews,
    getReviews,
    loadingReviews,
    errorReviews,

    services,
    errorService,
    loadingService,
    getAllServices,
    formatPrice,
    handleImageError,
    setErrorService,
    getAllCustomers,
    customers,
    loadingCustomers,
    errorCustomers,
    shifts,
    getAllShifts,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
