import Notification from "../models/notificationModel.js";

// Create a new notification
export const createNotification = async (req, res) => {
  try {
    const { user, title, message } = req.body;

    // Validate input
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Message is required" });
    }

    const newNotification = new Notification({
      user,
      title,
      message,
    });

    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all notifications for a user with pagination and filtering
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, read } = req.query;

    // Validate pagination parameters
    if (parseInt(page) <= 0 || parseInt(limit) <= 0) {
      return res.status(400).json({ message: "Invalid page or limit value" });
    }

    // Build the query
    const query = { user: userId };
    if (read !== undefined) {
      query.read = read === "true"; // Convert string to boolean
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 }) // Sort by most recent
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const count = await Notification.countDocuments(query);

    res.json({
      notifications,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalCount: count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};