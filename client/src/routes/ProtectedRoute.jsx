import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { getUserProfile } from "@/redux/slices/authSlice";
import { useEffect } from "react";  
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!auth.isAuthenticated && !auth.isLoading) {
      dispatch(getUserProfile());
    }
  }, [dispatch, auth.isAuthenticated, auth.isLoading]);

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

  return auth.isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;  
