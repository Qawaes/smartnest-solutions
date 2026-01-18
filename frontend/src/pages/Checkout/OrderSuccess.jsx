import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Home,
  Copy,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const initialStatus = searchParams.get("status") || "pending";

  const [status, setStatus] = useState(initialStatus);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [copied, setCopied] = useState(false);

  // Fetch order data
  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        console.log("Fetching order from:", `${API_BASE_URL}/api/payments/order/${orderId}/payment-status`);
        const res = await fetch(`${API_BASE_URL}/api/payments/order/${orderId}/payment-status`);
        const data = await res.json();
        console.log("Order data:", data);
        setOrderData(data);
        if (data.payment_status) {
          setStatus(data.payment_status.toLowerCase());
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching order:", err);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Poll for payment status updates when pending
  useEffect(() => {
    if (!orderId) {
      console.log("Polling skipped - no orderId");
      return;
    }

    // Only poll if status is still pending
    if (status !== "pending") {
      console.log("Polling stopped - status is now:", status);
      return;
    }

    console.log("Starting polling for order:", orderId);
    
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/payments/order/${orderId}/payment-status`);
        const data = await res.json();
        console.log("Poll response:", data);
        
        setOrderData(data);
        
        // Update status if payment status changed from PENDING
        if (data.payment_status && data.payment_status !== "PENDING") {
          console.log("Payment status changed to:", data.payment_status);
          setStatus(data.payment_status.toLowerCase());
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000); // Poll every 2 seconds for faster updates

    return () => {
      console.log("Stopping polling");
      clearInterval(pollInterval);
    };
  }, [status, orderId, API_BASE_URL]);

  // Countdown timer
  useEffect(() => {
    if (status !== "pending" || countdown === 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [status, countdown]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  // SUCCESS STATE
  if (status === "paid") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="bg-green-100 rounded-full p-6">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Payment Successful! 🎉
              </h1>
              <p className="text-gray-600 text-lg">
                Thank you for shopping with SmartNest Solutions
              </p>
            </div>

            {/* Order Details */}
            {orderData && (
              <div className="bg-white border-2 border-green-200 rounded-lg p-6 text-left space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order Number</p>
                    <p className="text-2xl font-bold text-gray-900">
                      #{orderData.order_id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-green-600">
                      KES {orderData.total?.toLocaleString()}
                    </p>
                  </div>
                </div>

                {orderData.mpesa_receipt && (
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-sm text-gray-600 mb-2">M-Pesa Receipt Number</p>
                    <div className="flex items-center justify-between">
                      <p className="font-mono font-bold text-gray-900">
                        {orderData.mpesa_receipt}
                      </p>
                      <button
                        onClick={() => copyToClipboard(orderData.mpesa_receipt)}
                        className="p-2 hover:bg-green-100 rounded transition"
                      >
                        {copied ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* What's Next */}
            <div className="bg-gray-50 rounded-lg p-6 text-left space-y-4">
              <h3 className="font-bold text-gray-900 text-lg">What happens next?</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Order Confirmed</p>
                    <p className="text-sm text-gray-600">
                      Your order has been received and confirmed
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Processing</p>
                    <p className="text-sm text-gray-600">
                      We're preparing your order (24-48 hours)
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-purple-600">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Delivery</p>
                    <p className="text-sm text-gray-600">
                      You'll receive tracking info when it ships
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
              >
                <Home className="w-5 h-5" />
                Continue Shopping
              </Link>
              <Link
                to="/cart"
                className="border-2 border-gray-300 text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                View Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CASH ON DELIVERY STATE
  if (status === "cod") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-blue-100 rounded-full p-6">
                <CheckCircle className="w-16 h-16 text-blue-600" />
              </div>
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Order Confirmed!
              </h1>
              <p className="text-gray-600 text-lg">
                Your order has been confirmed. You'll pay when it's delivered.
              </p>
            </div>

            {orderData && (
              <div className="bg-white border-2 border-blue-200 rounded-lg p-6 text-left space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order Number</p>
                    <p className="text-2xl font-bold text-gray-900">
                      #{orderData.order_id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-blue-600">
                      KES {orderData.total?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
              <h3 className="font-bold text-gray-900 mb-3">Payment on Delivery</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="text-blue-600">•</span>
                  <span>You'll pay the driver when they deliver your order</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Keep your phone ready for delivery coordination</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600">•</span>
                  <span>We'll send you tracking details within 24 hours</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PENDING STATE
  if (status === "pending") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-yellow-100 rounded-full p-6 relative">
                <Clock className="w-16 h-16 text-yellow-600" />
                <div className="absolute inset-0 rounded-full border-4 border-yellow-400 animate-ping opacity-75" />
              </div>
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Waiting for Payment...
              </h1>
              <p className="text-gray-600 text-lg">
                Please check your phone and enter your M-Pesa PIN
              </p>
            </div>

            {/* Timer */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2">Time remaining</p>
              <p className="text-5xl font-bold text-yellow-600">
                {Math.floor(countdown / 60)}:{(countdown % 60)
                  .toString()
                  .padStart(2, "0")}
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-white border rounded-lg p-6 text-left space-y-3">
              <h3 className="font-bold text-gray-900 mb-3">
                📱 How to Complete Payment:
              </h3>
              <ol className="space-y-2 list-decimal list-inside text-gray-700">
                <li>Check your phone for M-Pesa STK push notification</li>
                <li>Enter your M-Pesa PIN</li>
                <li>
                  Wait for confirmation (this page will update automatically)
                </li>
              </ol>
              
              {/* Polling Status Indicator */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                <p className="text-sm text-blue-700 font-medium">
                  Checking payment status... (every 2 seconds)
                </p>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => window.location.reload()}
              className="border-2 border-gray-300 text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Manual Refresh
            </button>

            {orderId && (
              <p className="text-sm text-gray-600">
                Order ID: <span className="font-mono font-bold">#{orderId}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // FAILED STATE
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white px-4 py-20">
      <div className="max-w-2xl mx-auto">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-red-100 rounded-full p-6">
              <XCircle className="w-16 h-16 text-red-600" />
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h1>
            <p className="text-gray-600 text-lg">
              We couldn't process your payment. No money was deducted.
            </p>
          </div>

          {/* Reasons */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-left">
            <h3 className="font-bold text-gray-900 mb-3">Common reasons:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>Insufficient M-Pesa balance</span>
              </li>
              <li className="flex gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>Incorrect PIN entered</span>
              </li>
              <li className="flex gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>Transaction timeout</span>
              </li>
              <li className="flex gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>Network connectivity issues</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`/checkout?order_id=${orderId}`}
              className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
            >
              Try Again
            </a>
            <Link
              to="/"
              className="border-2 border-gray-300 text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Back to Home
            </Link>
          </div>

          {orderId && (
            <p className="text-sm text-gray-600">
              Order ID: <span className="font-mono font-bold">#{orderId}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
