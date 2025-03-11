import express from "express";
import {
  getRegions,
  createRegion,
  updateRegion,
  getSingleRegion,
  deleteRegion,
  addAppointmentToRegion,
  removeAppointmentFromRegion,
} from "../controllers/regionController.js";
import { isAdmin, verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getRegions);
router.get("/:id", getSingleRegion);

// Protected routes (admin only)
router.post("/create", verifyToken, isAdmin, createRegion);
router.put("/:id", verifyToken, isAdmin, updateRegion);
router.delete("/:id", verifyToken, isAdmin, deleteRegion);

// Appointment routes
router.post("/appointments", verifyToken, isAdmin, addAppointmentToRegion);
router.delete("/appointments", verifyToken, isAdmin, removeAppointmentFromRegion);

export default router;