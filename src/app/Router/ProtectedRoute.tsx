// нужен, если пользователь не авторизован, перенаправит в LoginPage, not HomePage

import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../../shared/API/spotifyAuth";

export const ProtectedRoute = () => {
  const token = getAccessToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
