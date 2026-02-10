import { Navigate, useLocation } from "react-router-dom";

export default function HostRouter({ children }) {
  const location = useLocation();

  const host = window.location.hostname;
  const parts = host.split(".");
  const subdomain = parts.length > 2 ? parts[0] : null;

  const isAdminPath = location.pathname.startsWith("/admin");

  // If someone hits /admin on the main domain, send them to admin subdomain
  if (isAdminPath && subdomain !== "admin") {
    const target = `${window.location.protocol}//admin.${parts.slice(-2).join(".")}${location.pathname}${window.location.search}${window.location.hash}`;
    window.location.replace(target);
    return null;
  }

  // Handle admin subdomain default routing
  if (subdomain === "admin") {
    // If user hits root on admin subdomain
    if (location.pathname === "/") {
      return <Navigate to="/admin/login" replace />;
    }
  }

  return children;
}
