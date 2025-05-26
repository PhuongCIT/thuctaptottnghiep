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
  getAppointment,
  getAllAppointments,
  updateAppointment,
  confirmAppointment,
} from "../controllers/appointmentController.js";
import { authenticate } from "../middleware/auth.js";
import { createWorkShift } from "../controllers/workShiftController.js";
import { createShift } from "../controllers/shiftController.js";
import {
  createContact,
  getContacts,
} from "../controllers/contactController.js";
import upload from "../middleware/multer.js";
import {
  createReview,
  getAllReviews,
} from "../controllers/reviewController.js";
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

//review
router.post("/reviews", createReview);
router.get("/reviews", getAllReviews);

//WorkShift
// router.get("/workshifts", getAllWorkShifts);
router.post("/workshifts/create", createWorkShift);

//Shift
// router.get("/shifts", getAllShifts);
router.post("/shifts/create", createShift);

//contact

router.post("/contact/create", createContact);
router.get("/contacts", getContacts);

export default router;
