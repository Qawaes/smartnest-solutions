import { useEffect, useState } from "react";

const STATUS_OPTIONS = ["pending", "quoted", "approved", "rejected"];

export default function AdminBranding() {
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/admin/branding")
      .then(res => res.json())
      .then(setRequests);
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(
      `http://127.0.0.1:5000/api/admin/branding/${id}/status`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }
    );

    setRequests(prev =>
      prev.map(r =>
        r.id === id ? { ...r, status } : r
      )
    );

    setSelected(prev => ({ ...prev, status }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Branding Requests</h1>

      {/* TABLE */}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Client</th>
            <th className="p-3">Product</th>
            <th className="p-3">Qty</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(r => (
            <tr key={r.id} className="border-b">
              <td className="p-3">
                <p className="font-medium">{r.name}</p>
                <p className="text-sm text-gray-500">{r.phone}</p>
              </td>
              <td className="p-3 capitalize">{r.product_type}</td>
              <td className="p-3 text-center">{r.quantity || "-"}</td>
              <td className="p-3 capitalize">{r.status}</td>
              <td className="p-3">
                <button
                  onClick={() => setSelected(r)}
                  className="text-blue-600"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* DETAILS */}
      {selected && (
        <div className="bg-white p-6 rounded shadow space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Branding Request #{selected.id}
            </h2>
            <button
              onClick={() => setSelected(null)}
              className="text-gray-500"
            >
              Close
            </button>
          </div>

          <div>
            <h3 className="font-medium">Client</h3>
            <p>{selected.name}</p>
            <p>{selected.phone}</p>
            <p>{selected.email}</p>
            <p>{selected.company}</p>
          </div>

          <div>
            <h3 className="font-medium">Branding Details</h3>
            <p><strong>Product:</strong> {selected.product_type}</p>
            <p><strong>Quantity:</strong> {selected.quantity}</p>
            <p><strong>Colors:</strong> {selected.colors}</p>
            <p><strong>Notes:</strong> {selected.notes}</p>
            <p><strong>Deadline:</strong> {selected.deadline}</p>

            {selected.logo && (
              <a
                href={selected.logo}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600"
              >
                View Logo
              </a>
            )}
          </div>

          <div className="flex items-center gap-3">
            <strong>Status:</strong>
            <select
              value={selected.status}
              onChange={(e) =>
                updateStatus(selected.id, e.target.value)
              }
              className="border px-3 py-1 rounded"
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <p className="text-sm text-gray-500">
            Submitted on {selected.created_at}
          </p>
        </div>
      )}
    </div>
  );
}
