import Appointment from "../models/appointmentModel.js";
import User from "../models/User.js";
import Faculty from "../models/facultyModel.js";
import Region from "../models/regionModel.js";
import RoboticsLab from "../models/roboticsLabModel.js";

// Create a new appointment
export const createAppointment = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!["student", "teacher", "faculty"].includes(user.role)) {
    return res.status(403).json({ message: "Only students, teachers, and faculty can schedule appointments" });
  }

  try {
    const { faculty, lab, region, appointmentDate, purpose, numVisitors } = req.body;

    // Validate input
    if (!faculty || !lab || !region || !appointmentDate || !purpose || !numVisitors) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate faculty, lab, and region IDs
    const existingFaculty = await Faculty.findById(faculty);
    if (!existingFaculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const existingLab = await RoboticsLab.findById(lab);
    if (!existingLab) {
      return res.status(404).json({ message: "Lab not found" });
    }

    const existingRegion = await Region.findById(region);
    if (!existingRegion) {
      return res.status(404).json({ message: "Region not found" });
    }

    // Check if the user already has an appointment for the same lab that is not approved or completed
    const existingAppointment = await Appointment.findOne({
      user: req.user.id,
      lab,
      status: { $in: ["scheduled", "approved"] }, // Check for pending or approved appointments
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "You have already booked an appointment for this lab, and it is yet to be approved or completed." });
    }

    // Create the new appointment
    const newAppointment = new Appointment({
      user: req.user.id, // Logged-in user (teacher)
      faculty,
      lab,
      region,
      appointmentDate,
      purpose,
      numVisitors,
    });

    await newAppointment.save();

    await Region.findByIdAndUpdate(region, {
      $push: { appointments: newAppointment._id },
    });

    // Add the appointment to the robotics lab's appointments array
    await RoboticsLab.findByIdAndUpdate(lab, {
      $push: { appointments: newAppointment._id },
    });
    
    res.status(201).json(newAppointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
// Approve an appointment (for admin or faculty)
export const approveAppointment = async (req, res) => {
  try {
    const { id: appointmentId } = req.params; // Updated to use 'id'

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    // Check if the logged-in user is an admin or faculty
    const user = await User.findById(req.user.id);
    if (!["admin", "faculty"].includes(user.role)) {
      return res.status(403).json({ message: "Only administrators or faculty members can approve appointments" });
    }
    // Check if the appointment is already approved or completed
    if (appointment.status === "approved") {
      return res.status(400).json({ message: "Appointment is already approved" });
    }
    if (appointment.status === "completed") {
      return res.status(400).json({ message: "Appointment is already completed" });
    }

    // Update the appointment status to "approved"
    appointment.status = "approved";
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    console.error("Error approving appointment:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all appointments (for admin or faculty)
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("user", "name email") // Populate user details
      .populate({path: "faculty", 
        select: "facultyName" 
      }) // Populate faculty details
      .populate("lab", "labName") // Populate lab details
      .populate("region", "regionName capital"); // Populate region details

      if (!appointments) {
        return res.status(404).json({ message: "No appointments found" });
      } 
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all appointments for the logged-in user 
export const getAllUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id })
      .sort({ appointmentDate: 1 }) // Sort by appointment date
      .populate("faculty", "facultyName") // Populate faculty details
      .populate("lab", "labName") // Populate lab details
      .populate("region", "regionName capital"); // Populate region details

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found" });
    }

    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Get a single appointment
export const getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "User not authorized" });
    }

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Check in for an appointment
export const checkInForAppointments = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "User not authorized" });
    }

    if (appointment.status !== "scheduled" && appointment.status !== "approved") {
      return res.status(400).json({ message: "Cannot check in for this appointment" });
    }

    appointment.status = "checked_in";
    appointment.checkInTime = new Date();

    await appointment.save();
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Check out for an appointment
export const checkOutForAppointments = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "User not authorized" });
    }

    if (appointment.status !== "checked-in") {
      return res.status(400).json({ message: "Cannot check out from this appointment" });
    }

    appointment.status = "completed";
    appointment.checkOutTime = new Date();

    await appointment.save();
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};