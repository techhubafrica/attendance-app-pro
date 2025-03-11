import express from "express";
import {
  createDepartment,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController.js";
import { verifyToken, isAdmin, isAdminOrFaculty } from "../middleware/auth.js";

const router = express.Router();

// Admin routes
router.post("/", verifyToken, isAdmin, createDepartment);
router.get("/", verifyToken, getAllDepartments);
router.put("/:id", verifyToken, isAdmin, updateDepartment);
router.delete("/:id", verifyToken, isAdmin, deleteDepartment);

export default router;