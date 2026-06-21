import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAuth } from "@/lib/authCookies";

export default function UserProtectedRoute() {
  const auth = getAuth();
  const location = useLocation();

  if (!auth?.token) {
    sessionStorage.setItem(
      "redirectAfterAuth",
      location.pathname +
      location.search
    );
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (auth.role === "admin") {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  return <Outlet />;
}