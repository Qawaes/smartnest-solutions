import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { ShoppingCart, Check, Heart, Eye } from "lucide-react";
import { useState } from "react";

export default function ProductCard({ product }) {
  const { cart, addToCart, removeFromCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const cartItem = cart.find((item) => item.product_id === product.id);
  const inCart = Boolean(cartItem);

  const handleToggleCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inCart) {
      removeFromCart(cartItem);
    } else {
      addToCart({
        product_id: product.id,
        name: product.name,
        price: Number(product.price),
        qty: 1,
        is_branding: product.is_branding,
      });
    }
  };

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {product.image ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                </div>
              )}
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  isHovered ? "scale-110" : "scale-100"
                } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <Eye className="w-12 h-12 mb-2 opacity-30" />
              <span className="text-sm font-medium">No Image</span>
            </div>
          )}

          {/* Overlay gradient on hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Quick action buttons */}
          <div
            className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
            }`}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors group/heart"
            >
              <Heart className="w-5 h-5 text-gray-700 group-hover/heart:text-red-500 transition-colors" />
            </button>
            <Link
              to={`/product/${product.id}`}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-purple-50 transition-colors group/eye"
            >
              <Eye className="w-5 h-5 text-gray-700 group-hover/eye:text-purple-600 transition-colors" />
            </Link>
          </div>

          {/* Badge for custom branding */}
          {product.is_branding && (
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full shadow-lg">
                Custom
              </span>
            </div>
          )}

          {/* Quick view button at bottom */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${
              isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            }`}
          >
            <Link
              to={`/product/${product.id}`}
              className="w-full py-3 bg-white text-gray-900 font-semibold rounded-xl shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Eye className="w-4 h-4" />
              Quick View
            </Link>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-gray-900">
            KES {Number(product.price).toLocaleString()}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleToggleCart}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-sm ${
            inCart
              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-green-500/30"
              : "bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-black hover:to-gray-900 hover:shadow-lg"
          }`}
        >
          {inCart ? (
            <>
              <Check className="w-5 h-5" />
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>

      {/* Hover border effect */}
      <div
        className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 pointer-events-none ${
          isHovered
            ? "border-purple-400 shadow-lg shadow-purple-200"
            : "border-transparent"
        }`}
      />
    </div>
  );
}