import { useEffect, useMemo, useState } from "react";
import { Package, Save, Search, Zap, TrendingDown, AlertCircle, X, Edit3, Check } from "lucide-react";
import { API_URL } from "../../../utils/apiHelper";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [edits, setEdits] = useState({});
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or table

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token") || localStorage.getItem("adminToken");
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`${API_URL}/api/products/admin`, {
          headers: {
            Authorization: `Bearer ${token || ""}`
          }
        }),
        fetch(`${API_URL}/api/categories/`)
      ]);

      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();

      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error("Inventory load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const categorySlugToId = useMemo(() => {
    const map = {};
    categories.forEach((c) => {
      map[c.slug] = c.id;
    });
    return map;
  }, [categories]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const getEditValue = (id, key, fallback) => {
    if (!edits[id]) return fallback;
    if (edits[id][key] === undefined) return fallback;
    return edits[id][key];
  };

  const getRemainingDuration = (product) => {
    if (!product.flash_sale_end) return { value: 0, unit: "hours" };
    const now = new Date();
    const end = new Date(product.flash_sale_end);
    const diffMs = end.getTime() - now.getTime();
    if (diffMs <= 0) return { value: 0, unit: "hours" };
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    if (diffHours >= 24 * 30) {
      return { value: Math.ceil(diffHours / (24 * 30)), unit: "months" };
    }
    if (diffHours >= 24 * 7) {
      return { value: Math.ceil(diffHours / (24 * 7)), unit: "weeks" };
    }
    if (diffHours >= 24) {
      return { value: Math.ceil(diffHours / 24), unit: "days" };
    }
    return { value: diffHours, unit: "hours" };
  };

  const updateEdit = (id, key, value) => {
    setEdits((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: value,
      },
    }));
  };

  const handleSave = async (product) => {
    try {
      setSavingId(product.id);
      const categoryId = categorySlugToId[product.category];
      if (!categoryId) {
        throw new Error("Missing category for this product");
      }
      const stockQuantity = Number(
        getEditValue(product.id, "stock_quantity", product.stock_quantity || 0)
      );
      const discountPercent = Number(
        getEditValue(product.id, "discount_percent", product.discount_percent || 0)
      );
      const flashSalePercent = Number(
        getEditValue(product.id, "flash_sale_percent", product.flash_sale_percent || 0)
      );
      const flashDurationValue = Number(
        getEditValue(product.id, "flash_duration_value", 0)
      );
      const flashDurationUnit = getEditValue(
        product.id,
        "flash_duration_unit",
        "hours"
      );

      let flash_sale_start = product.flash_sale_start;
      let flash_sale_end = product.flash_sale_end;
      if (flashSalePercent > 0 && flashDurationValue > 0) {
        const now = new Date();
        const end = new Date(now);
        const unit = flashDurationUnit;
        if (unit === "hours") end.setHours(end.getHours() + flashDurationValue);
        if (unit === "days") end.setDate(end.getDate() + flashDurationValue);
        if (unit === "weeks") end.setDate(end.getDate() + flashDurationValue * 7);
        if (unit === "months") end.setMonth(end.getMonth() + flashDurationValue);
        flash_sale_start = now.toISOString();
        flash_sale_end = end.toISOString();
      }
      if (flashSalePercent <= 0) {
        flash_sale_start = null;
        flash_sale_end = null;
      }

      const payload = {
        name: product.name,
        price: Number(product.price),
        category_id: categoryId,
        is_branding: product.is_branding,
        stock_quantity: stockQuantity,
        discount_percent: discountPercent,
        flash_sale_percent: flashSalePercent,
        flash_sale_start,
        flash_sale_end,
      };

      const res = await fetch(`${API_URL}/api/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token") || localStorage.getItem("adminToken") || ""}`
        },
        body: JSON.stringify(payload),
      });

      let updatedProduct = null;
      if (!res.ok) {
        try {
          const err = await res.json();
          throw new Error(err.error || "Failed to update product");
        } catch (e) {
          throw e;
        }
      } else {
        try {
          updatedProduct = await res.json();
        } catch {
          updatedProduct = null;
        }
      }

      const normalizedUpdated =
        updatedProduct?.product && updatedProduct.product.id
          ? updatedProduct.product
          : updatedProduct && updatedProduct.id
          ? updatedProduct
          : null;

      const optimisticUpdate = {
        ...product,
        stock_quantity: stockQuantity,
        discount_percent: discountPercent,
        flash_sale_percent: flashSalePercent,
        flash_sale_start,
        flash_sale_end,
        flash_sale_active:
          flashSalePercent > 0 &&
          flash_sale_end &&
          new Date(flash_sale_end).getTime() > Date.now(),
      };

      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, ...(normalizedUpdated || optimisticUpdate) } : p
        )
      );

      // Clear edits for this product
      setEdits((prev) => {
        const copy = { ...prev };
        delete copy[product.id];
        return copy;
      });
      
      setEditingProduct(null);
    } catch (error) {
      console.error("Inventory save error:", error);
      alert(error.message || "Failed to update inventory");
    } finally {
      setSavingId(null);
    }
  };

  const isFlashActive = (product) => {
    if (product.flash_sale_active) return true;
    if (!product.flash_sale_end) return false;
    const percent = Number(product.flash_sale_percent || 0);
    if (percent <= 0) return false;
    return new Date(product.flash_sale_end).getTime() > Date.now();
  };

  const EditModal = ({ product }) => {
    if (!product) return null;

    // Initialize edits for this product if not already done
    useEffect(() => {
      if (!edits[product.id]) {
        const remaining = getRemainingDuration(product);
        setEdits((prev) => ({
          ...prev,
          [product.id]: {
            stock_quantity: product.stock_quantity ?? 0,
            discount_percent: product.discount_percent ?? 0,
            flash_sale_percent: product.flash_sale_percent ?? 0,
            flash_duration_value: remaining.value,
            flash_duration_unit: remaining.unit,
          },
        }));
      }
    }, [product.id]);

    const stockQty = getEditValue(
      product.id,
      "stock_quantity",
      product.stock_quantity ?? 0
    );
    const discountPercent = getEditValue(
      product.id,
      "discount_percent",
      product.discount_percent ?? 0
    );
    const flashSalePercent = getEditValue(
      product.id,
      "flash_sale_percent",
      product.flash_sale_percent ?? 0
    );
    const flashDurationValue = getEditValue(
      product.id,
      "flash_duration_value",
      0
    );
    const flashDurationUnit = getEditValue(
      product.id,
      "flash_duration_unit",
      "hours"
    );

    const stockQtyNumber = Number(stockQty || 0);
    const discountPercentNumber = Number(discountPercent || 0);
    const flashSalePercentNumber = Number(flashSalePercent || 0);
    const flashDurationValueNumber = Number(flashDurationValue || 0);

    const discountedPrice =
      discountPercentNumber > 0
        ? Number(product.price) * (1 - discountPercentNumber / 100)
        : Number(product.price);
    const flashPrice =
      flashSalePercentNumber > 0
        ? Number(product.price) * (1 - flashSalePercentNumber / 100)
        : discountedPrice;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
                <p className="text-sm text-gray-500 mt-1">{product.name}</p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  // Clear edits when closing
                  setEdits((prev) => {
                    const copy = { ...prev };
                    delete copy[product.id];
                    return copy;
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Product Info */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Product Name</p>
                  <p className="font-semibold text-gray-900">{product.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Category</p>
                  <p className="font-semibold text-gray-900 capitalize">{product.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Original Price</p>
                  <p className="font-semibold text-gray-900">KES {Number(product.price).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Final Price</p>
                  <p className="font-semibold text-green-600 text-lg">KES {flashPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                value={stockQty}
                onChange={(e) => updateEdit(product.id, "stock_quantity", e.target.value)}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter stock quantity"
              />
              <p className="text-sm text-gray-500 mt-2">
                Current status: {stockQtyNumber > 0 ? (
                  <span className="text-green-600 font-medium">In Stock ({stockQtyNumber} units)</span>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </p>
            </div>

            {/* Regular Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Regular Discount (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={discountPercent}
                onChange={(e) => updateEdit(product.id, "discount_percent", e.target.value)}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter discount percentage"
              />
              {discountPercentNumber > 0 && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Discounted Price: <span className="font-bold">KES {discountedPrice.toLocaleString()}</span>
                    <span className="text-blue-600 ml-2">({discountPercentNumber}% off)</span>
                  </p>
                </div>
              )}
            </div>

            {/* Flash Sale Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="text-orange-500" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Flash Sale Settings</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Flash Sale Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={flashSalePercent}
                    onChange={(e) => updateEdit(product.id, "flash_sale_percent", e.target.value)}
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    placeholder="Enter flash sale percentage"
                  />
                  {flashSalePercentNumber > 0 && (
                    <div className="mt-2 p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-700">
                        Flash Sale Price: <span className="font-bold">KES {flashPrice.toLocaleString()}</span>
                        <span className="text-orange-600 ml-2">({flashSalePercentNumber}% off)</span>
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Flash Sale Duration
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="number"
                        min="0"
                        value={flashDurationValue}
                        onChange={(e) => updateEdit(product.id, "flash_duration_value", e.target.value)}
                        placeholder="Duration"
                        className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <select
                        value={flashDurationUnit}
                        onChange={(e) => updateEdit(product.id, "flash_duration_unit", e.target.value)}
                        className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
                      >
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                      </select>
                    </div>
                  </div>
                  {flashDurationValueNumber > 0 && flashSalePercentNumber > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      Flash sale will run for {flashDurationValue} {flashDurationUnit}
                    </p>
                  )}
                  {product.flash_sale_end && (
                    <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        Current flash sale ends: <span className="font-medium">{new Date(product.flash_sale_end).toLocaleString()}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-2xl">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditingProduct(null);
                  // Clear edits when canceling
                  setEdits((prev) => {
                    const copy = { ...prev };
                    delete copy[product.id];
                    return copy;
                  });
                }}
                className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(product)}
                disabled={savingId === product.id}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              >
                {savingId === product.id ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProductCard = ({ product }) => {
    const stockQty = Number(product.stock_quantity || 0);
    const discountPercent = Number(product.discount_percent || 0);
    const flashSalePercent = Number(product.flash_sale_percent || 0);
    const discountedPrice =
      discountPercent > 0
        ? Number(product.price) * (1 - discountPercent / 100)
        : Number(product.price);
    const flashPrice =
      flashSalePercent > 0
        ? Number(product.price) * (1 - flashSalePercent / 100)
        : discountedPrice;

    return (
      <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all overflow-hidden group">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{product.name}</h3>
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                {product.category}
              </span>
            </div>
            <button
              onClick={() => setEditingProduct(product.id)}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit3 size={16} className="text-blue-600" />
            </button>
          </div>

          {/* Pricing */}
          <div className="mb-3">
            <div className="flex items-baseline gap-2 mb-1">
              {(discountPercent > 0 || flashSalePercent > 0) && (
                <span className="text-xs text-gray-400 line-through">KES {Number(product.price).toLocaleString()}</span>
              )}
              <span className="text-lg font-bold text-gray-900">KES {flashPrice.toLocaleString()}</span>
            </div>
            {(discountPercent > 0 || flashSalePercent > 0) && (
              <div className="flex gap-1">
                {discountPercent > 0 && (
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                    -{discountPercent}%
                  </span>
                )}
                {flashSalePercent > 0 && (
                  <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full font-medium flex items-center gap-1">
                    <Zap size={10} /> -{flashSalePercent}%
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className="mb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Stock</span>
              {stockQty > 0 ? (
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                  {stockQty} units
                </span>
              ) : (
                <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium flex items-center gap-1">
                  <AlertCircle size={10} /> Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Flash Sale Info */}
          {isFlashActive(product) && (
            <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <Zap size={10} className="text-orange-600" />
              Ends: {new Date(product.flash_sale_end).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = {
    total: products.length,
    inStock: products.filter(p => p.stock_quantity > 0).length,
    outOfStock: products.filter(p => p.stock_quantity === 0).length,
    flashActive: products.filter((p) => isFlashActive(p)).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Inventory</h1>
            <p className="text-sm text-gray-500 mt-1">Manage stock and pricing</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Check size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">In Stock</p>
                <p className="text-xl font-bold text-gray-900">{stats.inStock}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Out</p>
                <p className="text-xl font-bold text-gray-900">{stats.outOfStock}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Zap size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Flash</p>
                <p className="text-xl font-bold text-gray-900">{stats.flashActive}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
          />
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Package size={48} className="text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No products found</h3>
          <p className="text-sm text-gray-500">Try adjusting your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <EditModal product={products.find(p => p.id === editingProduct)} />
      )}
    </div>
  );
}