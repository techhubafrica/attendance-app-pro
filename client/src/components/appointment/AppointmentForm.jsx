import React, { useEffect, useState } from "react";
import { createAppointment } from "@/redux/actions/appointmentActions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format, isBefore, startOfDay } from "date-fns";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegions } from "@/redux/actions/regionActions";
import { fetchRoboticsLabs } from "@/redux/actions/roboticsLabActions";
import { fetchFaculties } from "@/redux/actions/facultyActions";
import PaymentComponent from "../PaymentComponent";
import { useNavigate } from "react-router-dom";

const AppointmentForm = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.appointments);
  const { regions } = useSelector((state) => state.regions);
  const { labs } = useSelector((state) => state.roboticsLabs);
  const { faculties } = useSelector((state) => state.faculties);

  const [pendingPayment, setPendingPayment] = useState(null);
  const [paymentStep, setPaymentStep] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState("");
  const [dateError, setDateError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchRegions());
    dispatch(fetchRoboticsLabs());
    dispatch(fetchFaculties());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    faculty: "",
    lab: "",
    region: "",
    appointmentDate: new Date(),
    purpose: "",
    numVisitors: 1,
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const [appointmentTime, setAppointmentTime] = useState("09:00");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when selection is made
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDateSelect = (date) => {
    const today = startOfDay(new Date());
    if (isBefore(date, today)) {
      setDateError("Appointment date cannot be in the past");
      return;
    }

    setDateError("");
    setFormData((prev) => ({
      ...prev,
      appointmentDate: date,
    }));
    setShowCalendar(false);
  };

  const handleTimeChange = (e) => {
    setAppointmentTime(e.target.value);
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.faculty) {
      errors.faculty = "Faculty is required";
      isValid = false;
    }

    if (!formData.lab) {
      errors.lab = "Lab is required";
      isValid = false;
    }

    if (!formData.region) {
      errors.region = "Region is required";
      isValid = false;
    }

    if (!formData.purpose || formData.purpose.length < 10) {
      errors.purpose = "Purpose must be at least 10 characters";
      isValid = false;
    }

    if (formData.numVisitors < 1 || formData.numVisitors > 20) {
      errors.numVisitors = "Number of visitors must be between 1 and 20";
      isValid = false;
    }

    const today = startOfDay(new Date());
    if (isBefore(formData.appointmentDate, today)) {
      setDateError("Appointment date cannot be in the past");
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Combine date and time
    const dateObj = new Date(formData.appointmentDate);
    const [hours, minutes] = appointmentTime.split(":");
    dateObj.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    const appointmentData = {
      ...formData,
      appointmentDate: dateObj.toISOString(),
    };

    try {
      const response = await dispatch(createAppointment(appointmentData));

      if (response?.error) {
        toast.error(response.error.message || "Failed to book appointment");
        return;
      }

      // Check if payment is required
      if (response?.appointment && response?.approvalUrl) {
        setPendingPayment(response.appointment);
        setApprovalUrl(response.approvalUrl);
        setPaymentStep(true);
        toast.info("Please complete your payment to confirm your appointment.");
      } else if (response?.appointment) {
        toast.success("Appointment booked successfully");
        resetForm();
        navigate("/appointments");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to book appointment. Please try again."
      );
    }
  };

  const resetForm = () => {
    setFormData({
      faculty: "",
      lab: "",
      region: "",
      appointmentDate: new Date(),
      purpose: "",
      numVisitors: 1,
    });
    setAppointmentTime("09:00");
    setPendingPayment(null);
    setPaymentStep(false);
    setApprovalUrl("");
    setFormErrors({});
    setDateError("");
  };

  const handleDirectPayPalRedirect = () => {
    if (approvalUrl) {
      window.location.href = approvalUrl;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-md border p-6">
        <h2 className="text-xl font-bold mb-6">
          {paymentStep ? "Complete Payment" : "Book a New Appointment"}
        </h2>

        {paymentStep ? (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
              <h3 className="font-medium text-blue-800 mb-2">
                Payment Required
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                Your appointment has been created. Please complete the payment
                to confirm your booking.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Appointment ID:</p>
                  <p className="font-medium">
                    {pendingPayment?._id?.substring(0, 10)}...
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Payment Status:</p>
                  <p className="font-medium text-amber-600">Pending</p>
                </div>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-3">Choose Payment Method</h4>

              <PaymentComponent appointment={pendingPayment} />

              <div className="text-center mt-4">
                <p className="text-sm text-gray-500 mb-2">
                  Or continue directly to PayPal
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDirectPayPalRedirect}
                  className="text-blue-600 border-blue-200"
                >
                  Proceed to PayPal Checkout
                </Button>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={resetForm}
                className="text-gray-500"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="faculty">Faculty *</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("faculty", value)
                  }
                  value={formData.faculty}
                >
                  <SelectTrigger
                    className={formErrors.faculty ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select Faculty" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {faculties?.map((faculty) => (
                      <SelectItem key={faculty._id} value={faculty._id}>
                        {faculty.facultyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.faculty && (
                  <p className="text-sm text-red-500">{formErrors.faculty}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lab">Robotics Lab *</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("lab", value)}
                  value={formData.lab}
                >
                  <SelectTrigger
                    className={formErrors.lab ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select Lab" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {labs?.map((lab) => (
                      <SelectItem key={lab._id} value={lab._id}>
                        {lab.labName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.lab && (
                  <p className="text-sm text-red-500">{formErrors.lab}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region *</Label>
              <Select
                onValueChange={(value) => handleSelectChange("region", value)}
                value={formData.region}
              >
                <SelectTrigger
                  className={formErrors.region ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {regions?.map((region) => (
                    <SelectItem key={region._id} value={region._id}>
                      {region.regionName}, {region.capital}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.region && (
                <p className="text-sm text-red-500">{formErrors.region}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appointmentDate">Appointment Date *</Label>
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      dateError ? "border-red-500" : ""
                    }`}
                    onClick={() => setShowCalendar(!showCalendar)}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.appointmentDate
                      ? format(formData.appointmentDate, "PPP")
                      : "Pick a date"}
                  </Button>
                  {showCalendar && (
                    <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg">
                      <Calendar
                        mode="single"
                        selected={formData.appointmentDate}
                        onSelect={handleDateSelect}
                        initialFocus
                        disabled={(date) =>
                          isBefore(date, startOfDay(new Date()))
                        }
                      />
                    </div>
                  )}
                </div>
                {dateError && (
                  <p className="text-sm text-red-500">{dateError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointmentTime">Appointment Time *</Label>
                <Input
                  type="time"
                  id="appointmentTime"
                  name="appointmentTime"
                  value={appointmentTime}
                  onChange={handleTimeChange}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose of Visit *</Label>
              <Textarea
                id="purpose"
                name="purpose"
                placeholder="Please describe the purpose of your visit (minimum 10 characters)"
                value={formData.purpose}
                onChange={handleChange}
                className={`min-h-[100px] ${
                  formErrors.purpose ? "border-red-500" : ""
                }`}
              />
              {formErrors.purpose && (
                <p className="text-sm text-red-500">{formErrors.purpose}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="numVisitors">Number of Visitors *</Label>
              <Input
                type="number"
                id="numVisitors"
                name="numVisitors"
                value={formData.numVisitors}
                onChange={handleChange}
                min="1"
                max="20"
                className={formErrors.numVisitors ? "border-red-500" : ""}
              />
              {formErrors.numVisitors && (
                <p className="text-sm text-red-500">{formErrors.numVisitors}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-6 text-sm font-medium text-white bg-green-700 hover:bg-green-800 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                "Book Appointment"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AppointmentForm;
