import express from "express";
import {
  checkIn,
  checkOut,
  breaks,
  userAttendanceHistory,
  getAllAttendance,
  getEmployeeAttendance,
} from "../controllers/attendanceController.js";
import { isAdmin, isAdminOrFaculty, verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Employee routes
router.post("/checkin", verifyToken, checkIn);
router.post("/checkout", verifyToken, checkOut);
router.post("/breaks", verifyToken, breaks);
router.get("/history", verifyToken, userAttendanceHistory);

// Admin routes
router.get("/", verifyToken, isAdmin, getAllAttendance);
router.get("/:userId/:period", verifyToken, isAdminOrFaculty ,getEmployeeAttendance); // period = day, week, month, year

export default router;