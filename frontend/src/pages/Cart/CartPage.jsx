import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
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
  Sparkles,
  AlertCircle,
  Check,
  RotateCcw
} from "lucide-react";

export default function CartPage() {
  const { cart, updateQty, removeFromCart, clearCart, refreshCartFromServer } = useCart();
  const [removedItems, setRemovedItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  useEffect(() => {
    refreshCartFromServer();
  }, [refreshCartFromServer]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = subtotal >= 5000 ? 0 : 500;
  const discount = promoApplied ? promoDiscount : 0;
  const total = subtotal + deliveryFee - discount;

  const handleRemoveItem = (item) => {
    setRemovedItems([...removedItems, item]);
    removeFromCart(item);
    
    // Auto-remove from saved after 5 seconds
    setTimeout(() => {
      setRemovedItems(prev => prev.filter(i => i.product_id !== item.product_id));
    }, 5000);
  };

  const handleUndoRemove = (item) => {
    setRemovedItems(prev => prev.filter(i => i.product_id !== item.product_id));
    // You'd need to add this item back to cart - assuming you have an addToCart function
    // For now, just removing from removedItems
  };

  

  if (cart.length === 0 && removedItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-6 py-20">
        <div className="text-center space-y-8 max-w-md">
          <div className="relative">
            <div className="w-40 h-40 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center shadow-xl">
              <ShoppingBag className="w-20 h-20 text-purple-400" />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg">
              <span className="text-white font-bold text-sm">0 items</span>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Your cart is empty
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Looks like you haven't added anything yet. Start exploring our amazing collection!
            </p>
          </div>

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
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500 rounded-full shadow-sm"
                style={{ width: `${Math.min((subtotal / 5000) * 100, 100)}%` }}
              />
            </div>
            {subtotal < 5000 && (
              <p className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Add <span className="font-bold text-purple-600">KES {(5000 - subtotal).toLocaleString()}</span> more for free delivery! 🎉
              </p>
            )}
            {subtotal >= 5000 && (
              <p className="mt-3 text-sm text-green-600 font-semibold flex items-center gap-2">
                <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs">
                  <Check className="w-3 h-3 text-white" />
                </span>
                You've unlocked free delivery!
              </p>
            )}
          </div>
        </div>

        {/* Removed Items Banner */}
        {removedItems.length > 0 && (
          <div className="mb-6 bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 flex items-center justify-between animate-slideDown">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-semibold text-orange-900">
                Item removed from cart
              </span>
            </div>
            <button
              onClick={() => handleUndoRemove(removedItems[0])}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Undo
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* CART ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => {
              const itemTotal = item.price * item.qty;

              return (
                <div
                  key={item.product_id}
                  className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-purple-200 animate-slideIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Badge for low stock */}
                  {item.in_stock === false && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                      Out of Stock
                    </div>
                  )}

                  {/* Action Buttons - Top Right */}
                  <div className="absolute top-4 right-4 flex gap-2">
                   
                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500 rounded-full transition-all bg-gray-100"
                      title="Remove item"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex gap-6">
                    {/* IMAGE - Now clickable */}
                    <Link 
                      to={`/product/${item.product_id}`}
                      className="relative flex-shrink-0 group/img"
                    >
                      <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-md group-hover/img:shadow-lg transition-all">
                        {/* Replace this with actual product image if available */}
                        <ShoppingBag className="w-14 h-14 text-purple-300" />
                      </div>
                      {item.is_branding && (
                        <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 rounded-2xl transition-all flex items-center justify-center">
                        <span className="text-white text-xs font-semibold opacity-0 group-hover/img:opacity-100 transition-opacity">
                          View Details
                        </span>
                      </div>
                    </Link>

                    {/* ITEM DETAILS */}
                    <div className="flex-1 space-y-4">
                      {/* Product Name & Price */}
                      <div className="pr-8">
                        <Link 
                          to={`/product/${item.product_id}`}
                          className="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <p className="text-gray-600 text-sm mt-1">
                          KES {item.price.toLocaleString()} each
                        </p>
                        {item.is_branding && (
                          <div className="flex items-center gap-2 mt-2">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            <span className="text-xs text-purple-600 font-semibold">Custom branding available</span>
                          </div>
                        )}
                      </div>

                      {/* Quantity & Total Row */}
                      <div className="flex items-center justify-between gap-4">
                        {/* QUANTITY CONTROL */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 font-medium">Qty:</span>
                          <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <button
                              onClick={() => updateQty(item.product_id, Math.max(1, item.qty - 1))}
                              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-all"
                            >
                              <Minus className="w-4 h-4 text-gray-700" />
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.qty}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 1;
                                updateQty(item.product_id, Math.max(1, val));
                              }}
                              className="w-14 h-10 text-center font-bold border-x-2 border-gray-200 focus:outline-none focus:bg-purple-50"
                            />
                            <button
                              onClick={() => updateQty(item.product_id, item.qty + 1)}
                              disabled={item.in_stock === false}
                              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4 text-gray-700" />
                            </button>
                          </div>
                        </div>

                        {/* ITEM TOTAL */}
                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                          <p className="text-2xl font-black text-gray-900">
                            KES {itemTotal.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {item.in_stock === false && (
                        <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          This item is currently out of stock
                        </p>
                      )}
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
              <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">Order Summary</h2>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Subtotal ({cart.length} items)</span>
                    <span className="text-lg font-bold text-gray-900">KES {subtotal.toLocaleString()}</span>
                  </div>

                  {/* Delivery */}
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 font-medium">Delivery Fee</span>
                    </div>
                    <span className={`text-lg font-bold ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {deliveryFee === 0 ? 'FREE' : `KES ${deliveryFee.toLocaleString()}`}
                    </span>
                  </div>

                  {/* Promo Discount */}
                  {promoApplied && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-500" />
                        <span className="text-gray-600 font-medium">Promo Discount</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        -KES {discount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Total */}
                  <div className="pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">Total</span>
                      <span className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        KES {total.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Tax included where applicable
                    </p>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  className="group w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 mb-4 shadow-lg shadow-purple-500/30"
                >
                  <Lock className="w-5 h-5" />
                  <span>Secure Checkout</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                
               
              </div>

              {/* Trust Badges Card */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
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

              {/* Estimated Delivery */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <Truck className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-bold text-blue-900 text-sm">Estimated Delivery</p>
                    <p className="text-blue-700 text-xs">3-5 business days</p>
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

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
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

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        /* Hide number input arrows */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}