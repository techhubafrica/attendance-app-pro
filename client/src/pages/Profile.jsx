import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector, useAppDispatch } from "@/hooks/reduxHooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Loader2, Camera, Lock, Mail } from "lucide-react";
import { updateUserProfile } from "@/redux/slices/authSlice";

const Profile = () => {
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user ? user.name : "",
      phone: user ? user.phone : "",
      address: user ? user.address : "",
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", data.phone || "");
    formData.append("address", data.address || "");

    if (selectedImage) {
      formData.append("avatar", selectedImage);
    }

    dispatch(updateUserProfile(formData));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user || !user.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-b from-blue-50 to-green-50">
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8 mt-20">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-blue-800">My Profile</h1>
          <p className="text-green-700 mt-2">Manage your personal information and account settings</p>
        </div>

        <Tabs defaultValue="profile" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/70 p-1 shadow-md rounded-xl">
            <TabsTrigger 
              value="profile" 
              className="cursor-pointer data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2"
            >
              Profile Information
            </TabsTrigger>
            <TabsTrigger 
              value="account" 
              className="cursor-pointer data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-lg py-2"
            >
              Account Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="animate-in shadow-xl">
            <Card className="border-blue-200 bg-white/90 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 border-b border-blue-100">
                <CardTitle className="text-blue-800">Profile Information</CardTitle>
                <CardDescription className="text-blue-600">
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="flex flex-col items-center space-y-4 mb-6">
                    <div className="relative">
                      <Avatar
                        className="h-28 w-28 ring-4 ring-blue-200 cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
                        onClick={triggerFileInput}
                      >
                        <AvatarImage src={previewUrl || user?.avatar} className={"object-cover"}/>
                        <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-600 to-green-600 text-white font-bold">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div 
                        className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-700"
                        onClick={triggerFileInput}
                      >
                        <Camera size={18} />
                      </div>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                    {previewUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                        onClick={() => {
                          setSelectedImage(null);
                          setPreviewUrl(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                      >
                        Remove Selected Image
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-blue-800 font-medium">Full Name</Label>
                      <Input
                      
                        id="name"
                        {...register("name", {
                          required: "Name is required",
                        })}
                        className="bg-white border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-blue-800 font-medium">Email</Label>
                      <Input
                        id="email"
                        value={user ? user.email : ""}
                        readOnly
                        className="bg-gray-100 border-gray-200 text-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-blue-800 font-medium">Phone Number</Label>
                      <Input
                        id="phone"
                        {...register("phone")}
                        className="bg-white border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-blue-800 font-medium">Address</Label>
                      <Input
                        id="address"
                        {...register("address")}
                        className="bg-white border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-6 py-2 rounded-lg shadow-md cursor-pointer"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" />
                          Saving...
                        </div>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="animate-in shadow-xl">
            <Card className="border-green-200 bg-white/90 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-100 to-green-50 border-b border-green-100">
                <CardTitle className="text-green-800">Account Settings</CardTitle>
                <CardDescription className="text-green-600">
                  Manage your account verification and security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-blue-800">Email Verification</h3>
                        <p className="text-sm text-blue-600">
                          Verify your email address for account security
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {user && user.isAccountVerified ? (
                        <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium shadow-sm">
                          ✓ Verified
                        </span>
                      ) : (
                        <Button 
                          asChild
                          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                        >
                          <Link to="/verify-email">Verify Now</Link>
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Lock className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-green-800">Password Security</h3>
                        <p className="text-sm text-green-600">
                          Change your password regularly for better security
                        </p>
                      </div>
                    </div>
                    <div>
                      <Button 
                        asChild
                        className="bg-green-600 hover:bg-green-700 text-white shadow-md"
                      >
                        <Link to="/reset-password">Change Password</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;