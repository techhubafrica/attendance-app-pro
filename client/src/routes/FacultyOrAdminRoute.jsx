import { useAppSelector } from "@/hooks/reduxHooks";
import { Navigate } from "react-router-dom";

// Faculty or Admin Route component
const FacultyOrAdminRoute = ({ children }) => {
  const auth = useAppSelector((state) => state.auth);
  const isFacultyOrAdmin =
    auth.user && (auth.user.role === "admin" || auth.user.role === "faculty");

  if (auth.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return auth.isAuthenticated && isFacultyOrAdmin ? (
    <>{children}</>
  ) : (
    <Navigate to="/" />
  );
};
export default FacultyOrAdminRoute;
