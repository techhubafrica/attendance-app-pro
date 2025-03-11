import express from "express";
import {
  createCompany,
  getAllCompanies,
  updateCompany,
  deleteCompany,
  getCompanyById,
} from "../controllers/companyController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Admin routes
router.post("/", verifyToken, isAdmin, createCompany);
router.get("/", verifyToken, getAllCompanies);
router.get("/:id", verifyToken, getCompanyById); // New route for single company
router.put("/:id", verifyToken, isAdmin, updateCompany);
router.delete("/:id", verifyToken, isAdmin, deleteCompany);

export default router;