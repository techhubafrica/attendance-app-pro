import Company from "../models/companyModel.js";
import Department from "../models/departmentModel.js";
import { Employee } from "../models/employeeModel.js";

// Create a new department (admin only)
export const createDepartment = async (req, res) => {
  try {
    const { departmentName, manager, company } = req.body;

    // Check if the manager exists
    // const existingManager = await Employee.findById(manager);
    // if (!existingManager) {
    //   return res.status(404).json({ message: "Manager not found" });
    // }

    // Check if the company exists
    const existingCompany = await Company.findById(company);
    if (!existingCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if the department name already exists for this company
    const existingDepartmentName = await Department.findOne({ departmentName, company });
    if (existingDepartmentName) {
      return res.status(400).json({ 
        message: "Department name already exists for this company." 
      });
    }

    // Check if the manager is already assigned to the same company in another department
    const existingDepartment = await Department.findOne({ manager, company });
    if (existingDepartment) {
      return res.status(400).json({ 
        message: "This manager is already assigned to a department in this company." 
      });
    }

    // Create a new department
    const newDepartment = new Department({
      departmentName,
      manager,
      company,
    });

    await newDepartment.save();

    // Add the department to the company's departments array
    await Company.findByIdAndUpdate(company, {
      $push: { departments: newDepartment._id },
    });

    res.status(201).json(newDepartment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all departments
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()

      .populate({
        path: "manager", // Populate the manager field
        select: "user email", // Select fields from the Employee model
        populate: {
          path: "user", // Populate the user field inside the Employee model
          select: "name", // Select the name field from the User model
        },
      })
      .populate("company", "companyName") // Populate company details
      .sort({ departmentName: 1 }); // Sort by department name in ascending order

    if (!departments) {
      return res.status(404).json({ message: "Departments not found" });
    }

    res.json(departments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update a department (admin only)
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    )
      .populate({
        path: "manager", // Populate the manager field
        select: "user email", // Select fields from the Employee model
        populate: {
          path: "user", // Populate the user field inside the Employee model
          select: "name", // Select the name field from the User model
        },
      })
      .populate("company", "companyName"); // Populate company details

    if (!updatedDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json(updatedDepartment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a department (admin only)
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByIdAndDelete(id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Remove the department from the company's departments array
    await Company.findByIdAndUpdate(department.company, {
      $pull: { departments: department._id },
    });

    res.json({ message: "Department deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
