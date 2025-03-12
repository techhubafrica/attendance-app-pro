import connectDB from "./db/db.js";
import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import regionRoutes from "./routes/regionRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import roboticsLabRoutes from "./routes/roboticsLabRoutes.js";
import hrRoutes from "./routes/hrRoutes.js";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// origin:"http://localhost:5173",

app.use(
  cors({
    origin: ["https://attendance-app-pro-tech-hub-africa-aacfoeox6.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(limiter);

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/regions", regionRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/companies", companyRoutes); // Company routes
app.use("/api/departments", departmentRoutes); // Department routes
app.use("/api/notifications", notificationRoutes); // Notification routes
app.use("/api/robotics-labs", roboticsLabRoutes); // Robotics Lab routes
app.use("/api/faculties", facultyRoutes); // Faculty routes
app.use("/api/hr", hrRoutes); // HR/Manager routes


// Error handling
app.get("/", (req, res) => {
  res.send("api attendance pro app service is running");
});

// Connect to the database and start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });
