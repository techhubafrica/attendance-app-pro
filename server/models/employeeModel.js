import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // Ensure each user can only have one employee record
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      // required: [true, 'Department reference is required'], // Added error message
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      // required: [true, 'Company reference is required'], // Added error message
    },
    salary: {
      type: Number,
      default: 0,
      min: [0, 'Salary cannot be negative'], // Ensure salary is non-negative
    },
    bonus: {
      type: Number,
      default: 0,
      min: [0, 'Bonus cannot be negative'], // Ensure bonus is non-negative
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

export const Employee = mongoose.model('Employee', EmployeeSchema);