import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, CheckCircle, Clock, X } from "lucide-react";
import {
  checkInAppointment,
  checkOutAppointment,
  getUserAppointments,
} from "@/redux/actions/appointmentActions";
import AppointmentsList from "@/components/appointment/AppointmentsList";
import AppointmentForm from "@/components/appointment/AppointmentForm";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import PaymentComponent from "@/components/PaymentComponent";

const Appointments = () => {
  const dispatch = useAppDispatch();
  const { userAppointments } = useAppSelector((state) => state.appointments);
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [appointmentDates, setAppointmentDates] = useState([]);

  useEffect(() => {
    dispatch(getUserAppointments());
  }, [dispatch]);

  useEffect(() => {
    if (userAppointments && userAppointments.length > 0) {
      const dates = userAppointments
        .map((appointment) => {
          const dateObj = startOfDay(parseISO(appointment.appointmentDate));
          if (isNaN(dateObj.getTime())) {
            console.warn("Invalid date for appointment:", appointment);
            return null;
          }
          return dateObj.toISOString().split("T")[0];
        })
        .filter((date) => date !== null);
      setAppointmentDates([...new Set(dates)]);
    }
  }, [userAppointments]);

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

  const getPaymentStatusBadgeColor = (status) => {
    switch (status) {
      case "pending":
        return {
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: Clock, // Using Clock icon to represent pending
        };
      case "paid":
        return {
          className: "bg-green-100 text-green-800 border-green-200",
          icon: CheckCircle, // Using CheckCircle icon to represent successful payment
        };
      case "failed":
        return {
          className: "bg-red-100 text-red-800 border-red-200",
          icon: X, // Using X icon to represent failed payment
        };
      default:
        return {
          className: "bg-gray-100 text-gray-800 border-gray-200",
          icon: null,
        };
    }
  };

  const filteredAppointments = userAppointments.filter((appointment) => {
    const appointmentDate = startOfDay(parseISO(appointment.appointmentDate));
    return appointmentDate.getTime() === selectedDate.getTime();
  });

  const isDayWithAppointment = (date) => {
    const dateString = startOfDay(date).toISOString().split("T")[0];
    return appointmentDates.includes(dateString);
  };

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8 mt-20 bg-gradient-to-b py-8 rounded-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-blue-700">Appointments</h1>
        <p className="text-green-600">Manage your lab appointments</p>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger
            value="calendar"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white cursor-pointer"
          >
            Calendar View
          </TabsTrigger>
          <TabsTrigger
            value="list"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white cursor-pointer"
          >
            List View
          </TabsTrigger>
          <TabsTrigger
            value="create"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white cursor-pointer"
          >
            Book Appointment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sticky calendar card */}
            <Card className="border-blue-200 bg-white shadow-md md:sticky md:top-20 md:self-start md:h-fit">
              <CardHeader className="bg-blue-50 border-b border-blue-100">
                <CardTitle className="flex items-center text-blue-700">
                  <CalendarIcon className="mr-2 h-5 w-5 text-green-600" />
                  Calendar
                </CardTitle>
                <CardDescription className="text-blue-600">
                  Select a date to view appointments
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(startOfDay(date));
                    }
                  }}
                  className="rounded-md border border-blue-200"
                  modifiers={{
                    appointment: (date) => isDayWithAppointment(date),
                    selectedDate: (date) =>
                      startOfDay(date).toISOString().split("T")[0] ===
                      startOfDay(selectedDate).toISOString().split("T")[0],
                  }}
                  modifiersClassNames={{
                    appointment: "bg-green-100 text-green-800 font-bold cursor-pointer",
                    selectedDate: "bg-green-700 text-white cursor-pointer",
                  }}
                />
              </CardContent>
            </Card>

            {/* Scrollable appointments card */}
            <Card className="md:col-span-2 border-green-200 bg-white shadow-md overflow-y-auto max-h-[600px]">
              <CardHeader className="bg-green-50 border-b border-green-100 sticky top-0 z-10">
                <CardTitle className="text-green-700">
                  Appointments for {format(selectedDate, "PPP")}
                </CardTitle>
                <CardDescription className="text-green-600">
                  {filteredAppointments.length
                    ? `You have ${filteredAppointments.length} appointment(s) on this date`
                    : "No appointments scheduled for this date"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {filteredAppointments.length === 0 ? (
                  <div className="text-center py-8 bg-blue-50 rounded-lg">
                    <p className="text-blue-600">
                      No appointments for this date
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAppointments.map((appointment) => (
                      <Card
                        key={appointment._id}
                        className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-green-50">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-blue-700">
                              {appointment.lab?.labName || "Lab"}
                            </CardTitle>
                            <Badge
                              className={getStatusBadgeColor(
                                appointment.status
                              )}
                            >
                              {appointment.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <CardDescription className="text-green-700">
                            Faculty:{" "}
                            {appointment.faculty?.facultyName || "Unknown"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          {/* Appointment details */}
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-blue-600">
                              <Clock className="mr-2 h-4 w-4 text-green-500" />
                              {appointment.appointmentDate
                                ? format(
                                    new Date(appointment.appointmentDate),
                                    "h:mm a"
                                  )
                                : "N/A"}
                            </div>
                            <div className="text-sm truncate max-w-[200px]">
                              <strong className="text-blue-700">
                                Purpose:
                              </strong>{" "}
                              {appointment.purpose}
                            </div>
                            <div className="text-sm">
                              <strong className="text-blue-700">
                                Visitors:
                              </strong>{" "}
                              {appointment.numVisitors}
                            </div>
                            <div className="text-sm">
                              {appointment.paymentStatus && (
                                <div className="text-sm flex items-center">
                                  <strong className="text-blue-700 mr-2">
                                    Payment Status:
                                  </strong>
                                  <div className="flex items-center">
                                    <Badge
                                      className={
                                        getPaymentStatusBadgeColor(
                                          appointment.paymentStatus
                                        ).className
                                      }
                                    >
                                      {(() => {
                                        const StatusIcon =
                                          getPaymentStatusBadgeColor(
                                            appointment.paymentStatus
                                          ).icon;
                                        return (
                                          <>
                                            {StatusIcon && (
                                              <StatusIcon className="mr-1 h-3 w-3" />
                                            )}
                                            {appointment.paymentStatus}
                                          </>
                                        );
                                      })()}
                                    </Badge>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="text-sm">
                              <strong className="text-blue-700">
                                PayPal Order ID:
                              </strong>{" "}
                              {appointment.paypalOrderId}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="bg-blue-50 bg-opacity-50">
                          {appointment.paymentStatus === "pending" && (
                            <div className="w-full">
                              <PaymentComponent appointment={appointment} />
                            </div>
                          )}
                          {appointment.status === "approved" && (
                            <Button
                              className="bg-green-600 hover:bg-green-700 text-white mr-2"
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
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() =>
                                dispatch(checkOutAppointment(appointment._id))
                              }
                            >
                              <X className="mr-2 h-4 w-4" />
                              Check Out
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card className="border-blue-200 bg-white shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-green-100">
              <CardTitle className="text-blue-700">All Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <AppointmentsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card className="border-green-200 bg-white shadow-md">
            <CardHeader className="bg-gradient-to-r from-green-100 to-blue-100">
              <CardTitle className="text-green-700">
                Book New Appointment
              </CardTitle>
              <CardDescription className="text-blue-600">
                Fill out the form below to schedule a new lab appointment
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <AppointmentForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Appointments;
