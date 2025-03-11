import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, CheckCircle, Clock, X } from 'lucide-react';
import { checkInAppointment, checkOutAppointment, getUserAppointments } from '@/redux/actions/appointmentActions';
import AppointmentsList from '@/components/appointment/AppointmentsList';
import AppointmentForm from '@/components/appointment/AppointmentForm';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';

const Appointments = () => {
  const dispatch = useAppDispatch();
  const { userAppointments, isLoading } = useAppSelector(state => state.appointments);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointmentDates, setAppointmentDates] = useState([]);

  useEffect(() => {
    dispatch(getUserAppointments());
  }, [dispatch]);

  useEffect(() => {
    if (userAppointments && userAppointments.length > 0) {
      const dates = userAppointments.map(appointment => 
        new Date(appointment.appointmentDate).toISOString().split('T')[0]
      );
      setAppointmentDates([...new Set(dates)]);
    }
  }, [userAppointments]);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'checked_in':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'completed':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredAppointments = userAppointments.filter(appointment => {
    const appointmentDate = new Date(appointment.appointmentDate);
    return (
      appointmentDate.getDate() === selectedDate.getDate() &&
      appointmentDate.getMonth() === selectedDate.getMonth() &&
      appointmentDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Function to highlight calendar dates with appointments
  const isDayWithAppointment = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return appointmentDates.includes(dateString);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center mt-40">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8 mt-30 bg-gradient-to-b py-8 rounded-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-blue-700">Appointments</h1>
        <p className="text-green-600">Manage your lab appointments</p>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="mb-6 ">
          <TabsTrigger value="calendar" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">Calendar View</TabsTrigger>
          <TabsTrigger value="list" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">List View</TabsTrigger>
          <TabsTrigger value="create" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">Book Appointment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-blue-200 bg-white shadow-md">
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
                      setSelectedDate(date);
                    }
                  }}
                  className="rounded-md border border-blue-200"
                  modifiers={{
                    appointment: (date) => isDayWithAppointment(date),
                  }}
                  modifiersClassNames={{
                    appointment: "bg-green-100 text-green-800 font-bold",
                  }}
                />
              </CardContent>
            </Card>

            <Card className="md:col-span-2 border-green-200 bg-white shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <CardTitle className="text-green-700">
                  Appointments for {format(selectedDate, 'PPP')}
                </CardTitle>
                <CardDescription className="text-green-600">
                  {filteredAppointments.length 
                    ? `You have ${filteredAppointments.length} appointment(s) on this date`
                    : 'No appointments scheduled for this date'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {filteredAppointments.length === 0 ? (
                  <div className="text-center py-8 bg-blue-50 rounded-lg">
                    <p className="text-blue-600">No appointments for this date</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAppointments.map((appointment) => (
                      <Card key={appointment._id} className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-green-50">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-blue-700">{appointment.lab?.labName || 'Lab'}</CardTitle>
                            <Badge className={getStatusBadgeColor(appointment.status)}>
                              {appointment.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <CardDescription className="text-green-700">
                            Faculty: {appointment.faculty?.facultyName || 'Unknown'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-blue-600">
                              <Clock className="mr-2 h-4 w-4 text-green-500" />
                              {appointment.appointmentDate ? format(new Date(appointment.appointmentDate), 'h:mm a') : 'N/A'}
                            </div>
                            <div className="text-sm">
                              <strong className="text-blue-700">Purpose:</strong> {appointment.purpose}
                            </div>
                            <div className="text-sm">
                              <strong className="text-blue-700">Visitors:</strong> {appointment.numVisitors}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="bg-blue-50 bg-opacity-50">
                          {appointment.status === 'approved' && (
                            <Button 
                              className="bg-green-600 hover:bg-green-700 text-white mr-2"
                              onClick={() => dispatch(checkInAppointment(appointment._id))}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Check In
                            </Button>
                          )}
                          {appointment.status === 'checked_in' && (
                            <Button 
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => dispatch(checkOutAppointment(appointment._id))}
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
              <CardTitle className="text-green-700">Book New Appointment</CardTitle>
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