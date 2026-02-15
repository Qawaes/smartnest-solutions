import { Navigate, useLocation } from "react-router-dom";

export default function HostRouter({ children }) {
  const location = useLocation();

  const host = window.location.hostname;
  
  const isAdminSubdomain = host.startsWith("admin.");
  
  const isAdminPath = location.pathname.startsWith("/admin");

  // If on admin subdomain
  if (isAdminSubdomain) {
    // If user hits root on admin subdomain, redirect to /admin/login
    if (location.pathname === "/") {
      return <Navigate to="/admin/login" replace />;
    }
    
    // Ensure admin routes start with /admin
    if (!isAdminPath) {
      return <Navigate to={`/admin${location.pathname}`} replace />;
    }
  }

  // ✅ ALLOW /admin paths on main domain (removed the blocking code)
  // This allows accessing admin at: smartnest-solutions.vercel.app/admin/login

  return children;
}