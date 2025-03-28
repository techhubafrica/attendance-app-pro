import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["employee", "student", "faculty", "admin", "teacher"],
      default: "employee",
      required: true,
    },
    phone: {
      type: String, // Phone number field
      default: null,
    },
    address: {
      type: String, // Address field
      default: null,
    },
    avatar: {
      type: String, // URL of the profile image stored in Cloudinary
      default: null,
    },
    dateOfBirth: {
      type: Date,
      validate: {
        validator: function (value) {
          const today = new Date();
          const ageLimit = new Date(today.setFullYear(today.getFullYear() - 18)); // At least 18 years old
          return value < ageLimit; // Ensure dateOfBirth is in the past & user is 18+
        },
        message: "User must be at least 18 years old.",
      },
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    }, // Reference to the Company model

    verifyOtp: { type: String, default: "" },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: "" },
    resetOtpExpiresAt: { type: Number, default: 0 },
  },
  { timestamps: true } // Automatically add `createdAt` and `updatedAt` fields
);

// Method to compare passwords
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", UserSchema);
