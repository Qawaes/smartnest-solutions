import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/products/ProductCard";
import { useSearch } from "../../context/SearchContext";
import { fetchProducts } from "../../services/api";
import { Sparkles, Gift, Home as HomeIcon, Palette, Truck, Shield, CreditCard, MessageCircle, ArrowRight, Star } from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { search, setSearch } = useSearch();
  const [heroVisible, setHeroVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

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

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      {/* HERO SECTION - Enhanced with 3D effects and animations */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzAtMS4xMDUtLjg5NS0yLTItMnMtMiAuODk1LTIgMiAuODk1IDIgMiAyIDItLjg5NSAyLTJ6bTAtMjBjMC0xLjEwNS0uODk1LTItMi0ycy0yIC44OTUtMiAyIC44OTUgMiAyIDIgMi0uODk1IDItMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-20 left-[10%] w-72 h-72 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
            style={{ transform: `translateY(${scrollY * 0.2}px)` }}
          />
          <div 
            className="absolute top-40 right-[10%] w-96 h-96 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          />
          <div 
            className="absolute -bottom-20 left-[30%] w-80 h-80 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"
            style={{ transform: `translateY(${scrollY * 0.15}px)` }}
          />
        </div>

        {/* Sparkle particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Hero content */}
        <div className="relative z-10 px-6 py-20 text-center max-w-6xl mx-auto">
          <div
            className={`transition-all duration-1000 ${
              heroVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl">
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
              <span className="text-white font-semibold text-sm">New Arrivals • Limited Edition</span>
            </div>

            {/* Main heading with gradient text */}
            <h1 className="text-5xl md:text-8xl font-black mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent drop-shadow-2xl">
                SmartNest
              </span>
              <span className="block bg-gradient-to-r from-pink-200 via-purple-200 to-white bg-clip-text text-transparent drop-shadow-2xl">
                Solutions
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-10 leading-relaxed">
              Transform your space with premium gifts, stylish home essentials, and custom branding solutions crafted for excellence
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to="/category/gifts"
                className="group relative px-10 py-5 bg-white text-gray-900 rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl shadow-xl"
              >
                <span className="relative z-10 flex items-center gap-2 justify-center">
                  Explore Collection
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <Link
                to="/category/custom-branding"
                className="group px-10 py-5 bg-white/10 backdrop-blur-xl text-white rounded-full font-bold text-lg border-2 border-white/20 transition-all hover:scale-105 hover:bg-white/20 hover:shadow-2xl shadow-xl"
              >
                <span className="flex items-center gap-2 justify-center">
                  <Palette className="w-5 h-5" />
                  Custom Branding
                </span>
              </Link>
            </div>

            {/* Stats with glass morphism */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto">
              {[
                { number: "500+", label: "Premium Products" },
                { number: "1000+", label: "Happy Customers" },
                { number: "24/7", label: "Support Available" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl hover:bg-white/20 transition-all hover:scale-105"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="text-3xl md:text-5xl font-black text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base text-purple-200">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION - Enhanced cards with 3D hover effects */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold text-sm">
              SHOP BY CATEGORY
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              Find Your Perfect Match
            </h2>
            <p className="text-gray-600 text-lg">Curated collections for every need</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: "Unique Gifts", 
                icon: Gift,
                color: "from-pink-500 via-rose-500 to-red-500", 
                link: "/category/gifts",
                desc: "Thoughtful presents for special moments"
              },
              { 
                name: "Home Essentials", 
                icon: HomeIcon,
                color: "from-blue-500 via-cyan-500 to-teal-500", 
                link: "/category/home-essentials",
                desc: "Elevate your living space"
              },
              { 
                name: "Custom Branding", 
                icon: Palette,
                color: "from-purple-500 via-indigo-500 to-blue-500", 
                link: "/category/custom-branding",
                desc: "Make your brand unforgettable"
              },
            ].map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.name}
                  to={category.link}
                  className="group relative overflow-hidden rounded-3xl bg-white p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Pattern overlay */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10">
                    {/* Icon with gradient background */}
                    <div className={`w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-white transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 group-hover:text-white/90 transition-colors mb-4">
                      {category.desc}
                    </p>
                    <div className="flex items-center text-gray-900 group-hover:text-white font-semibold transition-colors">
                      Shop Now 
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="inline-block mb-3 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full font-semibold text-sm">
                {search ? "SEARCH RESULTS" : "FEATURED COLLECTION"}
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-3 text-gray-900">
                {search ? `Results for "${search}"` : "Handpicked For You"}
              </h2>
              <p className="text-gray-600 text-lg">
                {search ? "Find what you're looking for" : "Discover our most loved products"}
              </p>
            </div>

            {filteredProducts.length > 0 && (
              <div className="hidden md:flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-full">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-gray-900">{filteredProducts.length}</span>
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
            <div className="text-center py-32 px-6">
              <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-5xl">😕</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Oops! Something went wrong</h3>
              <p className="text-red-500 text-lg mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-all hover:scale-105 shadow-lg"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-32 px-6">
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

          {!loading && filteredProducts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
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
        </div>
      </section>

      {/* FEATURES SECTION - Enhanced with icons and gradients */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900" />
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
        {/* Animated background patterns */}
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