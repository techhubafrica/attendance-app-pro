import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Loader2 } from "lucide-react";
import { fetchDepartments } from "@/redux/actions/departmentActions";
import { getDepartmentAttendance } from "@/redux/actions/departmentAttendanceActions";
import { Link } from "react-router-dom";

const DepartmentAttendance = () => {
  const dispatch = useDispatch();
  const { departmentAttendance, loading } = useSelector(
    (state) => state.departmentAttendance
  );
  const { departments } = useSelector((state) => state.departments);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // Fetch departments when component loads
  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  // Get department attendance when a department is selected
  useEffect(() => {
    if (selectedDepartment) {
      dispatch(getDepartmentAttendance(selectedDepartment));
    }
  }, [selectedDepartment, dispatch]);

  // Calculate working hours
  const calculateWorkHours = (record) => {
    if (!record.checkIn || !record.checkOut) return "N/A";

    const checkInTime = new Date(record.checkIn);
    const checkOutTime = new Date(record.checkOut);

    let totalWorkTime = checkOutTime - checkInTime;
    let breakTime = 0;

    // Calculate total break time
    if (record.breaks && record.breaks.length > 0) {
      record.breaks.forEach((breakItem) => {
        if (breakItem.start && breakItem.end) {
          const breakStart = new Date(breakItem.start);
          const breakEnd = new Date(breakItem.end);
          breakTime += breakEnd - breakStart;
        }
      });
    }

    // Subtract break time from work time
    totalWorkTime -= breakTime;

    // Convert to hours and minutes
    const hours = Math.floor(totalWorkTime / (1000 * 60 * 60));
    const minutes = Math.floor(
      (totalWorkTime % (1000 * 60 * 60)) / (1000 * 60)
    );

    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6 mt-30">
      <Card>
        <CardHeader>
          <CardTitle>Department Attendance</CardTitle>
          <CardDescription>
            View attendance records for employees in a specific department
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">
                Select Department
              </label>
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger className="w-full sm:w-[250px] cursor-pointer">
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {departments &&
                    departments.map((dept) => (
                      <SelectItem
                        key={dept._id}
                        value={dept._id}
                        className={"cursor-pointer"}
                      >
                        {dept.departmentName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {selectedDepartment ? (
              <div className="rounded-md border mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Working Hours</TableHead>
                      <TableHead>Breaks</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10">
                          <div className="flex justify-center">
                            <Loader2 className="h-6 w-6 animate-spin" />
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            Loading attendance records...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : departmentAttendance &&
                      departmentAttendance.length > 0 ? (
                      departmentAttendance.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <Link
                              to={`/employee/${record.user?._id}`}
                              className="flex items-center"
                            >
                              {record.user?.user?.name ||
                                `Employee #${record.user?._id || "Unknown"}`}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {record.date
                              ? format(new Date(record.date), "MMM dd, yyyy")
                              : "N/A"}
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
                              <Badge variant="outline">
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
                                className="bg-gray-100 text-gray-800"
                              >
                                Not Started
                              </Badge>
                            ) : !record.checkOut ? (
                              <Badge
                                variant="outline"
                                className="bg-blue-100 text-blue-800"
                              >
                                In Progress
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800"
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
                            <Users className="h-8 w-8 text-muted-foreground" />
                            <div className="text-muted-foreground">
                              No attendance records found
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                Please select a department to view attendance records
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentAttendance;
