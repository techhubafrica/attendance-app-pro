import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks/reduxHooks";
import { getUserProfile } from "./redux/slices/authSlice";

// Layout
import Layout from "./components/layout/Layout";

// Authentication
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";

// Pages
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Attendance from "./pages/Attendance";
import UserBooks from "./pages/UserBooks";
import UserBooksView from "./pages/UserBooksView";
import BookDetailsPage from "./components/BookDetailsPage";
import Appointments from "./pages/Appointments";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import AdminAttendance from "./pages/admin/AdminAttendance";
import Employees from "./pages/admin/Employees";
import Companies from "./pages/admin/Companies";
import Departments from "./pages/admin/Departments";
import Regions from "./pages/admin/Regions";
import Books from "./pages/admin/Books";
import BookLoans from "./pages/admin/BookLoans";
import AdminAppointments from "./pages/admin/AdminAppointments";
import RoboticsLabs from "./pages/admin/RoboticsLabs";
import Faculties from "./pages/admin/Faculties";

// Dashboards
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import FacultyDashboard from "./pages/dashboards/FacultyDashboard";
import EmployeeDashboard from "./pages/dashboards/EmployeeDashboard";

// Routes
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminProtectedRoute from "./routes/AdminRoute";
import FacultyOrAdminRoute from "./routes/FacultyOrAdminRoute";
import EmployeeProtectedRoute from "./routes/EmployeeProtectedRoute";
import StudentRoute from "./routes/StudentRoute";

// Components
import DepartmentAttendance from "./components/hr/DepartmentAttendance";
import NotificationList from "./components/notifications/NotificationList";

// Other Pages
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import FAQ from "./pages/FAQ";
import CompaniesPage from "./pages/CompaniesPage";
import EmployeeProfilePage from "./pages/EmployeeProfilePage";
import CompanyDetailsPage from "./pages/CompanyDetailsPage";
import ScrollToTop from "./components/scrollToTop";

const App = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (auth.token) {
      dispatch(getUserProfile());
    }
  }, [dispatch, auth.token]);

  return (
    <>
    <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/companies" element={<CompaniesPage/>} />
          <Route path="/employee/:employeeId" element={<EmployeeProfilePage/>} />
          <Route path="/companies/:companyId" element={<CompanyDetailsPage/>} />
          <Route
            path="notifications"
            element={
              <ProtectedRoute>
                <NotificationList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify-email"
            element={
              <ProtectedRoute>
                <EmailVerify />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-books"
            element={
              <ProtectedRoute>
                <UserBooks />
              </ProtectedRoute>
            }
          />

          <Route
            path="appointments"
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            }
          />

          <Route path="books" element={<UserBooksView />} />
          <Route path="books/:id" element={<BookDetailsPage />} />
          <Route
            path="employee-attendance"
            element={
              <EmployeeProtectedRoute>
                <Attendance />
              </EmployeeProtectedRoute>
            }
          />
          <Route
            path="/book-loans"
            element={
              <FacultyOrAdminRoute>
                <BookLoans />
              </FacultyOrAdminRoute>
            }
          />
          <Route
            path="faculty/department-attendance"
            element={
              <FacultyOrAdminRoute>
                <DepartmentAttendance />
              </FacultyOrAdminRoute>
            }
          />
          <Route
            path="admin/appointments"
            element={
              <FacultyOrAdminRoute>
                <AdminAppointments />
              </FacultyOrAdminRoute>
            }
          />
          <Route
            path="admin/attendance"
            element={
              <AdminProtectedRoute>
                <AdminAttendance />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="employees"
            element={
              <ProtectedRoute>
                <Employees />
              </ProtectedRoute>
            }
          />

          <Route
            path="admin/robotics-labs"
            element={
              <AdminProtectedRoute>
                <RoboticsLabs />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="admin/faculties"
            element={
              <AdminProtectedRoute>
                <Faculties />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="admin/companies"
            element={
              <AdminProtectedRoute>
                <Companies />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="admin/departments"
            element={
              <AdminProtectedRoute>
                <Departments />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="admin/regions"
            element={
              <AdminProtectedRoute>
                <Regions />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="admin/books"
            element={
              <AdminProtectedRoute>
                <Books />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="employee/dashboard"
            element={
              <EmployeeProtectedRoute>
                <EmployeeDashboard />
              </EmployeeProtectedRoute>
            }
          />
          <Route
            path="faculty/dashboard"
            element={
              <FacultyOrAdminRoute>
                <FacultyDashboard />
              </FacultyOrAdminRoute>
            }
          />
          <Route
            path="student/dashboard"
            element={
              <StudentRoute>
                <StudentDashboard />
              </StudentRoute>
            }
          />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-of-service" element={<TermsOfService />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
