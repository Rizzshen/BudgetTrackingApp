import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const ProtectedRoute = () => {
  const { user, token, loading, checkAuth } = useAuthStore();

  // Run auth check once on mount if not already done
  useEffect(() => {
    if (loading) {
      checkAuth();
    }
  }, [loading, checkAuth]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-sage-dark font-medium">
        Loading...
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child routes (e.g., AppLayout)
  return <Outlet />;
};

export default ProtectedRoute;
