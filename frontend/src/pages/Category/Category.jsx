import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/products/ProductCard";
import { fetchProductsByCategory } from "../../services/api";
import { useSearch } from "../../context/SearchContext";

export default function Category() {
  const { slug } = useParams();
  const { search } = useSearch();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 16;

  useEffect(() => {
    setLoading(true);
    setError("");

    fetchProductsByCategory(slug)
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    setPage(1);
  }, [slug, search]);

  const titleMap = {
    gifts: "Gifts",
    "home-essentials": "Home Essentials",
    "custom-branding": "Custom Branding",
  };

  const filteredProducts = products.filter((p) =>
    [p.name, p.description, p.category]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const visibleProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

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

      {!loading && !error && filteredProducts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {!loading && !error && filteredProducts.length > pageSize && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="px-4 py-2 rounded border text-sm font-semibold disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNumber = idx + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`w-10 h-10 rounded border text-sm font-semibold ${
                  pageNumber === safePage
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-800"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="px-4 py-2 rounded border text-sm font-semibold disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
