import express from "express";

import { register, login, getProfile } from "../controllers/authController.js";
import {
  createService,
  deleteService,
  getAllServices,
  getService,
  updateService,
} from "../controllers/serviceController.js";
import {
  getAllStaffs,
  getUserDetail,
  getAllUsers,
  createUser,
  updateProfile,
  getAllCustomers,
} from "../controllers/userController.js";
import {
  createAppointment,
  getAllAppointments,
  updateAppointment,
  confirmAppointment,
  completedAppointment,
  cancelAppointment,
} from "../controllers/appointmentController.js";
import { authenticate } from "../middleware/auth.js";
import {
  createShift,
  deleteShift,
  getAllShifts,
} from "../controllers/shiftController.js";
import {
  createContact,
  getContacts,
} from "../controllers/contactController.js";
import upload from "../middleware/multer.js";
import {
  createReview,
  getAllReviews,
} from "../controllers/reviewController.js";
import {
  approveWorkShift,
  getWorkShifts,
  registerWorkShift,
} from "../controllers/workShiftController.js";
import { sendRemindersManually } from "../controllers/notificationController.js";
const router = express.Router();
//auth
router.post("/auth/login", login);
router.post("/auth/register", register);
router.get("/auth/profile", authenticate, getProfile);

// Admin
router.get("/users", getAllUsers); //get all users
router.post("/user/create", createUser);

//user
router.get("/user/:userId", getUserDetail);
router.get("/users", getAllUsers);
router.put(
  "/user/update-profile",
  upload.single("image"),
  authenticate,
  updateProfile
);

//service
router.post("/services", authenticate, upload.single("image"), createService);
router.get("/services", getAllServices);
router.get("/services/:id", getService);
router.put(
  "/services/:serviceId",
  authenticate,
  upload.single("image"),
  updateService
);
router.delete("/services/:id", authenticate, deleteService);

//staff
router.get("/staffs", getAllStaffs);

//Customer
router.get("/customers", getAllCustomers);

//appointment
router.post("/appointments", createAppointment);
router.get("/appointments", authenticate, getAllAppointments);
router.put("/appointments/:id", authenticate, updateAppointment);
router.put("/appointments/confirm/:id", confirmAppointment);
router.put("/appointments/cancel/:id", cancelAppointment);
router.put("/appointments/complete/:id", completedAppointment);

//review
router.post("/reviews", createReview);
router.get("/reviews", getAllReviews);

//WorkShift
router.get("/workshifts", authenticate, getWorkShifts);
router.post("/workshifts/register", registerWorkShift);
router.put("/workshifts/:id", approveWorkShift);

//Shift
router.get("/shifts", getAllShifts);
router.post("/shifts/create", createShift);
router.delete("/shifts/delete/:id", deleteShift);

//contact

router.post("/contact/create", createContact);
router.get("/contacts", getContacts);

// Route để gửi thông báo thủ công
router.post("/notifications/send-reminders", sendRemindersManually);

export default router;
