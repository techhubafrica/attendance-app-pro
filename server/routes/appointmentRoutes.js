import express from "express";
import {
  createAppointment,
  approveAppointment,
  getAllAppointments,
  getAllUserAppointments,
  getAppointment,
  checkInForAppointments,
  checkOutForAppointments,
  capturePayment,
} from "../controllers/appointmentController.js";
import { verifyToken, isAdminOrFaculty, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// User routes
router.get("/", verifyToken,   getAllAppointments);
router.post("/", verifyToken, createAppointment);
router.get("/user", verifyToken, getAllUserAppointments);
router.get("/:id", verifyToken, getAppointment);
router.put("/:id/checkin", verifyToken, checkInForAppointments);
router.put("/:id/checkout", verifyToken, checkOutForAppointments);

// Payment capture endpoint
router.post("/capture-payment", verifyToken, capturePayment);

// Admin or faculty routes
router.put("/approve/:id", verifyToken, isAdmin, approveAppointment);

export default router;