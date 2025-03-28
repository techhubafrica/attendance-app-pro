import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import api from "@/utils/server";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const PaymentComponent = ({ appointment }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleApprove = async () => {
    try {
      setIsProcessing(true);
      // Capture the payment using your backend endpoint
      const res = await api.post("/appointments/capture-payment", {
        appointmentId: appointment._id,
        orderId: appointment.paypalOrderId,
      });
      console.log(res);
      toast.success("Payment successful! Your appointment has been confirmed.");

      // Navigate to payment success page after successful payment
      setTimeout(() => {
        navigate(`/payment-success?appointmentId=${appointment._id}`);
      }, 1500);
    } catch (error) {
      console.error("Payment capture error:", error);
      toast.error(
        error.response?.data?.message || "Payment failed. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleError = (err) => {
    console.error("PayPal Error:", err);
    toast.error(
      "There was an error processing your payment. Please try again."
    );
    navigate("/payment-cancel"); // Navigate to PaymentCancel on error
  };

  const handleCancel = () => {
    toast.info("Payment was cancelled. You can try again when ready.");
    navigate("/payment-cancel"); // Navigate to PaymentCancel on cancellation
  };

  if (!appointment || !appointment.paypalOrderId) {
    return (
      <p className="text-red-500">
        Error: Unable to process payment. Please try again later.
      </p>
    );
  }

  return (
    <div className="py-4">
      {isProcessing ? (
        <div className="text-center py-4">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2">Processing your payment...</p>
        </div>
      ) : (
        <PayPalScriptProvider
          options={{
            "client-id": import.meta.env.VITE_PUBLIC_PAYPAL_CLIENT_ID,
            currency: "USD",
          }}
        >
          <PayPalButtons
            style={{
              layout: "vertical",
              color: "blue",
              shape: "rect",
              label: "pay",
            }}
            // Use the existing order ID from backend
            createOrder={() => {
              return Promise.resolve(appointment.paypalOrderId);
            }}
            onApprove={handleApprove}
            onError={handleError}
            onCancel={handleCancel}
            disabled={isProcessing}
          />
        </PayPalScriptProvider>
      )}
    </div>
  );
};

export default PaymentComponent;
