import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/admin/dashboard-stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-4">

        <DashboardCard
          title="Total Orders"
          value={stats.total_orders}
        />

        <DashboardCard
          title="Products"
          value={stats.total_products}
        />

        <DashboardCard
          title="Branding Requests"
          value={stats.branding_orders}
        />

      </div>

      {/* OPTIONAL EXTRA INSIGHT */}
      <div className="grid md:grid-cols-2 gap-4">
        <DashboardCard
          title="Paid Orders"
          value={stats.paid_orders}
        />
        <DashboardCard
          title="Pending Orders"
          value={stats.pending_orders}
        />
      </div>
    </div>
  );
}

function DashboardCard({ title, value }) {
  return (
    <div className="bg-white p-5 rounded shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}
