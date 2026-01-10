import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { createOrder } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasBrandingItems = cart.some(i => i.is_branding);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

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
  });

  const [paymentMethod, setPaymentMethod] = useState("mpesa");

  /* ================= STEP 1: CREATE ORDER ================= */
  const handleContinueToPayment = async () => {
    setError("");

    if (!billing.name || !billing.phone || !billing.address) {
      setError("Please fill all required billing fields");
      return;
    }

    try {
      setLoading(true);

      const orderPayload = {
        customer: billing,
        items: cart.map(item => ({
          product_id: item.product_id,
          qty: item.qty,
        })),
        branding: hasBrandingItems ? branding : null,
        total,
      };

      const res = await createOrder(orderPayload);

      setOrderId(res.order_id || res.id);
      setStep(2);
    } catch (err) {
      setError("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STEP 2: PAYMENT ================= */
  const handlePayment = async () => {
    setError("");

    try {
      setLoading(true);

      // CASH ON DELIVERY
      if (paymentMethod === "cod") {
        await fetch(
          `http://127.0.0.1:5000/api/orders/${orderId}/status`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "pending_payment" }),
          }
        );

        clearCart();
        navigate("/thank-you");
        return;
      }

      // MPESA STK PUSH
      const res = await fetch(
        "http://127.0.0.1:5000/api/payments/mpesa/stk",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: orderId,
            phone: billing.phone,
            amount: total,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("STK Push failed");
      }

      navigate("/checkout/processing");

    } catch (err) {
      setError("Failed to start payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

      {/* LEFT */}
      <div className="md:col-span-2 space-y-8">

        {step === 1 && (
          <>
            <section className="border rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold">
                Billing & Delivery Details
              </h2>

              <input
                className="input"
                placeholder="Full Name *"
                value={billing.name}
                onChange={e =>
                  setBilling({ ...billing, name: e.target.value })
                }
              />

              <input
                className="input"
                placeholder="Phone Number *"
                value={billing.phone}
                onChange={e =>
                  setBilling({ ...billing, phone: e.target.value })
                }
              />

              <input
                className="input"
                placeholder="Email Address"
                value={billing.email}
                onChange={e =>
                  setBilling({ ...billing, email: e.target.value })
                }
              />

              <input
                className="input"
                placeholder="Delivery Address *"
                value={billing.address}
                onChange={e =>
                  setBilling({ ...billing, address: e.target.value })
                }
              />
            </section>

            {hasBrandingItems && (
              <section className="border rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-semibold">
                  Branding & Customization
                </h2>

                <input
                  className="input"
                  placeholder="Brand Colors"
                  value={branding.colors}
                  onChange={e =>
                    setBranding({ ...branding, colors: e.target.value })
                  }
                />

                <input
                  className="input"
                  placeholder="Logo URL"
                  value={branding.logo}
                  onChange={e =>
                    setBranding({ ...branding, logo: e.target.value })
                  }
                />

                <textarea
                  className="input h-24"
                  placeholder="Customization notes"
                  value={branding.notes}
                  onChange={e =>
                    setBranding({ ...branding, notes: e.target.value })
                  }
                />

                <input
                  type="date"
                  className="input"
                  value={branding.deadline}
                  onChange={e =>
                    setBranding({ ...branding, deadline: e.target.value })
                  }
                />
              </section>
            )}
          </>
        )}

        {step === 2 && (
          <section className="border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Payment Method</h2>

            <label className="flex gap-2">
              <input
                type="radio"
                checked={paymentMethod === "mpesa"}
                onChange={() => setPaymentMethod("mpesa")}
              />
              M-Pesa
            </label>

            <label className="flex gap-2">
              <input
                type="radio"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Cash on Delivery (Nyeri only)
            </label>
          </section>
        )}
      </div>

      {/* RIGHT */}
      <aside className="border rounded-lg p-6 h-fit space-y-4">
        <h2 className="text-xl font-semibold">Order Summary</h2>

        {cart.map(item => (
          <div key={item.product_id} className="flex justify-between text-sm">
            <span>{item.name} × {item.qty}</span>
            <span>KES {item.price * item.qty}</span>
          </div>
        ))}

        <hr />

        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>KES {total}</span>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {step === 1 && (
          <button
            onClick={handleContinueToPayment}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded"
          >
            {loading ? "Processing..." : "Continue to Payment"}
          </button>
        )}

        {step === 2 && (
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded"
          >
            {loading ? "Starting payment..." : "Pay Now"}
          </button>
        )}
      </aside>
    </div>
  );
}
