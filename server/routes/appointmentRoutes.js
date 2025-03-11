import express from "express";
import {
  createAppointment,
  approveAppointment,
  getAllAppointments,
  getAllUserAppointments,
  getAppointment,
  checkInForAppointments,
  checkOutForAppointments,
} from "../controllers/appointmentController.js";
import { verifyToken, isAdminOrFaculty } from "../middleware/auth.js";

const router = express.Router();

// User routes
router.get("/", verifyToken,   getAllAppointments);
router.post("/", verifyToken, createAppointment);
router.get("/user", verifyToken, getAllUserAppointments);
router.get("/:id", verifyToken, getAppointment);
router.put("/:id/checkin", verifyToken, checkInForAppointments);
router.put("/:id/checkout", verifyToken, checkOutForAppointments);

// Admin or faculty routes
router.put("/approve/:id", verifyToken, isAdminOrFaculty, approveAppointment);

export default router;