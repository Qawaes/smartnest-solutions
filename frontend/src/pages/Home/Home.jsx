import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/products/ProductCard";
import { useSearch } from "../../context/SearchContext";
import { fetchProducts } from "../../services/api";
import { 
  Sparkles, Gift, Shield, Truck, MessageCircle, ArrowRight, 
  Star, ChevronLeft, ChevronRight, Tag, Check, TrendingUp,
  Award, Package, Clock, Users
} from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { search } = useSearch();
  const [heroVisible, setHeroVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [flashCountdown, setFlashCountdown] = useState(null);

  // Premium carousel images
  const carouselImages = [
    {
      url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
      title: "Premium Collection 2024",
      subtitle: "Elevate Your Lifestyle with Quality Products",
      badge: "New Arrivals"
    },
    {
      url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80",
      title: "Corporate Gifting",
      subtitle: "Perfect Solutions for Business Relationships",
      badge: "Business"
    },
    {
      url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80",
      title: "Home & Office Essentials",
      subtitle: "Professional Quality for Every Space",
      badge: "Bestsellers"
    }
  ];

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);

    fetchProducts()
      .then((data) => setProducts(data))
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);

  const filteredProducts = products.filter((p) =>
    [p.name, p.description, p.category]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const flashSaleProducts = filteredProducts.filter(p => p.flash_sale_active);
  const regularProducts = filteredProducts.filter(p => !p.flash_sale_active);
  const visibleProducts = search ? filteredProducts : regularProducts.slice(0, 8);

  useEffect(() => {
    if (flashSaleProducts.length === 0) {
      setFlashCountdown(null);
      return;
    }

    const getSoonestEnd = () => {
      const endTimes = flashSaleProducts
        .map((p) => (p.flash_sale_end ? new Date(p.flash_sale_end).getTime() : null))
        .filter((t) => typeof t === "number" && !Number.isNaN(t));
      if (endTimes.length === 0) return null;
      return Math.min(...endTimes);
    };

    const updateCountdown = () => {
      const endTs = getSoonestEnd();
      if (!endTs) {
        setFlashCountdown(null);
        return;
      }
      const diff = Math.max(0, endTs - Date.now());
      const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
      const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
      const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
      setFlashCountdown(`${hours}:${minutes}:${seconds}`);
    };

    updateCountdown();
    const tick = setInterval(updateCountdown, 1000);
    return () => clearInterval(tick);
  }, [flashSaleProducts]);

  return (
    <div className="relative bg-white">
      
      {/* HERO CAROUSEL SECTION */}
      <section className="relative h-[75vh] md:h-[85vh] overflow-hidden bg-gray-900">
        {/* Carousel Images */}
        <div className="relative h-full">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              {/* Professional gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/40" />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <div
                className={`transition-all duration-1000 ${
                  heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                {/* Premium Badge */}
                <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-900 font-semibold text-sm tracking-wide">
                    {carouselImages[currentSlide].badge}
                  </span>
                </div>

                {/* Main Heading */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight text-white tracking-tight">
                  {carouselImages[currentSlide].subtitle}
                </h1>

                <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed max-w-2xl">
                  Trusted by businesses and individuals for premium quality products and exceptional service
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/category/gifts"
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                  >
                    Explore Products
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <a
                    href="#why-choose-us"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg font-semibold text-lg transition-all"
                  >
                    Learn More
                  </a>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Quality Assured</p>
                      <p className="text-gray-300 text-sm">Premium Products</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">5000+ Customers</p>
                      <p className="text-gray-300 text-sm">Satisfied Clients</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all z-10 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all z-10 group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentSlide 
                  ? "w-12 bg-white" 
                  : "w-8 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* FLASH SALES SECTION */}
      {flashSaleProducts.length > 0 && (
        <section className="py-16 px-6 bg-gradient-to-br from-red-600 to-orange-600">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-white mb-1">Flash Sales</h2>
                  <p className="text-white/90 text-lg">Limited time offers - Don't miss out!</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 px-4 md:px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Clock className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">Ends Soon</span>
                {flashCountdown && (
                  <span className="text-white/90 font-mono text-sm md:text-base">
                    {flashCountdown}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {flashSaleProducts.slice(0, 4).map((product, index) => (
                <div
                  key={product.id}
                  className="transform hover:scale-105 transition-transform duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {flashSaleProducts.length > 4 && (
              <div className="text-center mt-10">
                <Link
                  to="/category/gifts"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-red-600 rounded-lg font-bold hover:scale-105 transition-all shadow-xl"
                >
                  View All Flash Sales
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FEATURED PRODUCTS SECTION */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
              <Star className="w-4 h-4 text-blue-600" />
              <span className="text-blue-900 font-semibold text-sm">Featured Collection</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {search ? "Search Results" : "Premium Products"}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {search 
                ? "Find exactly what you're looking for" 
                : "Carefully curated selection of our finest offerings"}
            </p>

            {visibleProducts.length > 0 && (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full shadow-md mt-6 border border-gray-200">
                <Tag className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-gray-900">{visibleProducts.length}</span>
                <span className="text-gray-600">Products Available</span>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                <Package className="absolute inset-0 m-auto w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              <p className="text-gray-600 mt-6 text-lg font-medium">Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-32 px-6 bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="w-24 h-24 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
                <span className="text-5xl">⚠️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Unable to Load Products</h3>
              <p className="text-red-600 text-lg mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg"
              >
                Reload Page
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && visibleProducts.length === 0 && (
            <div className="text-center py-32 px-6 bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
                <span className="text-5xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Products Found</h3>
              <p className="text-gray-600 text-lg mb-8">
                We couldn't find any products matching your search
              </p>
              <Link
                to="/category/gifts"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg"
              >
                Browse All Products
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}

          {/* Products Grid */}
          {!loading && visibleProducts.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {visibleProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fadeInUp hover:scale-105 transition-transform duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* View All Button */}
              {!search && regularProducts.length > 8 && (
                <div className="text-center mt-16">
                  <Link
                    to="/category/gifts"
                    className="inline-flex items-center gap-3 px-10 py-5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-bold text-lg transition-all shadow-xl hover:scale-105"
                  >
                    View All Products
                    <ArrowRight className="w-6 h-6" />
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section id="why-choose-us" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-blue-900 font-semibold text-sm">Our Commitment</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the difference of working with a trusted partner
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                Icon: Truck, 
                title: "Fast Delivery", 
                desc: "Swift and reliable delivery to your doorstep",
                color: "bg-green-50 text-green-600",
                borderColor: "border-green-200"
              },
              { 
                Icon: Shield, 
                title: "Quality Guarantee", 
                desc: "100% authentic and premium products",
                color: "bg-blue-50 text-blue-600",
                borderColor: "border-blue-200"
              },
              { 
                Icon: Award, 
                title: "Secure Payment", 
                desc: "Multiple safe payment options available",
                color: "bg-purple-50 text-purple-600",
                borderColor: "border-purple-200"
              },
              { 
                Icon: MessageCircle, 
                title: "Expert Support", 
                desc: "Dedicated customer service team",
                color: "bg-orange-50 text-orange-600",
                borderColor: "border-orange-200"
              },
            ].map((feature, index) => {
              const IconComponent = feature.Icon;
              return (
                <div
                  key={feature.title}
                  className={`group p-8 rounded-2xl border-2 ${feature.borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white`}
                >
                  <div className={`w-16 h-16 mb-6 rounded-xl ${feature.color} flex items-center justify-center transform group-hover:scale-110 transition-all duration-300`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-8 mt-20 pt-16 border-t border-gray-200">
            {[
              { number: "5000+", label: "Happy Customers", Icon: Users },
              { number: "1000+", label: "Products Delivered", Icon: Package },
              { number: "99%", label: "Satisfaction Rate", Icon: Star }
            ].map((stat, index) => {
              const IconComponent = stat.Icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                  <p className="text-gray-600 text-lg">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-8">
            <TrendingUp className="w-4 h-4 text-white" />
            <span className="text-white font-semibold text-sm">Get Started Today</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Experience Premium Quality?
          </h2>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who trust us for their needs
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/category/gifts"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 rounded-lg font-bold text-lg hover:scale-105 transition-all shadow-2xl"
            >
              Browse Products
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <a
              href="/Contact"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg font-bold text-lg transition-all"
            >
              <MessageCircle className="w-6 h-6" />
              Contact Us
            </a>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 pt-12 border-t border-white/20">
            <div className="flex items-center gap-3 text-white/90">
              <Check className="w-5 h-5" />
              <span className="font-medium">Secure Checkout</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <Check className="w-5 h-5" />
              <span className="font-medium">Fast Delivery</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <Check className="w-5 h-5" />
              <span className="font-medium">Quality Guaranteed</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
