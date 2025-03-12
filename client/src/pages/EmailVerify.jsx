import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { Check, Loader2 } from "lucide-react";
import { sendVerifyOtp, verifyEmail } from "@/redux/slices/authSlice";

const EmailVerify = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [otp, setOtp] = useState(""); // State for OTP input
  const [error, setError] = useState(""); // State for error messages
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleSendOtp = async () => {
    setSendingOtp(true);
    try {
      await dispatch(sendVerifyOtp()).unwrap();
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate OTP
    if (!otp) {
      setError("Verification code is required");
      return;
    }
    if (!/^[0-9]{6}$/.test(otp)) {
      setError("Verification code must be 6 digits");
      return;
    }

    setIsLoading(true);
    setError(""); // Clear previous errors
    try {
      await dispatch(verifyEmail(otp)).unwrap();
      setIsSuccess(true);
      navigate("/verify-email");
    } catch (err) {
      setError(err.message || "Email verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user && user.isAccountVerified) {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  // If the user is already verified, show success state
  if (user?.isAccountVerified || isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-32">
        <div className="w-full max-w-md animate-in">
          <Card className="glass">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">
                Email Verified
              </CardTitle>
              <CardDescription className="text-center">
                Your email has been successfully verified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p>You can now access all features of the application.</p>
              <Button
                className="w-full text-sm font-medium text-white bg-green-700 hover:bg-green-800"
                asChild
              >
                <Link to="/">Go to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-32">
      <div className="w-full max-w-md animate-in">
        <Card className="glass">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Verify Email
            </CardTitle>
            <CardDescription className="text-center">
              Enter the verification code sent to your email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleSendOtp}
                    disabled={sendingOtp}
                    className="p-0 h-auto text-sm cursor-pointer"
                  >
                    {sendingOtp ? "Sending..." : "Send Code"}
                  </Button>
                </div>
                <Input
                  id="otp"
                  placeholder="Enter the 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="bg-white/50 text-center text-lg tracking-wide"
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
              <Button
                type="submit"
                className="w-full text-sm cursor-pointer font-medium text-white bg-green-700 hover:bg-green-800"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  "Verify Email"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm">
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerify;