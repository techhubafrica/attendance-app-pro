import express from "express";
import {
  createFaculty,
  getAllFaculty,
  updateFaculty,
  deleteFaculty,
  getFacultyById,
} from "../controllers/facultyController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Admin routes
router.post("/", verifyToken, isAdmin, createFaculty);
router.get("/", verifyToken, getAllFaculty);
router.put("/:id", verifyToken, isAdmin, updateFaculty);
router.delete("/:id", verifyToken, isAdmin, deleteFaculty);
router.get("/:id", getFacultyById);

export default router;