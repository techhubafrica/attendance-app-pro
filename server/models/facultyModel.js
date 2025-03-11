import mongoose from "mongoose";

const FacultySchema = new mongoose.Schema({
  facultyName: {
    type: String,
    required: true,
    trim: true,
    unique: true, // Prevents duplicate faculty names
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
    index: true, // Speeds up queries
  },
  isAdmin: { type: Boolean, default: false }, // Admin access for Robotics Lab
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }], // Faculty members book lab visits
  booksBorrowed: [{ type: mongoose.Schema.Types.ObjectId, ref: "BookLoan" }],
});

export default mongoose.model("Faculty", FacultySchema);
