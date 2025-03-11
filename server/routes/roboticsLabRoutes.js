import express from "express";
import {
  createRoboticsLab,
  getAllRoboticsLabs,
  getSingleRoboticsLab,
  updateRoboticsLab,
  deleteRoboticsLab,
  addAppointmentToLab,
  removeAppointmentFromLab,
  getLabDetails,
} from "../controllers/roboticsLabController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllRoboticsLabs);
router.get("/:id", getSingleRoboticsLab);
router.get("/lab-details", getLabDetails)

// Admin routes
router.post("/create", verifyToken, isAdmin, createRoboticsLab);
router.put("/:id", verifyToken, isAdmin, updateRoboticsLab);
router.delete("/:id", verifyToken, isAdmin, deleteRoboticsLab);

// Appointment routes
router.post("/appointments", verifyToken, isAdmin, addAppointmentToLab);
router.delete("/appointments", verifyToken, isAdmin, removeAppointmentFromLab);

export default router;