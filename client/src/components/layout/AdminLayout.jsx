import { Outlet } from "react-router-dom";
import AdminSidebar from "../admin/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
