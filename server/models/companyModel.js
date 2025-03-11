import mongoose from "mongoose";

const companySchema = mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      lowercase: true,
      trim: true,
      minlength: [2, "Company name must be at least 2 characters long"],
      maxlength: [100, "Company name cannot exceed 100 characters"],
      unique: true, // Ensure uniqueness
    },
    companyAddress: {
      type: String,
      required: [true, "Company address is required"],
      trim: true,
      maxlength: [200, "Company address cannot exceed 200 characters"],
    },
    departments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Department" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Company", companySchema);
