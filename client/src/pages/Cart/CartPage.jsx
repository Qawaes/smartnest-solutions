import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { Trash2, ShoppingBag, Plus, Minus, X } from "lucide-react";

export default function CartPage() {
  const { cart, updateQty, removeFromCart, clearCart } = useCart();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-6 animate-fadeIn">
          <div className="relative">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <span className="text-white text-2xl">0</span>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Looks like you haven't added anything yet. Start shopping to fill
              it up!
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-2 hover:underline"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* CART ITEMS */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => {
            const itemTotal = item.price * item.qty;

            return (
              <div
                key={item.product_id}
                className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all animate-slideIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex gap-6">
                  {/* IMAGE PLACEHOLDER */}
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex-shrink-0 flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-gray-400" />
                  </div>

                  {/* ITEM DETAILS */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          KES {item.price.toLocaleString()} each
                        </p>
                        {item.is_branding && (
                          <span className="inline-block mt-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            ✨ Custom Branding
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => removeFromCart(item)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                        title="Remove item"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* QUANTITY CONTROLS */}
                      <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1">
                        <button
                          onClick={() => updateQty(item.product_id, item.qty - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors border border-transparent hover:border-gray-200"
                          disabled={item.qty <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <span className="font-semibold min-w-[32px] text-center">
                          {item.qty}
                        </span>

                        <button
                          onClick={() => updateQty(item.product_id, item.qty + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors border border-transparent hover:border-gray-200"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* ITEM TOTAL */}
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Subtotal</p>
                        <p className="text-xl font-bold">
                          KES {itemTotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ORDER SUMMARY */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-gray-50 to-white border rounded-2xl p-6 sticky top-24 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.length} items)</span>
                <span>KES {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="text-sm">Calculated at checkout</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold">
                    KES {subtotal.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  + delivery fee
                </p>
              </div>
            </div>

            <Link
              to="/checkout"
              className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center px-6 py-4 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all mb-3"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/"
              className="block w-full text-center text-gray-600 hover:text-gray-900 py-2 text-sm"
            >
              ← Continue Shopping
            </Link>

            {/* TRUST BADGES */}
            <div className="mt-6 pt-6 border-t space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600">✓</span>
                </div>
                <span>Secure M-Pesa Payment</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600">🚚</span>
                </div>
                <span>Fast & Reliable Delivery</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600">💯</span>
                </div>
                <span>100% Quality Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}