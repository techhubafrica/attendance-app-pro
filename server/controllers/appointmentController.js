import Appointment from "../models/appointmentModel.js";
import User from "../models/User.js";
import Faculty from "../models/facultyModel.js";
import Region from "../models/regionModel.js";
import RoboticsLab from "../models/roboticsLabModel.js";
import checkoutNodeJssdk from "@paypal/checkout-server-sdk";

// Function to set up the PayPal environment using client ID and secret
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

// Function to create a PayPal HTTP client
function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

// Create a new appointment
export const createAppointment = async (req, res) => {
  const user = await User.findById(req.user.id);

  // Check if the user role is allowed to create an appointment
  if (!["student", "teacher", "faculty"].includes(user.role)) {
    return res
      .status(403)
      .json({
        message:
          "Only students, teachers, and faculty can schedule appointments",
      });
  }

  try {
    const { faculty, lab, region, appointmentDate, purpose, numVisitors } =
      req.body;

    // Validate input fields
    if (
      !faculty ||
      !lab ||
      !region ||
      !appointmentDate ||
      !purpose ||
      !numVisitors
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate the related documents
    const existingFaculty = await Faculty.findById(faculty);
    if (!existingFaculty)
      return res.status(404).json({ message: "Faculty not found" });

    const existingLab = await RoboticsLab.findById(lab);
    if (!existingLab) return res.status(404).json({ message: "Lab not found" });

    const existingRegion = await Region.findById(region);
    if (!existingRegion)
      return res.status(404).json({ message: "Region not found" });

    // Check for an existing pending or approved appointment for the same user and lab
    const existingAppointment = await Appointment.findOne({
      user: req.user.id,
      lab,
      status: { $in: ["scheduled", "approved"] },
    });
    if (existingAppointment) {
      return res
        .status(400)
        .json({
          message:
            "You have already booked an appointment for this lab, and it is yet to be approved or completed.",
        });
    }

    // Determine the fee based on the region
    let fee;
    if (existingRegion.regionName.toLowerCase() === "local") {
      fee = 100; // Local fee in cedis
    } else {
      fee = 1000; // Out-of-region fee in cedis
    }
    const feeUSD = fee / 5.5; // Assuming 5.5 is the conversion rate from cedis to USD

    // Create and save the new appointment with a pending payment status
    const newAppointment = new Appointment({
      user: req.user.id,
      faculty,
      lab,
      region,
      appointmentDate,
      purpose,
      numVisitors,
      paymentStatus: "pending",
    });
    await newAppointment.save();

    // Update the related region and lab with the new appointment reference
    await Region.findByIdAndUpdate(region, {
      $push: { appointments: newAppointment._id },
    });
    await RoboticsLab.findByIdAndUpdate(lab, {
      $push: { appointments: newAppointment._id },
    });

    // Create a PayPal order request
    const requestBody = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: feeUSD.toFixed(2), // Convert the fee to USD and ensure it has two decimal places
          },
        },
      ],
      application_context: {
        brand_name: "Attendance Application",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${process.env.CLIENT_URL}/payment-success?appointmentId=${newAppointment._id}`, // URL to redirect to after a successful payment
        cancel_url: `${process.env.CLIENT_URL}/payment-cancel`, // URL to redirect to if the payment is cancelled
      },
    };

    // Create PayPal order
    const paypalRequest = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    paypalRequest.prefer("return=representation");
    paypalRequest.requestBody(requestBody);

    let order;
    try {
      // Execute the PayPal order creation request
      order = await client().execute(paypalRequest);
      // Extract the approval URL from the PayPal response
      const approvalUrl = order.result.links.find(
        (link) => link.rel === "approve"
      ).href;
      // Save the PayPal order ID in the appointment document
      newAppointment.paypalOrderId = order.result.id;
      await newAppointment.save();

      // Return the appointment details along with the PayPal approval URL for redirection
      return res.status(201).json({ appointment: newAppointment, approvalUrl });
    } catch (paymentError) {
      // Handle errors during PayPal order creation
      console.error("Error creating PayPal order:", paymentError);
      return res.status(500).json({ message: "Error processing payment" });
    }
  } catch (err) {
    // Handle any other errors
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Approve an appointment (for admin or faculty)
export const approveAppointment = async (req, res) => {
  try {
    const { id: appointmentId } = req.params; // Updated to use 'id'

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if the logged-in user is an admin or faculty
    const user = await User.findById(req.user.id);
    if (!["admin", "faculty"].includes(user.role)) {
      return res.status(403).json({ message: "Only administrators and faculty members can approve appointments." });
    }

    // Check if the appointment is already approved or completed
    if (appointment.status === "approved") {
      return res.status(400).json({ message: "Appointment is already approved." });
    }
    if (appointment.status === "completed") {
      return res.status(400).json({ message: "Appointment is already completed." });
    }

    // Check if the payment status is "paid"
    if (appointment.paymentStatus !== "paid") {
      return res.status(400).json({ message: "Appointment cannot be approved because the payment has not been completed. Please ensure the payment is made before approving the appointment." });
    }

    // Update the appointment status to "approved"
    appointment.status = "approved";
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    console.error("Error approving appointment:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all appointments (for admin or faculty)
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("user", "name email") // Populate user details
      .populate({ path: "faculty", select: "facultyName" }) // Populate faculty details
      .populate("lab", "labName") // Populate lab details
      .populate("region", "regionName capital"); // Populate region details

    if (!appointments) {
      return res.status(404).json({ message: "No appointments found" });
    }
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all appointments for the logged-in user
export const getAllUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id })
      .sort({ appointmentDate: 1 }) // Sort by appointment date
      .populate("faculty", "facultyName") // Populate faculty details
      .populate("lab", "labName") // Populate lab details
      .populate("region", "regionName capital"); // Populate region details

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found" });
    }

    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Get a single appointment
export const getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "User not authorized" });
    }

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Check in for an appointment
export const checkInForAppointments = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "User not authorized" });
    }

    if (
      appointment.status !== "scheduled" &&
      appointment.status !== "approved"
    ) {
      return res
        .status(400)
        .json({ message: "Cannot check in for this appointment" });
    }

    appointment.status = "checked_in";
    appointment.checkInTime = new Date();

    await appointment.save();
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status500.json({ message: "Server Error", error: err.message });
  }
};

// Check out for an appointment
export const checkOutForAppointments = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "User not authorized" });
    }

    if (appointment.status !== "checked_in") {
      return res
        .status(400)
        .json({ message: "Cannot check out from this appointment" });
    }

    appointment.status = "completed";
    appointment.checkOutTime = new Date();

    await appointment.save();
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Capture payment
export const capturePayment = async (req, res) => {
  const { appointmentId } = req.body; // Ensure your client sends the appointment ID (and any PayPal token if needed)
  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    // Create the capture request using the stored PayPal order id
    const captureRequest = new checkoutNodeJssdk.orders.OrdersCaptureRequest(
      appointment.paypalOrderId
    );
    captureRequest.requestBody({});

    const captureResponse = await client().execute(captureRequest);
    if (captureResponse.result.status === "COMPLETED") {
      appointment.paymentStatus = "paid";
      await appointment.save();
      return res.json({ appointment, captureResponse: captureResponse.result });
    } else {
      return res
        .status(400)
        .json({
          message: "Payment not completed",
          details: captureResponse.result,
        });
    }
  } catch (error) {
    console.error("Error capturing payment:", error);
    return res.status(500).json({ message: "Error capturing payment" });
  }
};
