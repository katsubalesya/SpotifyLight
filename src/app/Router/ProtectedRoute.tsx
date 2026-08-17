import { Navigate, Outlet } from "react-router-dom";
import { isUserAuthenticated } from "../../shared/API/SpotifyAuth";

export const ProtectedRoute = () => {
  if (!isUserAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
