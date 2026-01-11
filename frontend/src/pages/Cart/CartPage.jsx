import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { 
  Trash2, 
  ShoppingBag, 
  Plus, 
  Minus, 
  X, 
  ArrowRight,
  Lock,
  Truck,
  Package,
  CreditCard,
  Tag,
  Gift,
  Sparkles
} from "lucide-react";

export default function CartPage() {
  const { cart, updateQty, removeFromCart, clearCart } = useCart();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = subtotal >= 5000 ? 0 : 500;
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-6">
        <div className="text-center space-y-8 max-w-md animate-fadeIn">
          {/* Empty Cart Illustration */}
          <div className="relative">
            <div className="w-40 h-40 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center shadow-xl">
              <ShoppingBag className="w-20 h-20 text-purple-400" />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg">
              <span className="text-white font-bold text-sm">0 items</span>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Your cart is empty
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Looks like you haven't added anything yet. Start exploring our amazing collection!
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all shadow-lg w-full"
            >
              <ShoppingBag className="w-6 h-6" />
              Start Shopping
            </Link>
            
            <Link
              to="/category/gifts"
              className="inline-flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:border-gray-900 hover:scale-105 transition-all w-full"
            >
              <Gift className="w-6 h-6" />
              Browse Gifts
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-xs text-gray-600 font-medium">Free Delivery</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Lock className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-xs text-gray-600 font-medium">Secure Pay</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-xs text-gray-600 font-medium">Fast Ship</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
                Shopping Cart
              </h1>
              <p className="text-gray-600 text-lg">
                {cart.length} {cart.length === 1 ? "item" : "items"} ready for checkout
              </p>
            </div>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="group flex items-center gap-2 px-4 py-2 text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-full transition-all font-semibold"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min((subtotal / 5000) * 100, 100)}%` }}
              />
            </div>
            {subtotal < 5000 && (
              <p className="mt-3 text-sm text-gray-600">
                Add <span className="font-bold text-purple-600">KES {(5000 - subtotal).toLocaleString()}</span> more for free delivery! 🎉
              </p>
            )}
            {subtotal >= 5000 && (
              <p className="mt-3 text-sm text-green-600 font-semibold flex items-center gap-2">
                <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-xs">✓</span>
                You've unlocked free delivery!
              </p>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* CART ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => {
              const itemTotal = item.price * item.qty;

              return (
                <div
                  key={item.product_id}
                  className="group relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-purple-200 animate-slideIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Remove Button - Top Right */}
                  <button
                    onClick={() => removeFromCart(item)}
                    className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500 rounded-full transition-all z-10 bg-gray-100 group-hover:bg-red-50"
                    title="Remove item"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex gap-6">
                    {/* IMAGE */}
                    <div className="relative flex-shrink-0">
                      <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-md">
                        <ShoppingBag className="w-14 h-14 text-purple-300" />
                      </div>
                      {item.is_branding && (
                        <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* ITEM DETAILS */}
                    <div className="flex-1 space-y-4">
                      {/* Product Name & Price */}
                      <div className="pr-8">
                        <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="text-gray-600 font-medium">
                            KES {item.price.toLocaleString()} each
                          </p>
                          {item.is_branding && (
                            <span className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                              <Sparkles className="w-3 h-3" />
                              Custom Branding
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom Section: Quantity & Total */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        {/* QUANTITY CONTROLS */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                          <button
                            onClick={() => updateQty(item.product_id, item.qty - 1)}
                            disabled={item.qty <= 1}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
                          >
                            <Minus className="w-4 h-4 text-gray-700" />
                          </button>

                          <span className="font-bold text-lg min-w-[48px] text-center text-gray-900">
                            {item.qty}
                          </span>

                          <button
                            onClick={() => updateQty(item.product_id, item.qty + 1)}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition-all hover:shadow-md"
                          >
                            <Plus className="w-4 h-4 text-gray-700" />
                          </button>
                        </div>

                        {/* ITEM TOTAL */}
                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                          <p className="text-2xl font-black text-gray-900">
                            KES {itemTotal.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Continue Shopping Link */}
            <Link
              to="/"
              className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 font-semibold py-6 transition-colors group"
            >
              <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
              Continue Shopping
            </Link>
          </div>

          {/* ORDER SUMMARY - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Main Summary Card */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">Order Summary</h2>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-600 font-medium">Subtotal ({cart.length} items)</span>
                    <span className="text-lg font-bold text-gray-900">KES {subtotal.toLocaleString()}</span>
                  </div>

                  {/* Delivery */}
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-600 font-medium">Delivery Fee</span>
                    <span className={`text-lg font-bold ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {deliveryFee === 0 ? 'FREE' : `KES ${deliveryFee.toLocaleString()}`}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="border-t-2 border-gray-100 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">Total</span>
                      <span className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        KES {total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  className="group w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 mb-4 shadow-lg shadow-purple-500/30"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Promo Code Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-600 focus:outline-none transition-colors pr-12 font-medium"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all">
                    <Tag className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Trust Badges Card */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 shadow-lg border-2 border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-green-600" />
                  Safe & Secure Shopping
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <CreditCard className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Secure M-Pesa Payment</p>
                      <p className="text-xs text-gray-600">Encrypted & Protected</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Truck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Fast Delivery</p>
                      <p className="text-xs text-gray-600">Free over KES 5,000</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Package className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Quality Guarantee</p>
                      <p className="text-xs text-gray-600">100% Satisfaction</p>
                    </div>
                  </div>
                </div>
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
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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