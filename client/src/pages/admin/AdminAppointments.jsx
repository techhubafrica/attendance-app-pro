import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  TableCaption 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { 
  Calendar, 
  Filter, 
  Search, 
  CheckCircle, 
  RefreshCw, 
  TrendingUp 
} from 'lucide-react';
import { format } from 'date-fns';
import { approveAppointment, getAllAppointments } from '@/redux/actions/appointmentActions';
import AppointmentDetailsModal from '@/components/AppointmentDetailsModal';

const STATUSES = [
  'all', 
  'scheduled', 
  'approved', 
  'checked_in', 
  'completed', 
  'cancelled'
];

const STATUS_COLORS = {
  'scheduled': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'approved': 'bg-blue-100 text-blue-800 border-blue-200',
  'checked_in': 'bg-green-100 text-green-800 border-green-200',
  'completed': 'bg-purple-100 text-purple-800 border-purple-200',
  'cancelled': 'bg-red-100 text-red-800 border-red-200'
};

const PAYMENT_STATUS_COLORS = {
  'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'paid': 'bg-green-100 text-green-800 border-green-200',
  'failed': 'bg-red-100 text-red-800 border-red-200'
};

const AdminAppointments = () => {
  const dispatch = useDispatch();
  const { appointments, isLoading } = useSelector(state => state.appointments);
  
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  useEffect(() => {
    dispatch(getAllAppointments());
  }, [dispatch]);
  
  useEffect(() => {
    if (appointments) {
      let filtered = [...appointments];
      
      if (statusFilter !== 'all') {
        filtered = filtered.filter(app => app.status === statusFilter);
      }
      
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
  
  const renderStatistics = () => {
    const statuses = ['scheduled', 'approved', 'checked_in', 'completed', 'cancelled'];
    return statuses.map(status => ({
      label: status.replace('_', ' '),
      count: appointments?.filter(a => a.status === status).length || 0,
      color: STATUS_COLORS[status]
    }));
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center mt-40">
        <RefreshCw className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }
  
  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8 mt-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <TrendingUp className="mr-3 h-8 w-8 text-primary" />
            Manage Appointments
          </h1>
          <p className="text-muted-foreground">
            View and manage all user appointments
          </p>
        </div>
        <Button variant="outline" onClick={() => dispatch(getAllAppointments())} className={"cursor-pointer"}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-3 h-6 w-6 text-primary" />
            Appointment Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {renderStatistics().map(({ label, count, color }) => (
              <div 
                key={label} 
                className={`p-4 rounded-lg border ${color}`}
              >
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm capitalize">{label}</div>
              </div>
            ))}
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-56">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map(status => (
              <SelectItem key={status} value={status} className="capitalize">
                {status.replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <Table>
          <TableCaption>
            Showing {filteredAppointments.length} appointment(s)
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Lab</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.map((appointment) => (
              <TableRow key={appointment._id}>
                <TableCell className={"cursor-pointer"}>{appointment.user?.name || 'Unknown'}</TableCell>
                <TableCell>{appointment.lab?.labName || 'N/A'}</TableCell>
                <TableCell>
                  {format(new Date(appointment.appointmentDate), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${STATUS_COLORS[appointment.status]} capitalize`}>
                    {appointment.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${PAYMENT_STATUS_COLORS[appointment.paymentStatus]} capitalize`}>
                    {appointment.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    className="mr-2 cursor-pointer"
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setModalOpen(true);
                    }}
                  >
                    View Details
                  </Button>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default AdminAppointments;