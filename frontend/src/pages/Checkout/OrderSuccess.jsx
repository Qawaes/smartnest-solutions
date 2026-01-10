import { Link } from "react-router-dom"

export default function OrderSuccess() {
  return (
    <div className="max-w-3xl mx-auto py-20 text-center space-y-6">

      {/* ICON */}
      <div className="text-6xl">✅</div>

      <h1 className="text-3xl font-semibold">
        Order Placed Successfully
      </h1>

      <p className="text-gray-600">
        Thank you for shopping with <strong>SmartNest Solution</strong>.
        Your order has been received and is being processed.
      </p>

      <div className="bg-gray-50 border rounded-lg p-6 text-left space-y-2">
        <p>📦 Delivery details will be shared via phone/email.</p>
        <p>💳 Payment confirmation will be sent shortly.</p>
        <p>🚚 Same-day delivery available in selected areas.</p>
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <Link
          to="/"
          className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
        >
          Continue Shopping
        </Link>

        <Link
          to="/category/gifts"
          className="border px-6 py-3 rounded hover:bg-gray-100"
        >
          Browse More Gifts
        </Link>
      </div>
    </div>
  )
}
