import { useState, useEffect } from "react";
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
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { resetPassword, sendResetOtp } from "@/redux/slices/authSlice";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const [sendResetOtp1, setSendResetOtp1] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const dispatch = useAppDispatch();
  // const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (user?.email) {
      setValue("email", user.email);
    }
  }, [user, setValue]);

  const password = watch("newPassword");

  const handleSendResetOtp = async (data) => {
    setSendResetOtp1(true);
    try {
      await dispatch(sendResetOtp(user?.email || data.email)).unwrap();
    } finally {
      setSendResetOtp1(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await dispatch(
        resetPassword({
          email: data.email || user?.email,
          otp: data.otp,
          newPassword: data.newPassword,
        })
      ).unwrap();
      setIsSuccess(true);
      // setTimeout(() => {
      //   navigate("/login");
      // }, 3000);
    } catch (error) {
      console.error("Error resetting password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-32">
      <div className="w-full max-w-md animate-in">
        <Card className="glass">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isSuccess ? "Password Reset Successful" : "Reset Your Password"}
            </CardTitle>
            <CardDescription className="text-center">
              {isSuccess
                ? "Your password has been reset successfully"
                : "Enter your OTP and new password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="space-y-4 text-center">
                <div className="bg-green-50 text-green-800 p-4 rounded-md">
                  <p>
                    Your password has been reset successfully. You'll be
                    redirected to your profile page.
                  </p>
                </div>
                <Button className="w-full" asChild>
                  <Link to="/profile">Go to Profile</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      className="bg-white/50 pl-10"
                      readOnly={!!user?.email}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <Mail className="h-5 w-5" />
                    </div>
                  </div>
                  {user?.email && (
                    <p className="text-xs text-blue-600">
                      Using email from your account
                    </p>
                  )}
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="otp">Verification Code</Label>
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleSendResetOtp}
                      disabled={sendResetOtp1}
                      className="p-0 h-auto text-sm cursor-pointer"
                    >
                      {sendResetOtp1
                        ? "Sending..."
                        : sendResetOtp1
                        ? "Resend Code"
                        : "Send Code"}
                    </Button>
                  </div>
                  <Label htmlFor="otp">OTP Code</Label>
                  <Input
                    id="otp"
                    placeholder="Enter the 6-digit OTP"
                    {...register("otp", {
                      required: "OTP is required",
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "OTP must be 6 digits",
                      },
                    })}
                    className="bg-white/50"
                  />
                  {errors.otp && (
                    <p className="text-sm text-red-500">{errors.otp.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("newPassword", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      className="bg-white/50 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-sm text-red-500">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    className="bg-white/50"
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full text-sm font-medium text-white bg-green-700 hover:bg-green-800"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" />
                      Resetting Password...
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
