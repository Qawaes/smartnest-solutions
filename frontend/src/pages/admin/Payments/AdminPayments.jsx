import { useEffect, useState } from "react";
import { DollarSign, CreditCard, AlertCircle, CheckCircle, Clock, TrendingUp, Filter } from "lucide-react";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, paid, pending, failed

  const API_BASE_URL = "http://127.0.0.1:5000";
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/payments`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to load payments");
      }

      const data = await res.json();
      setPayments(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/payments/stats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const filteredPayments = payments.filter(p => {
    if (filter === "all") return true;
    return p.status.toLowerCase() === filter;
  });

  const getStatusBadge = (status) => {
    const styles = {
      PAID: "bg-green-100 text-green-800 border-green-300",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
      FAILED: "bg-red-100 text-red-800 border-red-300",
      CANCELLED: "bg-gray-100 text-gray-800 border-gray-300"
    };

    const icons = {
      PAID: <CheckCircle className="w-4 h-4" />,
      PENDING: <Clock className="w-4 h-4" />,
      FAILED: <AlertCircle className="w-4 h-4" />,
      CANCELLED: <AlertCircle className="w-4 h-4" />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.PENDING}`}>
        {icons[status]}
        {status}
      </span>
    );
  };

  const getMethodBadge = (method) => {
    const styles = {
      mpesa: "bg-green-50 text-green-700 border-green-200",
      cod: "bg-blue-50 text-blue-700 border-blue-200",
      card: "bg-purple-50 text-purple-700 border-purple-200"
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium border uppercase ${styles[method] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
        {method}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <AlertCircle className="inline w-5 h-5 mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Ledger</h1>
          <p className="text-gray-600 mt-1">Track and manage all payment transactions</p>
        </div>
        <button
          onClick={() => { fetchPayments(); fetchStats(); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Total Revenue</p>
                <h3 className="text-2xl font-bold text-green-900 mt-2">
                  KES {stats.total_revenue.toLocaleString()}
                </h3>
              </div>
              <div className="bg-green-200 p-3 rounded-lg">
                <TrendingUp className="text-green-700" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Paid Payments</p>
                <h3 className="text-2xl font-bold text-blue-900 mt-2">
                  {stats.paid}
                </h3>
              </div>
              <div className="bg-blue-200 p-3 rounded-lg">
                <CheckCircle className="text-blue-700" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">Pending</p>
                <h3 className="text-2xl font-bold text-yellow-900 mt-2">
                  {stats.pending}
                </h3>
              </div>
              <div className="bg-yellow-200 p-3 rounded-lg">
                <Clock className="text-yellow-700" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Failed</p>
                <h3 className="text-2xl font-bold text-red-900 mt-2">
                  {stats.failed}
                </h3>
              </div>
              <div className="bg-red-200 p-3 rounded-lg">
                <AlertCircle className="text-red-700" size={24} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <Filter className="text-gray-600" size={20} />
          <div className="flex gap-2">
            {["all", "paid", "pending", "failed"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-auto">
            {filteredPayments.length} payment{filteredPayments.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Products</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Receipt</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Paid At</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    No payments found
                  </td>
                </tr>
              ) : (
                filteredPayments.map(p => (
                  <tr key={p.payment_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">#{p.order_id}</div>
                      <div className="text-xs text-gray-500">{p.order_status}</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{p.customer_name}</div>
                      <div className="text-xs text-gray-600 flex items-center gap-1">
                        {p.contact_type === "email" ? "📧" : "📞"}
                        {p.customer_contact}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {p.products && p.products.length > 0 ? (
                        <div className="space-y-1">
                          {p.products.map((prod, i) => (
                            <div key={i} className="text-sm text-gray-700">
                              {prod.name} <span className="text-gray-500">× {prod.quantity}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        KES {Number(p.total).toLocaleString()}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {getMethodBadge(p.method)}
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(p.status)}
                    </td>

                    <td className="px-6 py-4">
                      {p.mpesa_receipt ? (
                        <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-800">
                          {p.mpesa_receipt}
                        </code>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {p.paid_at ? new Date(p.paid_at).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}