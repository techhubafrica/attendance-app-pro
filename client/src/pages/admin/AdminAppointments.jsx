import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { CheckCircle, Filter, Search } from 'lucide-react';
import { approveAppointment, getAllAppointments } from '@/redux/actions/appointmentActions';

const AdminAppointments = () => {
  const dispatch = useDispatch();
  const { appointments, isLoading } = useSelector(state => state.appointments);
  
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    dispatch(getAllAppointments());
  }, [dispatch]);
  
  useEffect(() => {
    if (appointments) {
      let filtered = [...appointments];
      
      // Apply status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter(app => app.status === statusFilter);
      }
      
      // Apply search filter (searching by username, lab name, or faculty name)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(app => 
          (app.user?.name && app.user.name.toLowerCase().includes(query)) ||
          (app.lab?.labName && app.lab.labName.toLowerCase().includes(query)) ||
          (app.faculty?.facultyName && app.faculty.facultyName.toLowerCase().includes(query))
        );
      }
      
      setFilteredAppointments(filtered);
    }
  }, [appointments, statusFilter, searchQuery]);
  
  const handleApprove = (id) => {
    dispatch(approveAppointment(id));
  };
  
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'checked_in':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center mt-40">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8 mt-30">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Appointments</h1>
        <p className="text-muted-foreground">
          View and manage all user appointments
        </p>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Appointment Statistics</CardTitle>
          <CardDescription>Overview of appointment status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <div className="text-2xl font-bold text-yellow-800">
                {appointments?.filter(a => a.status === 'scheduled').length || 0}
              </div>
              <div className="text-sm text-yellow-600">Scheduled</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-2xl font-bold text-blue-800">
                {appointments?.filter(a => a.status === 'approved').length || 0}
              </div>
              <div className="text-sm text-blue-600">Approved</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="text-2xl font-bold text-green-800">
                {appointments?.filter(a => a.status === 'checked_in').length || 0}
              </div>
              <div className="text-sm text-green-600">Checked In</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <div className="text-2xl font-bold text-purple-800">
                {appointments?.filter(a => a.status === 'completed').length || 0}
              </div>
              <div className="text-sm text-purple-600">Completed</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="text-2xl font-bold text-red-800">
                {appointments?.filter(a => a.status === 'cancelled').length || 0}
              </div>
              <div className="text-sm text-red-600">Cancelled</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by user, lab or faculty..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="w-full sm:w-56">
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent >
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="checked_in">Checked In</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-12 border rounded-md">
          <h3 className="text-lg font-medium">No appointments found</h3>
          <p className="text-muted-foreground mt-2">
            {searchQuery || statusFilter !== 'all' 
              ? 'Try changing your filters to see more results' 
              : 'There are no appointments in the system yet'}
          </p>
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Lab</TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell>{appointment.user?.name || 'Unknown'}</TableCell>
                  <TableCell>{appointment.lab?.labName || 'Unknown'}</TableCell>
                  <TableCell>{appointment.faculty?.facultyName || 'Unknown'}</TableCell>
                  <TableCell>
                    {format(new Date(appointment.appointmentDate), 'PPP p')}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate" title={appointment.purpose}>
                      {appointment.purpose}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(appointment.status)}>
                      {appointment.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {appointment.status === 'scheduled' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleApprove(appointment._id)}
                        className={"cursor-pointer"}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                    )}
                    {appointment.status !== 'scheduled' && (
                      <Button size="sm" variant="outline" disabled className={"cursor-pointer"}>
                        {appointment.status === 'approved' ? 'Approved' : 'No Actions'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;