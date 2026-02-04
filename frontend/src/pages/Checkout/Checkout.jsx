import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { createOrder } from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Truck,
  Package,
  Sparkles,
  Palette,
  FileText,
  Calendar,
  Lock,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Smartphone,
  Banknote,
  Shield,
  X,
  Trash2,
} from "lucide-react";

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

  // API Base URL - update this for production
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

  /* ================= FORM STATE ================= */
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
  logoFile: null,      // 🆕 Store the file
  logoPreview: null,   // 🆕 Store preview URL
});

  const [paymentMethod, setPaymentMethod] = useState("mpesa");

  /* ================= STEP 1: CREATE ORDER ================= */
  const handleContinueToPayment = async () => {
  setError("");

  // Validation
  if (!billing.name || !billing.phone || !billing.email || !billing.address) {
    setError("Please fill all required billing fields (name, phone, email, and address)");
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(billing.email)) {
    setError("Please enter a valid email address");
    return;
  }

  const phoneRegex = /^(0|254|\+254)?[17]\d{8}$/;
  if (!phoneRegex.test(billing.phone.replace(/\s+/g, ''))) {
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
      branding: hasBrandingItems ? {
        logo: branding.logo, // URL or description
        colors: branding.colors,
        notes: branding.notes,
        deadline: branding.deadline,
      } : null,
      payment_method: paymentMethod,
    };

    const res = await createOrder(orderPayload);
    const newOrderId = res.order_id || res.id;
    
    // 🆕 Upload logo image if provided
    if (hasBrandingItems && branding.logoFile && newOrderId) {
      try {
        const formData = new FormData();
        formData.append('logo', branding.logoFile);
        
        await fetch(`${API_BASE_URL}/api/orders/${newOrderId}/branding/logo`, {
          method: 'POST',
          body: formData
        });
      } catch (logoErr) {
        console.error('Logo upload failed:', logoErr);
        // Don't block checkout if logo upload fails
      }
    }

    setOrderId(newOrderId);
    setStep(2);
  } catch (err) {
    console.error("Order creation error:", err);
    setError("Failed to create order. Please try again.");
  } finally {
    setLoading(false);
  }
};
  /* ================= STEP 2: PAYMENT ================= */
  const handlePayment = async () => {
    setError("");

    if (!orderId) {
      setError("Order ID is missing. Please try again.");
      return;
    }

    try {
      setLoading(true);

      // CASH ON DELIVERY - FIXED
      if (paymentMethod === "cod") {
        // Mark COD in backend (creates/updates payment + order status)
        const codRes = await fetch(
          `${API_BASE_URL}/api/payments/orders/${orderId}/mark-cod-payment`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
        const codData = await codRes.json();
        if (!codRes.ok || !codData.success) {
          console.error("COD update failed:", codData);
          setError(codData.error || "Failed to confirm COD payment");
          return;
        }

        // Clear cart and redirect to success page with COD indicator
        clearCart();
        navigate(`/order-success?order_id=${orderId}&payment_method=cod`);
        return;
      }

      // MPESA STK PUSH
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
        // Payment initiation failed
        console.error("STK Push failed:", data);
        setError(data.error || "Failed to initiate payment");
        
        // Still redirect to show the error state
        navigate(`/order-success?order_id=${orderId}&status=failed`);
        return;
      }

      // STK Push sent successfully - redirect to pending page
      console.log("STK Push sent successfully:", data);
      clearCart();
      navigate(`/order-success?order_id=${orderId}&status=pending`);

    } catch (err) {
      console.error("Payment error:", err);
      setError("Failed to start payment. Please try again.");
      
      // On error, redirect to failed page if we have an orderId
      if (orderId) {
        navigate(`/order-success?order_id=${orderId}&status=failed`);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Secure Checkout
          </h1>
          <p className="text-gray-600 text-lg">
            Complete your order in just a few steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
            {/* Step 1 */}
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= 1
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                1
              </div>
              <span className="hidden sm:block font-semibold text-gray-700">
                Details
              </span>
            </div>

            <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500 ${
                  step >= 2 ? "w-full" : "w-0"
                }`}
              />
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= 2
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                2
              </div>
              <span className="hidden sm:block font-semibold text-gray-700">
                Payment
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - Forms */}
          <div className="lg:col-span-2">
            {/* STEP 1: Billing & Branding */}
            {step === 1 && (
              <div className="space-y-8">
                {/* Billing Information */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">
                      Billing Information
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={billing.name}
                        onChange={(e) =>
                          setBilling({ ...billing, name: e.target.value })
                        }
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-600 focus:ring focus:ring-purple-200 transition-all text-gray-900 font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="0712345678"
                        value={billing.phone}
                        onChange={(e) =>
                          setBilling({ ...billing, phone: e.target.value })
                        }
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-600 focus:ring focus:ring-purple-200 transition-all text-gray-900 font-medium"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        For M-Pesa payment and delivery updates
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email *
                      </label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={billing.email}
                        onChange={(e) =>
                          setBilling({ ...billing, email: e.target.value })
                        }
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-600 focus:ring focus:ring-purple-200 transition-all text-gray-900 font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Delivery Address *
                      </label>
                      <textarea
                        placeholder="Your full delivery address"
                        value={billing.address}
                        onChange={(e) =>
                          setBilling({ ...billing, address: e.target.value })
                        }
                        rows="3"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-600 focus:ring focus:ring-purple-200 transition-all text-gray-900 font-medium resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Branding Details (Conditional) */}
                {hasBrandingItems && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 shadow-xl border-2 border-purple-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-black text-gray-900">
                        Branding Details
                      </h2>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          <Palette className="w-4 h-4 inline mr-2" />
                          Logo/Design (Upload or Describe)
                        </label>
                        <div className="space-y-3">
                          {/* File Upload */}
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setBranding({
                                    ...branding,
                                    logoFile: file,
                                    logoPreview: URL.createObjectURL(file),
                                  });
                                }
                              }}
                              className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-600 focus:ring focus:ring-purple-200 transition-all text-gray-900 font-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                            />
                          </div>

                          {/* Image Preview */}
                          {branding.logoPreview && (
                            <div className="relative w-full h-48 bg-white rounded-2xl border-2 border-purple-200 overflow-hidden">
                              <img
                                src={branding.logoPreview}
                                alt="Logo preview"
                                className="w-full h-full object-contain"
                              />
                              <button
                                onClick={() =>
                                  setBranding({
                                    ...branding,
                                    logoFile: null,
                                    logoPreview: null,
                                  })
                                }
                                className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}

                          {/* OR text description */}
                          <p className="text-sm text-gray-600 text-center font-semibold">
                            OR
                          </p>

                          <input
                            type="text"
                            placeholder="Describe your logo (e.g., URL or details)"
                            value={branding.logo}
                            onChange={(e) =>
                              setBranding({ ...branding, logo: e.target.value })
                            }
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-600 focus:ring focus:ring-purple-200 transition-all text-gray-900 font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          <Palette className="w-4 h-4 inline mr-2" />
                          Brand Colors
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Red, Blue, #FF5733"
                          value={branding.colors}
                          onChange={(e) =>
                            setBranding({ ...branding, colors: e.target.value })
                          }
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-600 focus:ring focus:ring-purple-200 transition-all text-gray-900 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          <FileText className="w-4 h-4 inline mr-2" />
                          Additional Notes
                        </label>
                        <textarea
                          placeholder="Any special instructions for your branding..."
                          value={branding.notes}
                          onChange={(e) =>
                            setBranding({ ...branding, notes: e.target.value })
                          }
                          rows="4"
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-600 focus:ring focus:ring-purple-200 transition-all text-gray-900 font-medium resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          Preferred Deadline
                        </label>
                        <input
                          type="date"
                          value={branding.deadline}
                          onChange={(e) =>
                            setBranding({
                              ...branding,
                              deadline: e.target.value,
                            })
                          }
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-600 focus:ring focus:ring-purple-200 transition-all text-gray-900 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Payment Method */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">
                      Payment Method
                    </h2>
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-4">
                    {/* M-Pesa Option */}
                    <label
                      className={`block cursor-pointer transition-all ${
                        paymentMethod === "mpesa"
                          ? "ring-2 ring-green-600"
                          : "hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-4 p-6 border-2 rounded-2xl transition-all ${
                          paymentMethod === "mpesa"
                            ? "border-green-600 bg-green-50"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "mpesa"}
                          onChange={() => setPaymentMethod("mpesa")}
                          className="w-5 h-5 text-green-600 focus:ring-green-600"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                              <Smartphone className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">
                                M-Pesa
                              </h3>
                              <p className="text-sm text-gray-600">
                                Lipa Na M-Pesa
                              </p>
                            </div>
                          </div>
                          {paymentMethod === "mpesa" && (
                            <div className="mt-4 p-4 bg-white rounded-xl border border-green-200">
                              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                                You'll receive an STK push notification on your
                                phone ({billing.phone}). Enter your M-Pesa PIN
                                to complete the payment.
                              </p>
                              <div className="flex items-start gap-2 text-xs text-green-700 bg-green-50 p-3 rounded-lg">
                                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>
                                  Instant confirmation • Secure payment
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </label>

                    {/* Cash on Delivery Option */}
                    <label
                      className={`block cursor-pointer transition-all ${
                        paymentMethod === "cod"
                          ? "ring-2 ring-orange-600"
                          : "hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-4 p-6 border-2 rounded-2xl transition-all ${
                          paymentMethod === "cod"
                            ? "border-orange-600 bg-orange-50"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")}
                          className="w-5 h-5 text-orange-600 focus:ring-orange-600"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
                              <Banknote className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">
                                Cash on Delivery
                              </h3>
                              <p className="text-sm text-gray-600">
                                Nyeri area only
                              </p>
                            </div>
                          </div>
                          {paymentMethod === "cod" && (
                            <div className="mt-4 p-4 bg-white rounded-xl border border-orange-200">
                              <p className="text-sm text-gray-700 leading-relaxed">
                                Pay with cash when your order is delivered. This
                                option is only available for deliveries within
                                Nyeri.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Back Button */}
                  <button
                    onClick={() => setStep(1)}
                    className="mt-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Details
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Order Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Order Summary Card */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">
                    Order Summary
                  </h2>
                </div>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex justify-between items-start gap-3 py-3 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-600">
                          Qty: {item.qty} × KES {item.price.toLocaleString()}
                        </p>
                      </div>
                      <span className="font-bold text-gray-900">
                        KES {(item.price * item.qty).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-3 mb-6 pt-4 border-t-2 border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      KES {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span
                      className={`font-semibold ${
                        deliveryFee === 0 ? "text-green-600" : ""
                      }`}
                    >
                      {deliveryFee === 0
                        ? "FREE"
                        : `KES ${deliveryFee.toLocaleString()}`}
                    </span>
                  </div>
                  {deliveryFee !== 0 && (
                    <p className="text-xs text-gray-500">
                      Transport fee applies to orders below KES 5,000.
                    </p>
                  )}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        KES {total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <p className="text-sm text-red-700 font-medium">
                        {error}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {step === 1 && (
                  <button
                    onClick={handleContinueToPayment}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue to Payment</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                )}

                {step === 2 && (
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>
                          {paymentMethod === "mpesa" 
                            ? "Sending STK Push..." 
                            : "Processing..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        <span>
                          {paymentMethod === "mpesa" 
                            ? "Pay with M-Pesa" 
                            : "Complete Order"}
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Security Badge */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 shadow-lg border-2 border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                  <h3 className="font-bold text-gray-900">
                    Secure Checkout
                  </h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Your payment information is encrypted and secure. We never
                  store your M-Pesa PIN or card details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
