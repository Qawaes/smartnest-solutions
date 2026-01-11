import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BackToHome from "../../components/ui/BackToHome";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = login(form.email, form.password);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6 space-y-6">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Welcome Back</h1>
          <p className="text-gray-500 text-sm">
            Login to your SmartNest account
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded">
            {error}
          </div>
        )}
        <div >
          <BackToHome />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* FOOTER LINKS */}
        <div className="text-sm text-center text-gray-600 space-y-2">
          <Link to="/auth/forgot-password" className="hover:underline block">
            Forgot password?
          </Link>
          <p>
            Don’t have an account?{" "}
            <Link
              to="/auth/register"
              className="text-black font-medium hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
