import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  CheckCircle,
  X,
  Calendar,
  Building,
  User,
  FileText,
} from "lucide-react";
import {
  checkInAppointment,
  checkOutAppointment,
} from "@/redux/actions/appointmentActions";

const AppointmentsList = () => {
  const dispatch = useDispatch();
  const { userAppointments, isLoading } = useSelector(
    (state) => state.appointments
  );

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "checked_in":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "completed":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!userAppointments || userAppointments.length === 0) {
    return (
      <div className="text-center py-12 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-medium text-blue-700">
          No appointments found
        </h3>
        <p className="text-green-600 mt-2">
          You haven't booked any appointments yet
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-blue-200 shadow-md overflow-hidden">
      <Table>
        <TableHeader className="bg-gradient-to-r from-blue-100 to-green-100">
          <TableRow>
            <TableHead className="text-blue-700 font-semibold">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-green-600" />
                Date & Time
              </div>
            </TableHead>
            <TableHead className="text-blue-700 font-semibold">
              <div className="flex items-center">
                <Building className="mr-2 h-4 w-4 text-green-600" />
                Lab
              </div>
            </TableHead>
            <TableHead className="text-blue-700 font-semibold">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-green-600" />
                Faculty
              </div>
            </TableHead>
            <TableHead className="text-blue-700 font-semibold">
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-green-600" />
                Purpose
              </div>
            </TableHead>
            <TableHead className="text-blue-700 font-semibold">
              Status
            </TableHead>
            <TableHead className="text-right text-blue-700 font-semibold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userAppointments.map((appointment, index) => (
            <TableRow
              key={appointment._id}
              className={`${
                index % 2 === 0
                  ? "bg-blue-50 bg-opacity-30"
                  : "bg-green-50 bg-opacity-30"
              } hover:bg-blue-100 hover:bg-opacity-40 transition-colors`}
            >
              <TableCell className="font-medium text-blue-700">
                {(() => {
                  const dateObj = new Date(appointment.appointmentDate);
                  return isNaN(dateObj.getTime())
                    ? "Invalid date"
                    : format(dateObj, "PPP p");
                })()}
              </TableCell>

              <TableCell>{appointment.lab?.labName || "Unknown"}</TableCell>
              <TableCell>
                {appointment.faculty?.facultyName || "Unknown"}
              </TableCell>
              <TableCell className="truncate max-w-[200px]">
                {appointment.purpose}
              </TableCell>

              <TableCell>
                <Badge
                  className={`${getStatusBadgeColor(
                    appointment.status
                  )} font-medium`}
                >
                  {appointment.status
                    ? appointment.status.replace("_", " ")
                    : "No status"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {appointment.status === "approved" && (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() =>
                      dispatch(checkInAppointment(appointment._id))
                    }
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Check In
                  </Button>
                )}
                {appointment.status === "checked_in" && (
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() =>
                      dispatch(checkOutAppointment(appointment._id))
                    }
                  >
                    <X className="mr-2 h-4 w-4" />
                    Check Out
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppointmentsList;
