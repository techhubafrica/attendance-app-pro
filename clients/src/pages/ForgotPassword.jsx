import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { sendResetOtp } from "@/redux/slices/authSlice";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail } from "lucide-react";

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false); // State to track form submission status
  const [isLoading, setIsLoading] = useState(false); // State to track loading state
  const [submittedEmail, setSubmittedEmail] = useState(""); // State to store submitted email
  const dispatch = useAppDispatch(); // Redux dispatch hook

  const {
    register,
    handleSubmit,
    formState: { errors }, // Form validation errors
  } = useForm(); // Hook for form handling

  const onSubmit = async (data) => {
    setIsLoading(true); // Set loading state to true
    try {
      await dispatch(sendResetOtp(data.email)).unwrap(); // Dispatch OTP reset action
      setSubmittedEmail(data.email); // Store submitted email
      setIsSubmitted(true); // Mark form as submitted
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-32">
      {/* Container for the card */}
      <div className="w-full max-w-md animate-in">
        {/* Card component */}
        <Card className="glass">
          {/* Card Header */}
          <CardHeader className="space-y-1 pt-8">
            <div className="mb-2 flex justify-center">
              <div className={`p-3 rounded-full ${isSubmitted ? 'bg-green-100' : 'bg-blue-100'}`}>
                {isSubmitted ? (
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                ) : (
                  <Mail className="h-8 w-8 text-blue-600" />
                )}
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              {isSubmitted ? "Check Your Email" : "Forgot Password"}
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {isSubmitted
                ? "We've sent a password reset OTP to your email"
                : "Enter your email and we'll send you a reset link"}
            </CardDescription>
          </CardHeader>

          {/* Card Content */}
          <CardContent className="px-6 py-4">
            {isSubmitted ? (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-lg text-center">
                  <p className="text-sm">
                    An OTP has been sent to <strong>{submittedEmail}</strong>. 
                    Please check your inbox and follow the instructions.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    className="w-full text-sm font-medium text-white bg-green-700 hover:bg-green-800 border cursor-pointer"
                    asChild
                  >
                    <Link to="/reset-password" className="flex items-center justify-center">
                      Continue to Reset Password
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setIsSubmitted(false)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Use a different email
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email input field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    {...register("email", {
                      required: "Email is required", // Validation rule
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, // Regex for email validation
                        message: "Invalid email address",
                      },
                    })}
                    className="bg-white/50"
                  />
                  {/* Error message for invalid email */}
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                {/* Submit button */}
                <Button
                  type="submit"
                  className="w-full text-sm font-medium text-white bg-green-700 hover:bg-green-800 border cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      {/* Spinner for loading state */}
                      <div className="h-5 w-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    "Send Reset OTP"
                  )}
                </Button>
              </form>
            )}
          </CardContent>

          {/* Card Footer */}
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm">
              Remember your password?{" "}
              <Link
                to="/login"
                className="hover:underline font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;




