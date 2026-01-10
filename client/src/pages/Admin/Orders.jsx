import { useEffect, useState } from "react";
import { fetchOrders, updateOrderStatus } from "../../services/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const statusOptions = [
    "pending",
    "confirmed",
    "dispatched",
    "delivered",
    "cancelled",
  ];

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch(() => setError("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);

      setOrders(prev =>
        prev.map(o =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );

      setSelected(prev =>
        prev ? { ...prev, status: newStatus } : null
      );
    } catch {
      alert("Failed to update order status");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading orders...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Orders</h1>

      {/* ORDERS TABLE */}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Order #</th>
            <th className="p-3 text-left">Customer</th>
            <th className="p-3">Total</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(o => (
            <tr key={o.id} className="border-b hover:bg-gray-50">
              <td className="p-3">#{o.id}</td>
              <td className="p-3">{o.customer.name}</td>
              <td className="p-3">KES {o.total}</td>
              <td className="p-3 capitalize">{o.status}</td>
              <td className="p-3">
                <button
                  onClick={() => setSelected(o)}
                  className="text-blue-600 hover:underline"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ORDER DETAILS */}
      {selected && (
        <div className="bg-white p-6 rounded shadow space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Order #{selected.id}
            </h2>
            <button
              onClick={() => setSelected(null)}
              className="text-sm text-gray-500"
            >
              Close
            </button>
          </div>

          <div>
            <h3 className="font-medium">Customer</h3>
            <p>{selected.customer.name}</p>
            <p>{selected.customer.phone}</p>
            <p>{selected.customer.email}</p>
            <p>{selected.customer.address}</p>
          </div>

          <div>
            <h3 className="font-medium">Items</h3>
            <ul className="list-disc ml-5">
              {selected.items.map((i, idx) => (
                <li key={idx}>
                  {i.name} × {i.qty} — KES {i.price}
                </li>
              ))}
            </ul>
          </div>

          {selected.branding && (
            <div>
              <h3 className="font-medium">Branding</h3>
              <p>Colors: {selected.branding.colors}</p>
              <p>Notes: {selected.branding.notes}</p>
              <p>Logo: {selected.branding.logo}</p>
              <p>Deadline: {selected.branding.deadline}</p>
            </div>
          )}

          <div className="border-t pt-4 space-y-2">
            <p><strong>Total:</strong> KES {selected.total}</p>
            <p><strong>Payment:</strong> {selected.payment_method || "—"}</p>

            <div className="flex items-center gap-2">
              <strong>Status:</strong>
              <select
                value={selected.status}
                onChange={e =>
                  handleStatusChange(selected.id, e.target.value)
                }
                className="border px-3 py-1 rounded"
              >
                {statusOptions.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-sm text-gray-500">
              Placed on {selected.created_at}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
