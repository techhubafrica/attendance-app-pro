import { Employee } from "../models/employeeModel.js";
import User from "../models/User.js";
import Department from "../models/departmentModel.js";
import Company from "../models/companyModel.js";

// Add a new employee (admin only)
export const addEmployee = async (req, res) => {
  try {
    const { user, department, company, salary, bonus } = req.body;

    // Validate input
    if (!user || !department || !company) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user exists and get their email
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!existingUser.email) {
      return res.status(400).json({ message: "User must have an email address" });
    }

    // Check if the department exists
    const existingDepartment = await Department.findById(department);
    if (!existingDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Check if the company exists
    const existingCompany = await Company.findById(company);
    if (!existingCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if the user is already assigned to the same department and company
    const duplicateEmployee = await Employee.findOne({
      user,
      department,
      company,
    });

    if (duplicateEmployee) {
      return res.status(400).json({
        message: "This user is already assigned to this department in the same company",
      });
    }

    // Create the new employee with the user's email
    const newEmployee = new Employee({
      user,
      email: existingUser.email, // Always include the email from the user
      department,
      company,
      salary: salary || 0,
      bonus: bonus || 0,
    });

    // Save the employee record
    const savedEmployee = await newEmployee.save();
    
    res.status(201).json(savedEmployee);
  } catch (err) {
    // Handle specific MongoDB duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: "An employee with this email already exists",
        field: Object.keys(err.keyPattern)[0]
      });
    }

    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


// Update an employee (admin only)
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate input
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No data provided to update" });
    }

    // Update the employee
    const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("user", "name email role") // Populate user details
      .populate("department", "departmentName") // Populate department details
      .populate("company", " companyName"); // Populate company details

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(updatedEmployee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete an employee (admin only)
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all employees (admin only)
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
    .populate("user", "name email role address phone avatar") // Populate user details
    .populate("department", "departmentName") // Populate department details
    .populate("company", " companyName"); // Populate company details

    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllUsersWhosRoleAreEmployee = async (req, res) => {
  try {
    // Fetch all users with role 'employee'
    const employees = await User.find({ role: "employee" }).select("-password -verifyOtp -verifyOtpExpireAt -isAccountVerified -resetOtp -resetOtpExpiresAt");

    res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Error retrieving employees", error: error.message });
  }
};

// Get a single employee by ID (admin only)
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the employee by ID and populate related fields
    const employee = await Employee.findById(id)
    .populate("user", "name email role address phone avatar createdAt") // Populate user details
      .populate("department", "departmentName") // Populate department details
      .populate("company", "companyName"); // Populate company details

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
