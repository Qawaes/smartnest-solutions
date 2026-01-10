import { useEffect, useState } from "react";
import ProductForm from "../../components/admin/ProductForm";
import { fetchProducts, fetchCategories } from "../../services/api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    document.body.style.overflow = showForm ? "hidden" : "auto";
  }, [showForm]);

  const loadData = async () => {
    const [p, c] = await Promise.all([
      fetchProducts(),
      fetchCategories(),
    ]);
    setProducts(p);
    setCategories(c);
  };

  /* ================= SAVE PRODUCT ================= */
  const saveProduct = async (data) => {
    const url = editingProduct
      ? `http://127.0.0.1:5000/api/products/${editingProduct.id}`
      : "http://127.0.0.1:5000/api/products";

    const res = await fetch(url, {
      method: editingProduct ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const savedProduct = await res.json();

    loadData();
    return savedProduct;
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;

    await fetch(`http://127.0.0.1:5000/api/products/${id}`, {
      method: "DELETE",
    });

    loadData();
  };

  const getProductImage = (product) => {
    if (!product.images || product.images.length === 0) {
      return "https://via.placeholder.com/400x300?text=No+Image";
    }
    const primary = product.images.find(img => img.is_primary);
    return (primary || product.images[0]).image_url;
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto">
          <div className="min-h-screen flex items-start justify-center py-10">
            <div className="bg-white w-full max-w-3xl rounded shadow-lg p-6 relative">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
              >
                ✕
              </button>

              <ProductForm
                initialData={editingProduct}
                categories={categories}
                onSubmit={saveProduct}
                onCancel={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded shadow hover:shadow-lg transition overflow-hidden">
            <div className="h-48 bg-gray-100">
              <img
                src={getProductImage(p)}
                alt={p.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-4 space-y-1">
              <h2 className="text-lg font-semibold">{p.name}</h2>

              <p className="text-sm text-gray-500">
                Category: <span className="font-medium">{p.category || "Uncategorized"}</span>
              </p>

              <p className="font-semibold">KES {p.price}</p>
              <p className="text-sm text-gray-700">{p.description}</p>
            </div>

            <div className="flex justify-between items-center p-4 border-t">
              <button
                onClick={() => {
                  setEditingProduct(p);
                  setShowForm(true);
                }}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>

              <button
                onClick={() => deleteProduct(p.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
