import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '@/utils/server';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    const appointmentId = searchParams.get('appointmentId');
    
    if (!appointmentId) {
      toast.error('Missing appointment information.');
      navigate('/appointments');
      return;
    }

    // Capture the payment
    const capturePayment = async () => {
      try {
        setIsProcessing(true);
        const response = await api.post('/appointments/capture-payment', { appointmentId });
        
        setAppointment(response.data.appointment);
        toast.success('Payment completed successfully!');
        setIsProcessing(false);
      } catch (error) {
        console.error('Error capturing payment:', error);
        toast.error(error.response?.data?.message || 'Payment capture failed. Please contact support.');
        setIsProcessing(false);
        
        // Redirect to appointments after error
        setTimeout(() => {
          navigate('/appointments');
        }, 3000);
      }
    };

    capturePayment();
  }, [searchParams, navigate]);

  const handleViewAppointments = () => {
    navigate('/appointments');
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        {isProcessing ? (
          <>
            <div className="animate-spin h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-bold mb-2">Processing Payment</h2>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </>
        ) : (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">Your appointment has been confirmed successfully.</p>
            
            {appointment && (
              <div className="bg-gray-50 p-4 rounded-md mb-6 text-left">
                <h3 className="font-medium text-gray-900 mb-2">Appointment Details:</h3>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">ID:</span> {appointment._id}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date:</span> {new Date(appointment.appointmentDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Status:</span> {appointment.status}
                </p>
              </div>
            )}
            
            <Button onClick={handleViewAppointments} className="w-full px-4 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 border border-transparent rounded-md group cursor-pointer">
              View My Appointments
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;