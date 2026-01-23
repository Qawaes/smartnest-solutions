import { Navigate, useLocation } from "react-router-dom";

export default function HostRouter({ children }) {
  const location = useLocation();

  const host = window.location.hostname;
  const parts = host.split(".");
  const subdomain = parts.length > 2 ? parts[0] : null;

  // Handle admin subdomain default routing
  if (subdomain === "admin") {
    // If user hits root on admin subdomain
    if (location.pathname === "/") {
      return <Navigate to="/admin/login" replace />;
    }
  }

  return children;
}
