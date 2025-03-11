import { validationResult } from "express-validator";
import Region from "../models/regionModel.js";
import Appointment from "../models/appointmentModel.js";
import RoboticsLab from "../models/roboticsLabModel.js"; // Import RoboticsLab model

// Get all regions
export const getRegions = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;

    const total = await Region.countDocuments();
    const regions = await Region.find()
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("roboticsLabs", "labName location") // Populate robotics labs
      .populate("appointments", "appointmentDate purpose status"); // Populate appointments

    res.json({
      regions,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Create a new region (admin only)
export const createRegion = async (req, res) => {
  try {
    const { regionName, capital, roboticsLabs } = req.body;

    if (!regionName || !capital) {
      return res
        .status(400)
        .json({ message: "Please provide a region name and capital." });
    }

    const newRegion = new Region({
      regionName,
      capital,
      roboticsLabs: roboticsLabs || [], // Include robotics labs if provided
    });

    const region = await newRegion.save();
    res.status(201).json(region);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "A region with this name || capital already exists.",
      });
    }
    console.error("Server Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update a region (admin only)
export const updateRegion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedRegion = await Region.findByIdAndUpdate(
      id,
      { ...updateData, roboticsLabs: updateData.roboticsLabs || [] }, // Include robotics labs if provided
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedRegion) {
      return res.status(404).json({ message: "Region not found" });
    }

    res.status(200).json({
      success: true,
      message: "Region updated successfully",
      region: updatedRegion,
    });
  } catch (error) {
    console.error("Update region error:", error);
    res.status(500).json({ message: "Error updating region", error: error.message });
  }
};

// Get a single region with appointments and robotics labs
export const getSingleRegion = async (req, res) => {
  try {
    const region = await Region.findById(req.params.id)
      .populate("appointments", "appointmentDate purpose status")
      .populate("roboticsLabs", "labName location"); // Populate robotics labs

    if (!region) {
      return res.status(404).json({ message: "Region not found" });
    }

    res.json(region);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a region (admin only)
export const deleteRegion = async (req, res) => {
  try {
    const region = await Region.findById(req.params.id);

    if (!region) {
      return res.status(404).json({ message: "Region not found" });
    }

    // Remove all appointments associated with the region
    await Appointment.deleteMany({ region: region._id });

    // Remove all robotics labs associated with the region
    await RoboticsLab.deleteMany({ region: region._id });

    await region.deleteOne(); // Use deleteOne() instead of remove()

    res.json({ message: "Region deleted successfully" });
  } catch (err) {
    console.error("Error deleting region:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Add an appointment to a region
export const addAppointmentToRegion = async (req, res) => {
  try {
    const { regionId, appointmentId } = req.body;

    const region = await Region.findById(regionId);
    if (!region) {
      return res.status(404).json({ message: "Region not found" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Add the appointment to the region
    region.appointments.push(appointmentId);
    await region.save();

    res.status(200).json(region);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Remove an appointment from a region
export const removeAppointmentFromRegion = async (req, res) => {
  try {
    const { regionId, appointmentId } = req.body;

    const region = await Region.findById(regionId);
    if (!region) {
      return res.status(404).json({ message: "Region not found" });
    }

    // Remove the appointment from the region
    region.appointments = region.appointments.filter(
      (appointment) => appointment.toString() !== appointmentId
    );
    await region.save();

    res.status(200).json(region);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Add robotics labs to a region
export const addRoboticsLabsToRegion = async (req, res) => {
  try {
    const { regionId, labIds } = req.body;

    const region = await Region.findById(regionId);
    if (!region) {
      return res.status(404).json({ message: "Region not found" });
    }

    // Add the lab IDs to the region
    region.roboticsLabs.push(...labIds);
    await region.save();

    res.status(200).json(region);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Remove robotics labs from a region
export const removeRoboticsLabsFromRegion = async (req, res) => {
  try {
    const { regionId, labIds } = req.body;

    const region = await Region.findById(regionId);
    if (!region) {
      return res.status(404).json({ message: "Region not found" });
    }

    // Remove the lab IDs from the region
    region.roboticsLabs = region.roboticsLabs.filter(
      (labId) => !labIds.includes(labId.toString())
    );
    await region.save();

    res.status(200).json(region);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};