import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/products/ProductCard";
import { useSearch } from "../../context/SearchContext";
import { fetchProducts } from "../../services/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { search, setSearch } = useSearch();
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    // Trigger hero animation
    setTimeout(() => setHeroVisible(true), 100);

    fetchProducts()
      .then((data) => setProducts(data))
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-20">
      {/* HERO SECTION - Animated with gradient background */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 -z-10" />
        
        {/* Animated blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute top-0 left-20 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-40 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />

        {/* Content */}
        <div
          className={`relative px-8 py-20 md:py-32 transition-all duration-1000 ${
            heroVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                ✨ New Arrivals Available
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent leading-tight">
              SmartNest Solutions
            </h1>

            <p className="text-lg md:text-2xl text-gray-600 max-w-2xl mx-auto">
              Discover unique gifts, premium home essentials, and custom
              branding solutions for every occasion
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link
                to="/category/gifts"
                className="group relative px-8 py-4 bg-black text-white rounded-full font-semibold overflow-hidden transition-all hover:scale-105 hover:shadow-xl"
              >
                <span className="relative z-10">Shop Collection</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>

              <Link
                to="/category/custom-branding"
                className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold border-2 border-gray-200 hover:border-gray-900 transition-all hover:scale-105 hover:shadow-xl"
              >
                Custom Branding
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12">
              <div className="space-y-1">
                <div className="text-3xl md:text-4xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl md:text-4xl font-bold text-gray-900">1000+</div>
                <div className="text-sm text-gray-600">Happy Clients</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl md:text-4xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600">Find exactly what you're looking for</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Gifts",  color: "from-pink-500 to-rose-500", link: "/category/gifts" },
              { name: "Home Essentials", color: "from-blue-500 to-cyan-500", link: "/category/home-essentials" },
              { name: "Custom Branding",  color: "from-purple-500 to-indigo-500", link: "/category/custom-branding" },
            ].map((category, index) => (
              <Link
                key={category.name}
                to={category.link}
                className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                
                <div className="relative z-10">
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-gray-600 group-hover:text-gray-900 transition-colors">
                    Explore collection →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                {search ? "Search Results" : "Featured Products"}
              </h2>
              <p className="text-gray-600">
                {search ? `Showing results for "${search}"` : "Handpicked just for you"}
              </p>
            </div>

            {filteredProducts.length > 0 && (
              <div className="text-sm text-gray-500">
                {filteredProducts.length} products
              </div>
            )}
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
              <p className="text-gray-500 mt-4">Loading products...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">😕</div>
              <p className="text-red-500 text-lg">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg mb-2">No products found</p>
              <p className="text-gray-400 text-sm">
                Try adjusting your search or browse our categories
              </p>
            </div>
          )}

          {!loading && filteredProducts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="px-4 py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: "🚚", title: "Free Delivery", desc: "On orders over KES 5,000" },
              { icon: "💯", title: "Quality Guaranteed", desc: "Premium products only" },
              { icon: "🔒", title: "Secure Payment", desc: "M-Pesa & Bank Transfer" },
              { icon: "💬", title: "24/7 Support", desc: "Always here to help" },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="text-center p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}