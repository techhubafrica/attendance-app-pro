import express from "express";
import {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getAllEmployees,
  getAllUsersWhosRoleAreEmployee,
  getEmployeeById,
} from "../controllers/employeeController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Admin routes
router.get("/", verifyToken,  getAllEmployees);
router.post("/", verifyToken, isAdmin, addEmployee);
router.put("/:id", verifyToken, isAdmin, updateEmployee);
router.delete("/:id", verifyToken, isAdmin, deleteEmployee);
router.get("/users",verifyToken, getAllUsersWhosRoleAreEmployee)
router.get("/:id", verifyToken, getEmployeeById);

export default router;