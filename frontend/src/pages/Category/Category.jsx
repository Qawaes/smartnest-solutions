import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/products/ProductCard";
import { fetchProductsByCategory, fetchProductsByCategoryPaged } from "../../services/api";
import { useSearch } from "../../context/SearchContext";

export default function Category() {
  const { slug } = useParams();
  const { search } = useSearch();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 16;
  const [serverTotalPages, setServerTotalPages] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [slug, search]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");

    const load = async () => {
      try {
        if (search) {
          const data = await fetchProductsByCategory(slug);
          if (!isMounted) return;
          setProducts(Array.isArray(data) ? data : []);
          setServerTotalPages(1);
        } else {
          const data = await fetchProductsByCategoryPaged(slug, { page, perPage: pageSize });
          if (!isMounted) return;
          if (Array.isArray(data)) {
            setProducts(data);
            setServerTotalPages(1);
          } else {
            setProducts(Array.isArray(data.items) ? data.items : []);
            const totalPages = data.total_pages || 1;
            setServerTotalPages(totalPages);
            if (page > totalPages) {
              setPage(totalPages);
            }
          }
        }
      } catch {
        if (!isMounted) return;
        setError("Failed to load products");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [slug, page, search]);

  const titleMap = {
    gifts: "Gifts",
    "home-essentials": "Home Essentials",
    "custom-branding": "Custom Branding",
  };

  const isSearchActive = search.trim().length > 0;

  const filteredProducts = isSearchActive
    ? products.filter((p) =>
        [p.name, p.description, p.category]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : products;

  const totalPages = isSearchActive
    ? Math.max(1, Math.ceil(filteredProducts.length / pageSize))
    : Math.max(1, serverTotalPages);
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const visibleProducts = isSearchActive
    ? filteredProducts.slice(startIndex, startIndex + pageSize)
    : filteredProducts;

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

      {!loading && !error && filteredProducts.length === 0 && (
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

      {!loading && !error && totalPages > 1 && (
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
