import Attendance from "../models/attendanceModel.js";
import { Employee } from "../models/employeeModel.js";

// Get attendance for all employees in a department
export const getDepartmentAttendance = async (req, res) => {
  try {
    const { departmentId } = req.params;

    // Find all employees in the specified department
    const employees = await Employee.find({ department: departmentId });
    const employeeIds = employees.map((emp) => emp._id);

    // Fetch attendance records for these employees
    const attendanceRecords = await Attendance.find({
      user: { $in: employeeIds }, // `user` references Employee
    }).populate({
      path: "user", // Populate the `user` field in Attendance (references Employee)
      select: "user department", // Include only necessary fields
      populate: [
        {
          path: "user", // Populate the `user` field in Employee (references User)
          select: "name email", // Include only necessary fields
        },
        {
          path: "department", // Populate the `department` field in Employee (references Department)
          select: "departmentName", // Include only necessary fields
        },
      ],
    });

    res.json(attendanceRecords);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};