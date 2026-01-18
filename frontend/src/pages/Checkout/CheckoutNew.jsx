import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Truck,
  Package,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Lock,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasBrandingItems = cart.some((i) => i.is_branding);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = subtotal >= 5000 ? 0 : 500;
  const total = subtotal + deliveryFee;

  // Form state
  const [billing, setBilling] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [branding, setBranding] = useState({
    logo: "",
    colors: "",
    notes: "",
    deadline: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("mpesa");

  // STEP 1: CREATE ORDER
  const handleContinueToPayment = async () => {
    setError("");

    if (!billing.name || !billing.phone || !billing.address) {
      setError("Please fill all required billing fields");
      return;
    }

    const phoneRegex = /^(0|254|\+254)?[17]\d{8}$/;
    if (!phoneRegex.test(billing.phone.replace(/\s+/g, ""))) {
      setError("Please enter a valid Kenyan phone number");
      return;
    }

    try {
      setLoading(true);

      const orderPayload = {
        customer: billing,
        items: cart.map((item) => ({
          product_id: item.product_id,
          qty: item.qty,
        })),
        branding: hasBrandingItems ? branding : null,
        payment_method: paymentMethod,
      };

      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create order");

      setOrderId(data.order_id || data.id);
      setStep(2);
    } catch (err) {
      console.error("Order creation error:", err);
      setError(err.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: PAYMENT
  const handlePayment = async () => {
    setError("");

    if (!orderId) {
      setError("Order ID is missing");
      return;
    }

    try {
      setLoading(true);

      // CASH ON DELIVERY
      if (paymentMethod === "cod") {
        clearCart();
        navigate(`/order-success?order_id=${orderId}&status=cod`);
        return;
      }

      // M-PESA STK PUSH
      const res = await fetch(`${API_BASE_URL}/api/payments/mpesa/stk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          phone: billing.phone,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        console.error("STK Push failed:", data);
        setError(data.error || "Failed to initiate payment");
        return;
      }

      // Success - redirect to pending page
      console.log("STK Push successful:", data);
      clearCart();
      navigate(`/order-success?order_id=${orderId}&status=pending`);
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Failed to start payment");
    } finally {
      setLoading(false);
    }
  };

  // If cart is empty, redirect
  if (cart.length === 0 && !orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Add items to your cart before checking out</p>
          <a
            href="/"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Secure Checkout</h1>
          <p className="text-gray-600">Complete your order in just a few steps</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12 max-w-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= 1
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step > 1 ? <CheckCircle className="w-6 h-6" /> : "1"}
              </div>
              <span className="hidden sm:block font-semibold text-gray-900">
                Details
              </span>
            </div>

            <div
              className={`flex-1 h-1 mx-4 rounded transition-all ${
                step >= 2
                  ? "bg-purple-600"
                  : "bg-gray-200"
              }`}
            />

            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= 2
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <span className="hidden sm:block font-semibold text-gray-900">
                Payment
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="space-y-6">
                {/* Billing Details */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Billing & Delivery
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none"
                        placeholder="John Doe"
                        value={billing.name}
                        onChange={(e) =>
                          setBilling({ ...billing, name: e.target.value })
                        }
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none"
                        placeholder="0712345678 or 254712345678"
                        value={billing.phone}
                        onChange={(e) =>
                          setBilling({ ...billing, phone: e.target.value })
                        }
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        M-Pesa payment will be sent to this number
                      </p>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none"
                        placeholder="john@example.com"
                        value={billing.email}
                        onChange={(e) =>
                          setBilling({ ...billing, email: e.target.value })
                        }
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Delivery Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none resize-none"
                        rows="3"
                        placeholder="Street address, building, apartment, etc."
                        value={billing.address}
                        onChange={(e) =>
                          setBilling({ ...billing, address: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Payment Method
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {/* M-Pesa */}
                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                      style={{
                        borderColor: paymentMethod === "mpesa" ? "#9333ea" : undefined,
                        backgroundColor: paymentMethod === "mpesa" ? "#f3e8ff" : undefined,
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="mpesa"
                        checked={paymentMethod === "mpesa"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <div className="ml-3 flex-1">
                        <p className="font-semibold text-gray-900">M-Pesa</p>
                        <p className="text-sm text-gray-600">
                          Fast and secure mobile payment
                        </p>
                      </div>
                    </label>

                    {/* Cash on Delivery */}
                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                      style={{
                        borderColor: paymentMethod === "cod" ? "#9333ea" : undefined,
                        backgroundColor: paymentMethod === "cod" ? "#f3e8ff" : undefined,
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <div className="ml-3 flex-1">
                        <p className="font-semibold text-gray-900">
                          Cash on Delivery
                        </p>
                        <p className="text-sm text-gray-600">
                          Pay when your order arrives
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                )}

                {/* Button */}
                <button
                  onClick={handleContinueToPayment}
                  disabled={loading}
                  className="w-full bg-purple-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue to Payment
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Confirm & Pay
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Customer Name:</span>
                      <span className="font-semibold text-gray-900">
                        {billing.name}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-semibold text-gray-900">
                        {billing.phone}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-semibold text-gray-900">
                        {billing.address}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-semibold text-gray-900">
                        {paymentMethod === "mpesa" ? "M-Pesa" : "Cash on Delivery"}
                      </span>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex gap-3 mb-6">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-red-700 font-medium">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      disabled={loading}
                      className="flex-1 bg-gray-200 text-gray-900 px-6 py-4 rounded-lg font-bold hover:bg-gray-300 transition disabled:opacity-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePayment}
                      disabled={loading}
                      className="flex-1 bg-green-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {paymentMethod === "mpesa"
                            ? "Sending STK..."
                            : "Processing..."}
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Pay Now
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex justify-between py-2 border-b border-gray-100"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      KES {(item.price * item.qty).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t-2 border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    KES {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `KES ${deliveryFee.toLocaleString()}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t border-gray-200">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-black text-purple-600">
                    KES {total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
