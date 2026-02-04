import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/products/ProductCard";
import { useSearch } from "../../context/SearchContext";
import { fetchProducts } from "../../services/api";
import { 
  Sparkles, Gift, Home as HomeIcon, Palette, Truck, Shield, CreditCard, 
  MessageCircle, ArrowRight, Star, Zap, Clock, ChevronLeft, ChevronRight,
  TrendingUp, Tag
} from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { search, setSearch } = useSearch();
  const [heroVisible, setHeroVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel images - you can replace these with your actual images
  const carouselImages = [
    {
      url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200",
      title: "Premium Gift Collection",
      subtitle: "Perfect presents for every occasion"
    },
    {
      url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200",
      title: "Home Essentials",
      subtitle: "Transform your living space"
    },
    {
      url: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200",
      title: "Custom Branding Solutions",
      subtitle: "Stand out with personalized products"
    },
    {
      url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
      title: "Limited Edition Items",
      subtitle: "Exclusive products just for you"
    }
  ];

  useEffect(() => {
    // Trigger hero animation
    setTimeout(() => setHeroVisible(true), 10);

    fetchProducts()
      .then((data) => setProducts(data))
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));

    // Parallax effect
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const filteredProducts = products.filter((p) =>
    [p.name, p.description, p.category]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Separate products by type
  const flashSaleProducts = filteredProducts.filter(p => p.flash_sale_active);
  const regularProducts = filteredProducts.filter(p => !p.flash_sale_active);
  const visibleProducts = search ? filteredProducts : regularProducts.slice(0, 8);

  return (
    <div className="relative bg-gray-50">
      
      {/* IMAGE CAROUSEL SECTION */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
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
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
            </div>
          ))}
        </div>

        {/* Carousel Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-2xl">
              <div
                className={`transition-all duration-1000 delay-300 ${
                  heroVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                }`}
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                  <span className="text-white font-semibold text-sm">
                    {carouselImages[currentSlide].title}
                  </span>
                </div>

                {/* Main heading */}
                <h1 className="text-4xl md:text-7xl font-black mb-6 leading-tight text-white">
                  {carouselImages[currentSlide].subtitle}
                </h1>

                <p className="text-lg md:text-xl text-gray-200 mb-8">
                  Discover premium quality products crafted with excellence
                </p>

                {/* CTA Button */}
                <Link
                  to="/category/gifts"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-2xl"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full transition-all z-10 border border-white/20"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full transition-all z-10 border border-white/20"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide 
                  ? "w-8 bg-white" 
                  : "w-2 bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </section>

      {/* FLASH SALES SECTION */}
      {flashSaleProducts.length > 0 && (
        <section className="relative py-16 px-6 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-300 rounded-full filter blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse animation-delay-2000" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                  <Zap className="w-8 h-8 text-white animate-pulse" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-1">
                    ⚡ Flash Sales
                  </h2>
                  <p className="text-white/90 text-lg">Limited time offers - Grab them fast!</p>
                </div>
              </div>

              {/* Timer */}
              <div className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                <Clock className="w-5 h-5 text-white" />
                <span className="text-white font-bold">Ending Soon</span>
              </div>
            </div>

            {/* Flash Sale Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {flashSaleProducts.slice(0, 4).map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative">
                    {/* Flash Sale Badge */}
                    <div className="absolute -top-2 -right-2 z-10 px-3 py-1 bg-yellow-400 text-gray-900 font-black text-sm rounded-full shadow-lg animate-bounce">
                      FLASH!
                    </div>
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>

            {/* View All Flash Sales */}
            {flashSaleProducts.length > 4 && (
              <div className="text-center mt-8">
                <Link
                  to="/category/gifts?filter=flash"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-2xl"
                >
                  View All Flash Sales
                  <TrendingUp className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CATEGORIES SECTION */}
      <section className="relative py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold text-sm">
              Shop by Category
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Explore Our Collections
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Find the perfect items for every need
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                Icon: Gift, 
                title: "Gifts", 
                desc: "Perfect presents for loved ones",
                link: "/category/gifts",
                color: "from-pink-500 to-rose-600",
                bgColor: "bg-pink-50"
              },
              { 
                Icon: HomeIcon, 
                title: "Home Essentials", 
                desc: "Stylish items for your space",
                link: "/category/home-essentials",
                color: "from-blue-500 to-cyan-600",
                bgColor: "bg-blue-50"
              },
              { 
                Icon: Palette, 
                title: "Custom Branding", 
                desc: "Personalized products",
                link: "/category/custom-branding",
                color: "from-purple-500 to-indigo-600",
                bgColor: "bg-purple-50"
              },
            ].map((category, index) => {
              const IconComponent = category.Icon;
              return (
                <Link
                  key={category.title}
                  to={category.link}
                  className="group relative p-8 bg-white rounded-3xl border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                >
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 mb-6 rounded-2xl ${category.bgColor} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <IconComponent className={`w-8 h-8 bg-gradient-to-br ${category.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
                    </div>
                    <h3 className="font-bold text-2xl mb-3 text-gray-900 group-hover:text-purple-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{category.desc}</p>
                    <div className="flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-4 transition-all">
                      Explore
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600 text-lg">
                {search ? "Find what you're looking for" : "Discover our most loved products"}
              </p>
            </div>

            {visibleProducts.length > 0 && (
              <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md border border-gray-200">
                <Tag className="w-5 h-5 text-purple-600" />
                <span className="font-bold text-gray-900">{visibleProducts.length}</span>
                <span className="text-gray-600">Products</span>
              </div>
            )}
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-purple-600 animate-pulse" />
                </div>
              </div>
              <p className="text-gray-600 mt-6 text-lg font-medium">Loading amazing products...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-32 px-6 bg-white rounded-3xl shadow-lg">
              <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-5xl">😕</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Oops! Something went wrong</h3>
              <p className="text-red-500 text-lg mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-all hover:scale-105 shadow-lg"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && visibleProducts.length === 0 && (
            <div className="text-center py-32 px-6 bg-white rounded-3xl shadow-lg">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-5xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
              <p className="text-gray-500 text-lg mb-6">
                Try adjusting your search or explore our categories
              </p>
              <Link
                to="/category/gifts"
                className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-all hover:scale-105 shadow-lg"
              >
                Browse All Products
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}

          {!loading && visibleProducts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
          )}

          {/* View More Button */}
          {!search && regularProducts.length > 8 && (
            <div className="text-center mt-12">
              <Link
                to="/category/gifts"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:scale-105 transition-all shadow-xl"
              >
                View All Products
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="relative py-24 px-6 overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE0YzAtMS4xMDUtLjg5NS0yLTItMnMtMiAuODk1LTIgMiAuODk1IDIgMiAyIDItLjg5NSAyLTJ6bTAtMjBjMC0xLjEwNS0uODk1LTItMi0ycy0yIC44OTUtMiAyIC44OTUgMiAyIDIgMi0uODk1IDItMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Why Choose SmartNest?
            </h2>
            <p className="text-purple-200 text-lg">
              Experience excellence in every interaction
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { 
                Icon: Truck, 
                title: "Free Delivery", 
                desc: "On orders over KES 5,000",
                color: "from-green-400 to-emerald-600"
              },
              { 
                Icon: Shield, 
                title: "Quality Guaranteed", 
                desc: "Premium products only",
                color: "from-blue-400 to-indigo-600"
              },
              { 
                Icon: CreditCard, 
                title: "Secure Payment", 
                desc: "M-Pesa & Bank Transfer",
                color: "from-purple-400 to-pink-600"
              },
              { 
                Icon: MessageCircle, 
                title: "24/7 Support", 
                desc: "Always here to help",
                color: "from-orange-400 to-red-600"
              },
            ].map((feature, index) => {
              const IconComponent = feature.Icon;
              return (
                <div
                  key={feature.title}
                  className="group text-center p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2"
                >
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-white">{feature.title}</h3>
                  <p className="text-purple-200">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-24 px-6 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse animation-delay-2000" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-6 text-white animate-pulse" />
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers who've discovered the perfect blend of style and functionality
          </p>
          <Link
            to="/category/gifts"
            className="inline-flex items-center gap-3 px-12 py-6 bg-white text-purple-600 rounded-full font-black text-lg hover:scale-105 transition-all shadow-2xl hover:shadow-3xl"
          >
            Start Shopping Now
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
}