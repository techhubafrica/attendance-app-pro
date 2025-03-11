import Appointment from "../models/appointmentModel.js";
import Region from "../models/regionModel.js";
import RoboticsLab from "../models/roboticsLabModel.js";

// Create a new robotics lab (admin only)
export const createRoboticsLab = async (req, res) => {
  try {
    const { labName, region } = req.body;

    // Validate input
    if (!labName || !region) {
      return res.status(400).json({ message: "Please provide a lab name and region." });
    }

    // Check if the region exists
    const existingRegion = await Region.findById(region);
    if (!existingRegion) {
      return res.status(404).json({ message: "Region not found" });
    }

    // Check if a lab with the same name already exists in the same region
    const existingLab = await RoboticsLab.findOne({ labName, region });
    if (existingLab) {
      return res.status(400).json({ message: "A lab with this name already exists in the specified region." });
    }

    // Create the new lab
    const newLab = new RoboticsLab({
      labName,
      region,
    });

    await newLab.save();

    // Add the lab to the region's labs array
    await Region.findByIdAndUpdate(region, {
      $push: { roboticsLabs: newLab._id },
    });

    res.status(201).json(newLab);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all robotics labs
export const getAllRoboticsLabs = async (req, res) => {
  try {
    const labs = await RoboticsLab.find()
      .populate({path: "region", 
        select: "regionName capital" // Select fields from the Region model 
      }) // Populate region details
      .populate("appointments", "appointmentDate purpose status"); // Populate appointments

    res.json(labs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get a single robotics lab
export const getSingleRoboticsLab = async (req, res) => {
  try {
    const lab = await RoboticsLab.findById(req.params.id)
      .populate("region", "regionName capital") // Populate region details
      .populate("appointments", "appointmentDate purpose status"); // Populate appointments

    if (!lab) {
      return res.status(404).json({ message: "Robotics lab not found" });
    }

    res.json(lab);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update a robotics lab (admin only)
export const updateRoboticsLab = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedLab = await RoboticsLab.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("region", "regionName capital") // Populate region details
      .populate("appointments", "appointmentDate purpose status"); // Populate appointments

    if (!updatedLab) {
      return res.status(404).json({ message: "Robotics lab not found" });
    }

    res.json(updatedLab);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a robotics lab (admin only)
export const deleteRoboticsLab = async (req, res) => {
  try {
    const { id } = req.params;

    const lab = await RoboticsLab.findByIdAndDelete(id);
    if (!lab) {
      return res.status(404).json({ message: "Robotics lab not found" });
    }

    // Remove the lab from the region's labs array
    await Region.findByIdAndUpdate(lab.region, {
      $pull: { roboticsLabs: lab._id },
    });

    res.json({ message: "Robotics lab deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Add an appointment to a robotics lab
export const addAppointmentToLab = async (req, res) => {
  try {
    const { labId, appointmentId } = req.body;

    const lab = await RoboticsLab.findById(labId);
    if (!lab) {
      return res.status(404).json({ message: "Robotics lab not found" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Add the appointment to the lab
    lab.appointments.push(appointmentId);
    await lab.save();

    res.status(200).json(lab);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Remove an appointment from a robotics lab
export const removeAppointmentFromLab = async (req, res) => {
  try {
    const { labId, appointmentId } = req.body;

    const lab = await RoboticsLabModel.findById(labId);
    if (!lab) {
      return res.status(404).json({ message: "Robotics lab not found" });
    }

    // Remove the appointment from the lab
    lab.appointments = lab.appointments.filter(
      (appointment) => appointment.toString() !== appointmentId
    );
    await lab.save();

    res.status(200).json(lab);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getLabDetails = async (req, res) => {
  try {
    const { labId } = req.params;

    // Find the lab and populate the region and appointments fields
    const existingLab = await RoboticsLab.findById(labId)
      .populate("region", "name capital") // Populate region fields
      .populate("appointments", "appointmentDate purpose status"); // Populate appointment fields

    if (!existingLab) {
      return res.status(404).json({ message: "Lab not found" });
    }

    res.json(existingLab);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};