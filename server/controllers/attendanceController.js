import Attendance from "../models/attendanceModel.js";
import { Employee } from "../models/employeeModel.js";
import mongoose from "mongoose";

// Check-in an employee
export const checkIn = async (req, res) => {
  try {
    // Find the employee associated with the authenticated user
    const employee = await Employee.findOne({ user: req.user.id });

    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Set to midnight in UTC (Ghana Time)

    let attendance = await Attendance.findOne({
      user: employee._id, // Use the employee's ID
      date: today,
    });

    if (attendance) {
      return res.status(400).json({ msg: "Already checked in for today" });
    }

    attendance = new Attendance({
      user: employee._id, // Use the employee's ID
      checkIn: new Date(),
      date: today,
    });

    await attendance.save();
    const formatDateToGhanaTime = (date) => {
      return new Date(date).toLocaleString("en-GH", {
        timeZone: "Africa/Accra",
        hour12: false,
      });
    };
    res.json({
      success: true,
      attendance: {
        ...attendance.toObject(),
        checkIn: formatDateToGhanaTime(attendance.checkIn),
        checkOut: attendance.checkOut
          ? formatDateToGhanaTime(attendance.checkOut)
          : null,
        date: formatDateToGhanaTime(attendance.date),
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Check-out an employee
export const checkOut = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });

    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Set to midnight in UTC (Ghana Time)

    const attendance = await Attendance.findOne({
      user: employee._id,
      date: today,
      checkOut: { $exists: false }, // Ensure check-out hasn't happened yet
    });

    if (!attendance) {
      return res
        .status(400)
        .json({ msg: "No active check-in found for today" });
    }

    attendance.checkOut = new Date();

    // Calculate total work hours
    const workHours =
      (attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60);
    attendance.totalWorkHours = workHours;

    await attendance.save();
    const decimalToHoursMinutes = (decimalHours) => {
      const hours = Math.floor(decimalHours);
      const minutes = Math.round((decimalHours - hours) * 60);
      return `${hours} hour(s) ${minutes} minute(s)`;
    };
    res.json({
      success: true,
      attendance: {
        ...attendance.toObject(),
        totalWorkHours: decimalToHoursMinutes(attendance.totalWorkHours),
        totalBreakHours: decimalToHoursMinutes(attendance.totalBreakHours),
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Log breaks for an employee
export const breaks = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });

    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Set to midnight in UTC (Ghana Time)

    const attendance = await Attendance.findOne({
      user: employee._id,
      date: today,
      checkOut: { $exists: false }, // Ensure check-out hasn't happened yet
    });

    if (!attendance) {
      return res
        .status(400)
        .json({ msg: "No active check-in found for today" });
    }

    const lastBreak = attendance.breaks[attendance.breaks.length - 1];

    if (lastBreak && !lastBreak.end) {
      lastBreak.end = new Date();

      // Calculate break duration
      const breakDuration =
        (lastBreak.end - lastBreak.start) / (1000 * 60 * 60);
      attendance.totalBreakHours += breakDuration;
    } else {
      attendance.breaks.push({ start: new Date() });
    }

    await attendance.save();

    const decimalToHoursMinutes = (decimalHours) => {
      const hours = Math.floor(decimalHours);
      const minutes = Math.round((decimalHours - hours) * 60);
      return `${hours} hour(s) ${minutes} minute(s)`;
    };
    res.json({
      success: true,
      attendance: {
        ...attendance.toObject(),
        totalWorkHours: decimalToHoursMinutes(attendance.totalWorkHours),
        totalBreakHours: decimalToHoursMinutes(attendance.totalBreakHours),
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const userAttendanceHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (parseInt(page) <= 0 || parseInt(limit) <= 0) {
      return res.status(400).json({ message: "Invalid page or limit value" });
    }

    // Find the employee associated with the authenticated user
    const employee = await Employee.findOne({ user: userId }).populate({
      path: "company",
      select: "companyName companyAddress",
      populate: {
        path: "departments", // Populate the `department` field in Company (references Department)
        select: "departmentName", // Include only necessary fields
      },
    });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const dateQuery = {};
    if (startDate && !isNaN(new Date(startDate)))
      dateQuery.$gte = new Date(startDate);
    if (endDate && !isNaN(new Date(endDate)))
      dateQuery.$lte = new Date(endDate);

    if (!startDate)
      dateQuery.$gte = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    if (!endDate) dateQuery.$lte = new Date();

    const attendance = await Attendance.find({
      user: employee._id, // Use the employee's ID
      ...(Object.keys(dateQuery).length && { date: dateQuery }),
    })
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const count = await Attendance.countDocuments({ user: employee._id });

    const decimalToHoursMinutes = (decimalHours) => {
      const hours = Math.floor(decimalHours);
      const minutes = Math.round((decimalHours - hours) * 60);
      return `${hours} hour(s) ${minutes} minute(s)`;
    };
    // Convert decimal hours to hours and minutes
    const formattedAttendance = attendance.map((record) => ({
      ...record.toObject(),
      totalWorkHours: decimalToHoursMinutes(record.totalWorkHours),
      totalBreakHours: decimalToHoursMinutes(record.totalBreakHours),
    }));

    res.json({
      attendance: formattedAttendance,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalCount: count,
    });
  } catch (error) {
    console.error("Attendance History Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all attendance records (for admin)
export const getAllAttendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find().populate({
      path: "user", // Populate the `user` field in Attendance (references Employee)
      populate: {
        path: "user", // Populate the `user` field in Employee (references User)
        select: "name email", // Include only necessary fields
      },
    });
    const decimalToHoursMinutes = (decimalHours) => {
      const hours = Math.floor(decimalHours);
      const minutes = Math.round((decimalHours - hours) * 60);
      return `${hours} hour(s) ${minutes} minute(s)`;
    };

    const formattedAttendance = attendanceRecords.map((record) => ({
      ...record.toObject(),
      totalWorkHours: decimalToHoursMinutes(record.totalWorkHours),
      totalBreakHours: decimalToHoursMinutes(record.totalBreakHours),
    }));

    res.json({ attendanceRecords: formattedAttendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
// Get attendance for an employee (by day, week, month, year)
export const getEmployeeAttendance = async (req, res) => {
  try {
    const { userId, period } = req.params;

    let startDate, endDate;
    const today = new Date();

    switch (period) {
      case "today":
        startDate = new Date(today.setHours(0, 0, 0, 0));
        endDate = new Date(today.setHours(23, 59, 59, 999));
        break;
      case "yesterday":
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        endDate.setDate(endDate.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "week":
        startDate = new Date(today.setDate(today.getDate() - today.getDay()));
        endDate = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        break;
      case "month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "year":
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31);
        break;
      default:
        return res.status(400).json({ message: "Invalid period" });
    }

    const attendanceRecords = await Attendance.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    }).populate({
      path: "user", // Populate the `user` field in Attendance (references Employee)
      populate: {
        path: "user", // Populate the `user` field in Employee (references User)
        select: "name email", // Include only necessary fields
      }      
    });

    const decimalToHoursMinutes = (decimalHours) => {
      const hours = Math.floor(decimalHours);
      const minutes = Math.round((decimalHours - hours) * 60);
      return `${hours} hour(s) ${minutes} minute(s)`;
    };

    const formattedAttendance = attendanceRecords.map((record) => ({
      ...record.toObject(),
      totalWorkHours: decimalToHoursMinutes(record.totalWorkHours),
      totalBreakHours: decimalToHoursMinutes(record.totalBreakHours),
    }));

    res.json({ attendanceRecords: formattedAttendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get month-over-month and year-over-year attendance for payroll
// export const getAttendanceForPayroll = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // Month-over-month
//     const monthlyAttendance = await Attendance.aggregate([
//       {
//         $match: { user: mongoose.Types.ObjectId(userId) },
//       },
//       {
//         $group: {
//           _id: { month: { $month: "$date" }, year: { $year: "$date" } },
//           totalDays: { $sum: 1 },
//         },
//       },
//       {
//         $sort: { "_id.year": 1, "_id.month": 1 },
//       },
//     ]);

//     // Year-over-year
//     const yearlyAttendance = await Attendance.aggregate([
//       {
//         $match: { user: mongoose.Types.ObjectId(userId) },
//       },
//       {
//         $group: {
//           _id: { year: { $year: "$date" } },
//           totalDays: { $sum: 1 },
//         },
//       },
//       {
//         $sort: { "_id.year": 1 },
//       },
//     ]);

//     res.json({ monthlyAttendance, yearlyAttendance });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };
