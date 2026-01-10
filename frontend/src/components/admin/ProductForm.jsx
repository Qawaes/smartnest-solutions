import { useEffect, useState } from "react";

export default function ProductForm({
  initialData = null,
  categories = [],
  onSubmit,
  onCancel,
}) {
  /* ================= STATE ================= */
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    is_branding: false,
  });

  const [existingImages, setExistingImages] = useState([]); // from backend
  const [images, setImages] = useState([]);                 // new File[]
  const [previews, setPreviews] = useState([]);             // preview URLs

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ================= PREFILL ON EDIT ================= */
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        category_id: initialData.category?.id || "",
        is_branding: initialData.is_branding || false,
      });

      setExistingImages(initialData.images || []);
    } else {
      setExistingImages([]);
    }
  }, [initialData]);

  /* ================= CLEAN UP PREVIEWS ================= */
  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ================= IMAGE HANDLING ================= */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages(prev => [...prev, ...files]);
    setPreviews(prev => [
      ...prev,
      ...files.map(file => URL.createObjectURL(file)),
    ]);

    e.target.value = "";
  };

  const removeNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  /* ================= DELETE EXISTING IMAGE ================= */
  const handleDeleteImage = async (imageId) => {
    if (!confirm("Delete this image?")) return;

    await fetch(
      `http://127.0.0.1:5000/api/products/images/${imageId}`,
      { method: "DELETE" }
    );

    setExistingImages(prev =>
      prev.filter(img => img.id !== imageId)
    );
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.name || !form.price || !form.category_id) {
      setMessage("❌ Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      /* 1️⃣ CREATE OR UPDATE PRODUCT */
      const product = await onSubmit({
        ...form,
        price: Number(form.price),
      });

      /* 2️⃣ UPLOAD NEW IMAGES */
      if (images.length > 0 && product?.id) {
        const data = new FormData();
        images.forEach(file => data.append("images", file));

        const imgRes = await fetch(
          `http://127.0.0.1:5000/api/products/${product.id}/images`,
          {
            method: "POST",
            body: data,
          }
        );

        const uploadedImages = await imgRes.json();

        // ✅ update UI immediately
        setExistingImages(prev => [...prev, ...uploadedImages]);
        setImages([]);
        setPreviews([]);
      }

      setMessage(
        initialData
          ? "✅ Product updated successfully!"
          : "✅ Product created successfully!"
      );

      if (!initialData) {
        setForm({
          name: "",
          description: "",
          price: "",
          category_id: "",
          is_branding: false,
        });
      }

     setTimeout(() =>{
      onCancel();
     }, 800);
      
    } catch (err) {
      setMessage("❌ Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">
        {initialData ? "Edit Product" : "Add Product"}
      </h1>

      {message && (
        <div className="mb-4 text-sm">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name *"
          className="input"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Product Description"
          className="input h-24"
        />

        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price (KES) *"
          className="input"
        />

        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          className="input"
        >
          <option value="">Select Category *</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_branding"
            checked={form.is_branding}
            onChange={handleChange}
          />
          This is a branding product
        </label>

        {/* EXISTING IMAGES */}
        {existingImages.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">
              Existing Images
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {existingImages.map(img => (
                <div key={img.id} className="relative border rounded p-2">
                  <img
                    src={img.image_url}
                    alt="product"
                    className="h-32 w-full object-cover rounded"
                  />

                  {img.is_primary && (
                    <span className="absolute top-1 left-1 bg-black text-white text-xs px-2 py-1 rounded">
                      Primary
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADD NEW IMAGES */}
        <div className="mt-4">
          <label className="block text-sm mb-1">
            {initialData ? "Add More Images" : "Product Images"}
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* NEW IMAGE PREVIEWS */}
        {previews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {previews.map((src, index) => (
              <div key={index} className="relative border rounded p-2">
                <img
                  src={src}
                  alt="preview"
                  className="h-32 w-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : initialData
                ? "Update Product"
                : "Create Product"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="border px-6 py-3 rounded"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
}
