import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  User, 
  Building2, 
  ClipboardList, 
  Users, 
  CreditCard, 
  MapPin,
  CheckCircle,
  X,
  Clock,
  Info
} from 'lucide-react';
import { format } from 'date-fns';

const AppointmentDetailsModal = ({ appointment, isOpen, onClose }) => {
  if (!appointment) return null;

  // Comprehensive status and color mapping
  const getAppointmentStatusDetails = (status) => {
    const statusDetails = {
      'scheduled': { 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        icon: Info 
      },
      'approved': { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: CheckCircle 
      },
      'checked_in': { 
        color: 'bg-teal-100 text-teal-800 border-teal-200', 
        icon: Calendar 
      },
      'completed': { 
        color: 'bg-cyan-100 text-cyan-800 border-cyan-200', 
        icon: CheckCircle 
      },
      'cancelled': { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: X 
      }
    };
    return statusDetails[status] || { 
      color: 'bg-gray-100 text-gray-800 border-gray-200', 
      icon: Info 
    };
  };

  // Payment status color and icon mapping
  const getPaymentStatusDetails = (status) => {
    const paymentDetails = {
      'pending': { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        icon: Clock 
      },
      'paid': { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: CheckCircle 
      },
      'failed': { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: X 
      }
    };
    return paymentDetails[status] || { 
      color: 'bg-gray-100 text-gray-800 border-gray-200', 
      icon: Info 
    };
  };

  const appointmentStatus = getAppointmentStatusDetails(appointment.status);
  const paymentStatus = getPaymentStatusDetails(appointment.paymentStatus);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white shadow-2xl rounded-xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center text-xl font-bold text-primary">
            <Building2 className="mr-3 h-6 w-6 text-blue-600" />
            Appointment Details
          </DialogTitle>
          <DialogDescription className="flex items-center text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4 text-green-600" />
            {format(new Date(appointment.appointmentDate), 'PPP p')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {/* User Information */}
          <div className="flex items-center bg-gray-50 p-3 rounded-lg">
            <User className="mr-3 h-6 w-6 text-blue-600" />
            <div>
              <p className="font-semibold text-gray-800">{appointment.user?.name || 'Unknown User'}</p>
              <p className="text-sm text-gray-600">
                Faculty: {appointment.faculty?.facultyName || 'No Faculty Assigned'}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center bg-gray-50 p-3 rounded-lg">
            <MapPin className="mr-3 h-6 w-6 text-green-600" />
            <p className="font-medium text-gray-800">{appointment.lab?.labName || 'Unspecified Lab'}</p>
          </div>

          {/* Purpose */}
          <div className="flex items-center bg-gray-50 p-3 rounded-lg">
            <ClipboardList className="mr-3 h-6 w-6 text-purple-600" />
            <p className="text-gray-800">{appointment.purpose}</p>
          </div>

          {/* Visitors */}
          <div className="flex items-center bg-gray-50 p-3 rounded-lg">
            <Users className="mr-3 h-6 w-6 text-teal-600" />
            <p className="text-gray-800">Number of Visitors: {appointment.numVisitors}</p>
          </div>

          {/* Payment Details */}
          <div className="flex items-center bg-gray-50 p-3 rounded-lg">
            <CreditCard className="mr-3 h-6 w-6 text-indigo-600" />
            <div>
              <div className="flex items-center">
                <p className="mr-2 font-medium text-gray-800">Payment Status:</p>
                <Badge 
                  className={`${paymentStatus.color} flex items-center`}
                >
                  <paymentStatus.icon className="mr-1 h-3 w-3" />
                  {appointment.paymentStatus}
                </Badge>
              </div>
              {appointment.paypalOrderId && (
                <p className="text-xs text-gray-600 mt-1">
                  Order ID: {appointment.paypalOrderId}
                </p>
              )}
            </div>
          </div>

          {/* Appointment Status */}
          <div className="flex items-center bg-gray-50 p-3 rounded-lg">
            <Badge 
              className={`${appointmentStatus.color} flex items-center text-sm`}
            >
              <appointmentStatus.icon className="mr-1 h-4 w-4" />
              {appointment.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2 border-t pt-4">
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetailsModal;