import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/products/ProductCard";
import { fetchProductsByCategory } from "../../services/api";
import { useSearch } from "../../context/SearchContext";

export default function Category() {
  const { slug } = useParams();
  const searchContext = useSearch(); // SAFE access

  const setSearch =
    typeof searchContext === "object"
      ? searchContext.setSearch
      : null;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // ✅ reset search ONLY if setter exists
    if (typeof setSearch === "function") {
      setSearch("");
    }

    setLoading(true);
    setError("");

    fetchProductsByCategory(slug)
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, [slug, setSearch]);

  const titleMap = {
    gifts: "Gifts",
    "home-essentials": "Home Essentials",
    "custom-branding": "Custom Branding",
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-semibold">
        {titleMap[slug] || "Products"}
      </h1>

      {loading && (
        <p className="text-center text-gray-500">Loading products...</p>
      )}

      {error && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="text-center text-gray-500">
          No products found in this category
        </p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
