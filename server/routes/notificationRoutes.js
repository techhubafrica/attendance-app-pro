import express from "express";
import {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// User routes
router.post("/", verifyToken, createNotification);
router.get("/user/:userId", verifyToken, getUserNotifications);
router.put("/:id/read", verifyToken, markNotificationAsRead);
router.delete("/:id", verifyToken, deleteNotification);

export default router;