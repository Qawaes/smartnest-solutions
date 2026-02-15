import { Navigate, useLocation } from "react-router-dom";

export default function HostRouter({ children }) {
  const location = useLocation();

  const host = window.location.hostname;
  
  const isAdminSubdomain = host.startsWith("admin.");
  
  const isAdminPath = location.pathname.startsWith("/admin");

 
  if (isAdminPath && !isAdminSubdomain) {
   
    const adminHost = host.includes("localhost") 
      ? "admin.localhost:5173" 
      : `admin.${host.replace(/^(www\.)?/, "")}`;
    
    const target = `${window.location.protocol}//${adminHost}${location.pathname}${window.location.search}${window.location.hash}`;
    window.location.replace(target);
    return null;
  }

  if (isAdminSubdomain) {
   
    if (location.pathname === "/") {
      return <Navigate to="/admin/login" replace />;
    }
    
    
    if (!isAdminPath) {
      return <Navigate to={`/admin${location.pathname}`} replace />;
    }
  } else {
    // On main domain, block direct /admin access (already handled above)
    // This is a safety net
    if (isAdminPath) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}