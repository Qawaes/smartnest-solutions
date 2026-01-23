import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogIn, Mail, KeyRound } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { requestOTP, verifyOTP } = useAuth();

  const [step, setStep] = useState("email"); // "email" or "otp"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await requestOTP(email);
      setMessage(response.message);
      setStep("otp");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await verifyOTP(email, otp);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp("");
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await requestOTP(email);
      setMessage(response.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setOtp("");
    setError("");
    setMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              {step === "email" ? (
                <LogIn className="text-white" size={32} />
              ) : (
                <KeyRound className="text-white" size={32} />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-500 mt-2">
              {step === "email"
                ? "Enter your email to receive a verification code"
                : "Enter the 6-digit code sent to your email"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {message}
            </div>
          )}

          {step === "email" ? (
            <form onSubmit={handleRequestOTP} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "Sending code..." : "Send Verification Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                  required
                />
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Code sent to {email}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "Verifying..." : "Verify and Login"}
              </button>

              <div className="flex justify-between items-center text-sm">
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Change email
                </button>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                >
                  Resend code
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Only authorized administrators can access this system
        </p>
      </div>
    </div>
  );
}