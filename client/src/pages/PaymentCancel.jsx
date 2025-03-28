import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentCancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error("Payment was cancelled");
  }, []);

  const handleTryAgain = () => {
    navigate("/appointments");
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Payment Cancelled</h2>
        <p className="text-gray-600 mb-6">
          Your payment process was cancelled. Your appointment will remain
          pending until payment is completed.
        </p>
        <Button onClick={handleTryAgain} className="w-full cursor-pointer">
          Try Again
        </Button>
        <p className="mt-4 text-sm text-gray-500">
          If you continue to experience issues, please contact our support team.
        </p>
      </div>
    </div>
  );
};

export default PaymentCancel;
