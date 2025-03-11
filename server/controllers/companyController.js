import Company from "../models/companyModel.js";
import Department from "../models/departmentModel.js";

// Create a new company (admin only)
export const createCompany = async (req, res) => {
  try {
    const { companyName, companyAddress, departmentIds } = req.body;

    // Validate the name field
    if (!companyName || companyName.trim() === "") {
      return res.status(400).json({ message: "Company name is required" });
    }
    // Validate the address field
    if (!companyAddress || companyAddress.trim() === "") {
      return res.status(400).json({ message: "Company address is required" });
    }
    // Check if the company name already exists
    const existingCompany = await Company.findOne({ companyName });
    if (existingCompany) {
      return res.status(400).json({ message: "Company name already exists" });
    }

    const newCompany = new Company({
      companyName,
      companyAddress,
      departments: departmentIds, // Include department IDs
    });

    await newCompany.save();
    res.status(201).json(newCompany);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all companies
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate({
      path: "departments",
      select: "departmentName manager", // Populate department details
      populate: {
        path: "manager",
        select: "user email", // Populate manager details
        populate: {
          path: "user",
          select: "name", // Populate user details
        },
      },
    });

    res.json(companies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update a company (admin only)
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, companyAddress, departmentIds } = req.body;

    // Check if the company exists
    const existingCompany = await Company.findById(id);
    if (!existingCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if the name is being updated and if it already exists
    if (companyName && companyName !== existingCompany.companyName) {
      const companyWithSameName = await Company.findOne({ companyName });
      if (companyWithSameName) {
        return res.status(400).json({ message: "Company name already exists" });
      }
    }

    // Update the company
    const updatedCompany = await Company.findByIdAndUpdate(
      id,
      { companyName, companyAddress, departments: departmentIds },
      { new: true } // Return the updated document
    );

   
    res.json({ message: "Company updated successfully", updatedCompany });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a company (admin only)
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findByIdAndDelete(id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Remove the company reference from all associated departments
    await Department.updateMany(
      { company: id },
      { $unset: { company: "" } }
    );

    res.json({ message: "Company deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get a single company by ID
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id).populate({
      path: "departments",
      select: "departmentName manager", // Populate department details
      populate: {
        path: "manager",
        select: "user email", // Populate manager details
        populate: {
          path: "user",
          select: "name", // Populate user details
        },
      },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(company);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};