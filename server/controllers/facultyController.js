import Faculty from "../models/facultyModel.js";
import { Employee } from "../models/employeeModel.js";

// Create a new faculty member (admin only)
export const createFaculty = async (req, res) => {
  try {
    const { facultyName, employee, isAdmin } = req.body;
    // Validate input
    if (!employee) {
      return res.status(400).json({ message: "Employee ID is required" });
    }
    // validate faculty name
    if (!facultyName) {
      return res.status(400).json({ message: "Faculty name is required" });
    }
    // Check if the employee exists
    const existingEmployee = await Employee.findById(employee);
    if (!existingEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if the employee is already a faculty member
    const existingFaculty = await Faculty.findOne({ employee });
    if (existingFaculty) {
      return res.status(400).json({ message: "Employee is already a faculty member" });
    }

    // Create the new faculty member
    const newFaculty = new Faculty({
      facultyName,
      employee,
      isAdmin: isAdmin || false, // Default to false if not provided
    });

    await newFaculty.save();
    res.status(201).json(newFaculty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all faculty members
export const getAllFaculty = async (req, res) => {
  try {
    const facultyMembers = await Faculty.find()
      .populate({path: "employee", 
        select: "user email",
        populate: {
          path: "user",
          select: "name", // Select the name field from the User model
        }
      }) // Populate employee details
      .populate("appointments", "appointmentDate purpose status") // Populate appointments
      .populate("booksBorrowed", "title author"); // Populate borrowed books

    res.json(facultyMembers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update a faculty member (admin only)
export const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate input
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No data provided to update" });
    }

    // Update the faculty member
    const updatedFaculty = await Faculty.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("employee", "name email role") // Populate employee details
      .populate("appointments", "appointmentDate purpose status") // Populate appointments
      .populate("booksBorrowed", "title author"); // Populate borrowed books

    if (!updatedFaculty) {
      return res.status(404).json({ message: "Faculty member not found" });
    }

    res.json(updatedFaculty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a faculty member (admin only)
export const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;

    const faculty = await Faculty.findByIdAndDelete(id);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty member not found" });
    }

    res.json({ message: "Faculty member deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
//get single faculty
export const getFacultyById = async (req, res) => {
  try {
    const { id } = req.params;

    const faculty = await Faculty.findById(id)
      .populate("employee", "name email role") // Populate employee details
      .populate("appointments", "appointmentDate purpose status") // Populate appointments
      .populate("booksBorrowed", "title author"); // Populate borrowed books

    if (!faculty) {
      return res.status(404).json({ message: "Faculty member not found" });
    }

    res.json(faculty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};