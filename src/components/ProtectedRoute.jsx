import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useStore } from "../store";

export default function ProtectedRoute() {
  const isLoggedIn = useStore((s) => s.isLoggedIn);
  const user = useStore((s) => s.user);

  const location = useLocation();

  // Not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Wait until user data is available
  if (!user) {
    return null;
  }

  // Force password change
  if (
    user.mustChangePassword === true &&
    location.pathname !== "/change-password"
  ) {
    return <Navigate to="/change-password" replace />;
  }

  return <Outlet />;
}