import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { 
  ShoppingCart, 
  Check, 
  Heart, 
  Share2, 
  ChevronLeft,
  Truck,
  Shield,
  RefreshCw,
  Sparkles,
  Package,
  Star,
  Minus,
  Plus
} from "lucide-react";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, updateCartItemQty } = useCart();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [imageLoading, setImageLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Find if product is in cart
  const cartItem = cart.find((item) => item.product_id === product?.id);
  const inCart = Boolean(cartItem);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/products`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => String(p.id) === id);
        setProduct(found);

        if (found?.images?.length) {
          const primary = found.images.find((img) => img.is_primary) || found.images[0];
          setActiveImage(primary.image_url);
        }

        setLoading(false);
      });
  }, [id]);

  // Toggle cart function
  const handleToggleCart = () => {
    if (inCart) {
      removeFromCart(cartItem);
    } else {
      addToCart({
        product_id: product.id,
        name: product.name,
        price: Number(product.price),
        qty: quantity,
        is_branding: product.is_branding,
      });
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* IMAGE GALLERY */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-xl group">
              {imageLoading && activeImage && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                </div>
              )}
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    imageLoading ? "opacity-0" : "opacity-100"
                  } group-hover:scale-105`}
                  onLoad={() => setImageLoading(false)}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <Package className="w-20 h-20 mb-3 opacity-30" />
                  <span className="font-medium">No Image Available</span>
                </div>
              )}

              {/* Quick Actions on Image */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-12 h-12 rounded-full backdrop-blur-xl shadow-lg flex items-center justify-center transition-all ${
                    isWishlisted
                      ? "bg-red-500 text-white"
                      : "bg-white/90 text-gray-700 hover:bg-white"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? "fill-white" : ""}`}
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="w-12 h-12 bg-white/90 backdrop-blur-xl rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                >
                  <Share2 className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Custom Badge */}
              {product.is_branding && (
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                    <span className="text-white font-bold text-sm">Custom Branding</span>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveImage(img.image_url);
                      setImageLoading(true);
                    }}
                    className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden transition-all ${
                      activeImage === img.image_url
                        ? "ring-4 ring-purple-600 shadow-lg scale-105"
                        : "ring-2 ring-gray-200 hover:ring-gray-300"
                    }`}
                  >
                    <img
                      src={img.image_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT INFO */}
          <div className="space-y-8">
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>
              
              {/* Mock Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">4.0 (125 reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl md:text-5xl font-black text-gray-900">
                KES {Number(product.price).toLocaleString()}
              </span>
            </div>

            {/* Custom Branding Notice */}
            {product.is_branding && (
              <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-900 mb-1">Custom Branding Available</h3>
                    <p className="text-purple-700 text-sm">
                      Personalize this product with your logo or design. Branding details will be requested at checkout.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-16 text-center font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-gray-600">
                  Total: <span className="font-bold text-gray-900">KES {(Number(product.price) * quantity).toLocaleString()}</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleToggleCart}
                className={`w-full py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg ${
                  inCart
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-green-500/30"
                    : "bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-black hover:to-gray-900 hover:shadow-xl"
                }`}
              >
                {inCart ? (
                  <>
                    <Check className="w-6 h-6" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              {inCart && (
                <button
                  onClick={() => navigate("/cart")}
                  className="w-full py-5 bg-white border-2 border-gray-900 text-gray-900 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all"
                >
                  View Cart & Checkout
                </button>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t-2 border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">Free Delivery</h4>
                  <p className="text-gray-600 text-xs">Orders over KES 5,000</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">Quality Assured</h4>
                  <p className="text-gray-600 text-xs">Premium products only</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">Easy Returns</h4>
                  <p className="text-gray-600 text-xs">7-day return policy</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">Secure Packaging</h4>
                  <p className="text-gray-600 text-xs">Safe delivery guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}