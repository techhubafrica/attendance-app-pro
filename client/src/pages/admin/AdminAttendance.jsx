import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Users,
  Clock,
  Calendar,
  UserCheck,
  UserX,
} from "lucide-react";
import {
  getAllAttendance,
  getEmployeeAttendance,
} from "@/redux/slices/attendanceSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchEmployees } from "@/redux/actions/employeeActions";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const AdminAttendance = () => {
  const dispatch = useAppDispatch();
  const { employeeAttendance, loading } = useAppSelector(
    (state) => state.attendance
  );
  const { employees } = useAppSelector((state) => state.employees);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("today");

  useEffect(() => {
    dispatch(getAllAttendance());
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleEmployeeSelect = (userId) => {
    setSelectedEmployee(userId);
    dispatch(getEmployeeAttendance(userId, selectedPeriod));
  };

  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period);
    if (selectedEmployee) {
      dispatch(getEmployeeAttendance(selectedEmployee, period));
    }
  };

  const refreshData = () => {
    if (selectedEmployee) {
      dispatch(getEmployeeAttendance(selectedEmployee, selectedPeriod));
    } else {
      dispatch(getAllAttendance());
    }
    toast.success("Attendance data refreshed");
  };

  const calculateWorkHours = (record) => {
    if (!record.checkIn || !record.checkOut) return "N/A";

    const checkInTime = new Date(record.checkIn);
    const checkOutTime = new Date(record.checkOut);

    let totalWorkTime = checkOutTime - checkInTime;
    let breakTime = 0;

    if (record.breaks && record.breaks.length > 0) {
      record.breaks.forEach((breakItem) => {
        if (breakItem.start && breakItem.end) {
          const breakStart = new Date(breakItem.start);
          const breakEnd = new Date(breakItem.end);
          breakTime += breakEnd - breakStart;
        }
      });
    }

    totalWorkTime -= breakTime;

    const hours = Math.floor(totalWorkTime / (1000 * 60 * 60));
    const minutes = Math.floor(
      (totalWorkTime % (1000 * 60 * 60)) / (1000 * 60)
    );

    return `${hours}h ${minutes}m`;
  };

  const getAttendanceStats = () => {
    const totalEmployees = employees.length;
    const presentToday = employeeAttendance.filter(
      (record) =>
        new Date(record.date).toDateString() === new Date().toDateString()
    ).length;
    const absentToday = totalEmployees - presentToday;

    return { totalEmployees, presentToday, absentToday };
  };

  const stats = getAttendanceStats();

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-8 min-h-screen mt-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 mb-1">
            Attendance Management
          </h1>
          <p className="text-green-700">Track and manage employee attendance</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshData}
          className="flex items-center gap-2 text-sm font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 shadow-md mt-4 md:mt-0"
        >
          <RefreshCw size={16} />
          Refresh Data
        </Button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-blue-200 shadow-md bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center mr-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Employees</p>
              <h3 className="text-2xl font-bold text-blue-800">
                {stats.totalEmployees}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 shadow-md bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center mr-4">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Present Today</p>
              <h3 className="text-2xl font-bold text-green-800">
                {stats.presentToday}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 shadow-md bg-gradient-to-r from-red-50 to-red-100">
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 rounded-full bg-red-600 flex items-center justify-center mr-4">
              <UserX className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Absent Today</p>
              <h3 className="text-2xl font-bold text-red-800">
                {stats.absentToday}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-blue-200 shadow-md mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="employee"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Employee
              </label>
              <Select
                onValueChange={handleEmployeeSelect}
                value={selectedEmployee || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {employees &&
                    employees.map((employee) => (
                      <SelectItem key={employee._id} value={employee._id}>
                        {employee.user?.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label
                htmlFor="period"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Time Period
              </label>
              <Select onValueChange={handlePeriodSelect} value={selectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Records */}
      <Card className="border-blue-200 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gradient-to-r from-blue-100 to-green-100">
              <TableRow>
                <TableHead className="text-blue-800 font-semibold">
                  Employee
                </TableHead>
                <TableHead className="text-blue-800 font-semibold">
                  Date
                </TableHead>
                <TableHead className="text-blue-800 font-semibold">
                  Check In
                </TableHead>
                <TableHead className="text-blue-800 font-semibold">
                  Check Out
                </TableHead>
                <TableHead className="text-blue-800 font-semibold">
                  Working Hours
                </TableHead>
                <TableHead className="text-blue-800 font-semibold">
                  Breaks
                </TableHead>
                <TableHead className="text-blue-800 font-semibold">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Loading attendance records...
                    </div>
                  </TableCell>
                </TableRow>
              ) : employeeAttendance && employeeAttendance.length > 0 ? (
                employeeAttendance.map((record, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      <Link
                        to={`/employee/${record.user?._id}`}
                        className="flex items-center capitalize"
                      >
                        {record.user?.user?.name ||
                          `Employee #${record.user?._id || "Unknown"}`}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {format(
                        new Date(record.date || record.createdAt),
                        "MMM dd, yyyy"
                      )}
                    </TableCell>
                    <TableCell>
                      {record.checkIn
                        ? format(new Date(record.checkIn), "hh:mm a")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {record.checkOut
                        ? format(new Date(record.checkOut), "hh:mm a")
                        : "N/A"}
                    </TableCell>
                    <TableCell>{calculateWorkHours(record)}</TableCell>
                    <TableCell>
                      {record.breaks && record.breaks.length > 0 ? (
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-800 border-blue-200"
                        >
                          {record.breaks.length} break(s)
                        </Badge>
                      ) : (
                        "None"
                      )}
                    </TableCell>
                    <TableCell>
                      {!record.checkIn ? (
                        <Badge
                          variant="outline"
                          className="bg-gray-100 text-gray-800 border-gray-200"
                        >
                          Not Started
                        </Badge>
                      ) : !record.checkOut ? (
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-800 border-blue-200"
                        >
                          In Progress
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 border-green-200"
                        >
                          Completed
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-8 w-8 text-blue-300" />
                      <div className="text-gray-500">
                        No attendance records found
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default AdminAttendance;
