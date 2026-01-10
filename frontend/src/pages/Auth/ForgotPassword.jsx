import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔜 BACKEND INTEGRATION POINT
    await new Promise(res => setTimeout(res, 1000));

    setSent(true);
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow space-y-6">
      <h1 className="text-2xl font-semibold text-center">
        Forgot Password
      </h1>

      {sent ? (
        <div className="text-center space-y-4">
          <p className="text-green-600">
            Reset link sent to your email
          </p>
          <Link to="/auth/login" className="hover:underline">
            Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />

          <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
            Send Reset Link
          </button>
        </form>
      )}
    </div>
  );
}
