import express from "express";
import { getDepartmentAttendance } from "../controllers/hrController.js";
import { verifyToken, isAdmin, isAdminOrFaculty } from "../middleware/auth.js";

const router = express.Router();

// HR/Manager routes
router.get("/department/:departmentId", verifyToken, isAdminOrFaculty, getDepartmentAttendance);

export default router;