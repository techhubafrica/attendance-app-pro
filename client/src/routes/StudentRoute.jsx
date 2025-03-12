
import {  useAppSelector } from "@/hooks/reduxHooks";
import { Navigate } from "react-router-dom";
const StudentRoute = ({ children }) => {
    const auth = useAppSelector((state) => state.auth);
    const isStudent = auth.user && auth.user.role === 'student';
  
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
  
    return auth.isAuthenticated && isStudent ? <>{children}</> : <Navigate to="/" />;
  };
  export default StudentRoute;