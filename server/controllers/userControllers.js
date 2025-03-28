import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import fs from "fs-extra";
import transporter from "../config/nodemailer.js";
import { Employee } from "../models/employeeModel.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, // Include the role in the token payload
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // Only admins can register other admins
    if (role === "admin" && req.user?.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can register other admins" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    if (role === "employee") {
      const newEmployee = new Employee({
        user: user._id, // Link the User document to the Employee document
        // Add any additional fields for the Employee model here
      });

      // Save the Employee document
      const savedEmployee = await newEmployee.save();

      // Link the Employee document to the User document
      user.employee = savedEmployee._id;
    }
    // Save user to database
    await user.save();
    // Generate token after user is saved
    const token = generateToken(user);
    // Set the token in an HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 day
      path: "/", // Ensure cookie is available across all routes
    });
    //sending welcome email
const mailOptions = {
  from: process.env.EMAIL_FROM,
  to: email,
  subject: "Welcome to Tech Hub Africa's Attendance Management System! 🎉",
  text: `Dear ${name},\n\nWelcome to Tech Hub Africa's Attendance Management System! We're thrilled to have you on board. 🚀\n\nWith this platform, you can now:\n- Easily track your attendance.\n- Manage your profile and personal details.\n- Stay connected with your team and organization.\n\nThis project is proudly owned and developed by Tech Hub Africa, a leading innovator in technology solutions. We’re committed to providing you with the best tools to streamline your work and enhance productivity.\n\nIf you have any questions or need assistance, feel free to reach out to our support team at ${process.env.SUPPORT_EMAIL}.\n\nOnce again, welcome to the family! We’re excited to have you here and look forward to helping you make the most of this platform.\n\nBest regards,\nThe Tech Hub Africa Team`,
};
    await transporter.sendMail(mailOptions);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error signing up", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }
    // Create and sign JWT token
    const token = generateToken(user);
    // Set the token in an HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 day
      path: "/", // Ensure cookie is available across all routes
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        dateOfBirth: user.dateOfBirth
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate({
        path: "employee",
        populate: [
          {
            path: "company",
            select: "companyName companyAddress", // Select the fields you want from the Company model
          },
          {
            path: "department",
            select: "departmentName", // Select the fields you want from the Department model
          },
        ],
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error("Get user profile error:", error);
    res
      .status(500)
      .json({ message: "Error getting user profile", error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address, dateOfBirth } = req.body;
    let avatar = null;

    // Handle image upload if a file is provided
    if (req.file) {
      const filePath = req.file.path;
      avatar = await uploadToCloudinary(filePath);
      fs.unlinkSync(filePath); // Delete temporary file
    }

    // Find the user by ID
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    if (avatar) {
      user.avatar = avatar;
    }

    // ✅ Validate and Update `dateOfBirth`
    if (dateOfBirth) {
      // Parse the input date as UTC
      const dob = new Date(dateOfBirth);

      // Validate the date
      if (isNaN(dob.getTime())) {
        return res.status(400).json({ message: "Invalid date of birth" });
      }

      const today = new Date();
      today.setUTCHours(0, 0, 0, 0); // Normalize today's date to UTC

      if (dob >= today) {
        return res.status(400).json({ message: "Invalid date of birth" });
      }

      user.dateOfBirth = dob;
    }

    // Save the updated user
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};


export const sendVerifyOtp = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Access denied, no token provided." });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isAccountVerified) {
      res.json({ success: false, message: "Account already verified" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Account verification Otp",
      text: `Your OTP is ${otp}, verify your account using this otp`,
    };
    await transporter.sendMail(mailOptions);
    res.json({
      success: true,
      message: "Verification otp sent to your email successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const verifyEmail = async (req, res) => {
  const userId = req.user.id;
  const { otp } = req.body;

  if (!userId || !otp) {
    return res.status(400).json({ success: false, message: "Missing Details" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }
    user.isAccountVerified = true;
    user.verifyOtp = ""; // Clear the OTP after verification
    user.verifyOtpExpireAt = 0; // Clear the OTP expiration time after verification
    await user.save();
    res.json({ success: true, message: "Account verified successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const isAuthenticated = (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Access denied, no token provided." });
    }
    res.json({ success: true, message: "User is authenticated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter your email" });
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpiresAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Password reset OTP",
      text: `Your OTP is ${otp}, use this otp to reset your password`,
    };
    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Email, OTP, and new password are required",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.resetOtp || user.resetOtp !== String(otp)) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = null;
    user.resetOtpExpiresAt = null;
    await user.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
