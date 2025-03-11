import mongoose, { Schema } from "mongoose";

const attendanceSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Employee", // Reference to the Employee model
    required: true,
  },
  checkIn: {
    type: Date,
  },
  checkOut: {
    type: Date,
  },
  breaks: [
    {
      start: { type: Date },
      end: { type: Date },
    },
  ],
  date: {
    type: Date,
    default: () => new Date().setHours(0, 0, 0, 0), // Store only the day, reset time to midnight
  },
  totalWorkHours: {
    type: Number,
    default: 0, // Total work hours for the day (in hours)
  },
  totalBreakHours: {
    type: Number,
    default: 0, // Total break hours for the day (in hours)
  },
});

// Create a compound index for user and date to ensure uniqueness
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);