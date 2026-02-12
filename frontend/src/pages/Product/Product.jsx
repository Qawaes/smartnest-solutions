import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { submitProductRating } from "../../services/api";
import { 
  ShoppingCart, 
  Check,  
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
  const [error, setError] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingMessage, setRatingMessage] = useState("");
  const [flashCountdown, setFlashCountdown] = useState("");
  const [flashCountdownLabel, setFlashCountdownLabel] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });



  // Find if product is in cart
  const cartItem = cart.find((item) => item.product_id === product?.id);
  const inCart = Boolean(cartItem);

  const inStock = product?.in_stock !== false;
  const discountPercent = Number(product?.discount_percent ?? 0);
  const flashSalePercent = Number(product?.flash_sale_percent ?? 0);
  const isFlashSale = Boolean(product?.flash_sale_active);
  const hasDiscount = discountPercent > 0 && product?.discounted_price != null;
  const displayPrice = hasDiscount
    ? Number(product.discounted_price)
    : Number(product?.price || 0);
  const effectivePrice =
    product?.effective_price != null
      ? Number(product.effective_price)
      : displayPrice;

  const ratingAvg = Number(product?.rating_avg ?? 0);
  const ratingCount = Number(product?.rating_count ?? 0);

  useEffect(() => {
    if (!product?.flash_sale_start || !product?.flash_sale_end) {
      setFlashCountdown("");
      setFlashCountdownLabel("");
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const start = new Date(product.flash_sale_start);
      const end = new Date(product.flash_sale_end);

      let target = end;
      let label = "Ends in";
      if (now < start) {
        target = start;
        label = "Starts in";
      }

      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setFlashCountdown("");
        setFlashCountdownLabel("");
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const text =
        days > 0
          ? `${days}d ${hours}h ${minutes}m ${seconds}s`
          : `${hours}h ${minutes}m ${seconds}s`;

      setFlashCountdown(text);
      setFlashCountdownLabel(label);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [product?.flash_sale_start, product?.flash_sale_end]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    fetch(`${API_URL}/api/products`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        
        // FIXED: Handle both response formats
        const products = Array.isArray(data) ? data : data.products;
        
        if (!products || !Array.isArray(products)) {
          throw new Error("Invalid API response format");
        }
        
        const found = products.find((p) => String(p.id) === String(id));
        
        
        setProduct(found);

        if (found?.images?.length) {
          const primary = found.images.find((img) => img.is_primary) || found.images[0];
          setActiveImage(primary.image_url);
        } else if (found?.image) {
          // Fallback to single image field if images array doesn't exist
          setActiveImage(found.image);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Toggle cart function
  const handleToggleCart = () => {
    if (!inStock) return;
    if (inCart) {
      removeFromCart(cartItem);
    } else {
      addToCart({
        product_id: product.id,
        name: product.name,
        price: effectivePrice,
        qty: quantity,
        is_branding: product.is_branding,
        in_stock: inStock,
      });
    }
  };

  const handleSubmitRating = async () => {
    if (!selectedRating || !product?.id) return;
    try {
      setRatingLoading(true);
      setRatingMessage("");
      const data = await submitProductRating(product.id, selectedRating);
      setProduct((prev) => ({
        ...prev,
        rating_avg: data.rating_avg,
        rating_count: data.rating_count,
      }));
      setRatingMessage("Thanks for rating!");
    } catch (err) {
      setRatingMessage(err.message || "Failed to submit rating");
    } finally {
      setRatingLoading(false);
    }
  };

  const handleQuantityChange = (delta) => {
    const next = Math.max(1, quantity + delta);
    setQuantity(inStock ? next : 1);
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
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Product</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📦</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const images = product.images?.length ? product.images : (product.image ? [{ image_url: product.image, is_primary: true }] : []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>

        {/* Main Content - Improved Layout */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-10">
            {/* Left Column - Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div 
                className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden aspect-square cursor-zoom-in"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin" />
                  </div>
                )}
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-contain p-8 transition-transform duration-200 ease-out"
                  style={{
                    transform: isZoomed ? 'scale(2)' : 'scale(1)',
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                  }}
                  onLoad={() => setImageLoading(false)}
                />
                
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  
                  <button
                    onClick={handleShare}
                    className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                  >
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {isFlashSale && (
                    <div className="px-3 py-1.5 bg-orange-600 text-white text-sm font-bold rounded-full shadow-lg">
                      ⚡ Flash Sale {flashSalePercent > 0 ? `-${flashSalePercent}%` : ""}
                    </div>
                  )}
                  {!isFlashSale && hasDiscount && (
                    <div className="px-3 py-1.5 bg-red-600 text-white text-sm font-bold rounded-full shadow-lg">
                      -{discountPercent}% OFF
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img.image_url)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === img.image_url
                          ? "border-purple-600 ring-2 ring-purple-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img.image_url}
                        alt={`${product.name} view ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Product Info (Sticky on scroll) */}
            <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
              {/* Title & Category */}
              <div>
                <div className="text-sm text-purple-600 font-semibold mb-2 uppercase tracking-wide">
                  {product.category || "Product"}
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Price Section */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-4xl md:text-5xl font-black text-gray-900">
                    KES {effectivePrice.toLocaleString()}
                  </span>
                  {(hasDiscount || isFlashSale) && (
                    <span className="text-xl text-gray-500 line-through">
                      KES {Number(product.price).toLocaleString()}
                    </span>
                  )}
                </div>

                {flashCountdown && (
                  <div className="inline-block px-4 py-2 bg-orange-50 border border-orange-200 rounded-xl">
                    <span className="text-sm text-orange-700 font-semibold">
                      {flashCountdownLabel} {flashCountdown}
                    </span>
                  </div>
                )}
              </div>

              {/* Stock & Rating */}
              <div className="flex items-center gap-6 pb-4 border-b border-gray-200">
                <div className={`text-sm font-semibold ${inStock ? "text-green-600" : "text-red-600"}`}>
                  {inStock ? "✓ In Stock" : "✗ Out of Stock"}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          ratingAvg >= star
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{ratingAvg.toFixed(1)} ({ratingCount})</span>
                </div>
              </div>

              {/* Custom Branding Notice */}
              {product.is_branding && (
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-purple-900 mb-1">Custom Branding Available</h3>
                      <p className="text-purple-700 text-sm leading-relaxed">
                        Personalize this product with your logo or design. Branding details will be requested at checkout.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-14 text-center font-bold text-lg">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={!inStock}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    Total: <span className="font-bold text-gray-900 text-lg">KES {(effectivePrice * quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleToggleCart}
                  disabled={!inStock}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg ${
                    !inStock
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : inCart
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-green-500/30"
                      : "bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-black hover:to-gray-900 hover:shadow-xl"
                  }`}
                >
                  {!inStock ? (
                    <span>Out of Stock</span>
                  ) : inCart ? (
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
                    className="w-full py-4 bg-white border-2 border-gray-900 text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all"
                  >
                    View Cart & Checkout
                  </button>
                )}
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                <div className="flex items-start gap-2">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs mb-0.5">Free Delivery</h4>
                    <p className="text-gray-600 text-xs">Orders over KES 5,000</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs mb-0.5">Quality Assured</h4>
                    <p className="text-gray-600 text-xs">Premium products</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs mb-0.5">Easy Returns</h4>
                    <p className="text-gray-600 text-xs">7-day policy</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs mb-0.5">Secure Packaging</h4>
                    <p className="text-gray-600 text-xs">Safe delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Full Width Description & Rating */}
          <div className="border-t border-gray-200 bg-gray-50 p-6 lg:p-10 space-y-8">
            {/* Description */}
            <div className="max-w-4xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            {/* Rating Section */}
            <div className="max-w-4xl space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">Rate This Product</h3>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setSelectedRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                      aria-label={`Rate ${star} star`}
                    >
                      <Star
                        className={`w-7 h-7 ${
                          selectedRating >= star
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300 hover:text-gray-400"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSubmitRating}
                  disabled={ratingLoading || selectedRating === 0}
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {ratingLoading ? "Submitting..." : "Submit Rating"}
                </button>
              </div>
              {ratingMessage && (
                <p className={`text-sm font-medium ${ratingMessage.includes("Thanks") ? "text-green-600" : "text-red-600"}`}>
                  {ratingMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}