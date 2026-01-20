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

      setTimeout(() => {
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        {initialData ? "Edit Product" : "Add New Product"}
      </h1>

      {message && (
        <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${
          message.includes("✅") 
            ? "bg-green-50 text-green-800 border border-green-200" 
            : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-6">

        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (KES) <span className="text-red-500">*</span>
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition bg-white"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
            <input
              type="checkbox"
              name="is_branding"
              checked={form.is_branding}
              onChange={handleChange}
              className="w-5 h-5 text-black border-gray-300 rounded focus:ring-2 focus:ring-black"
            />
            <span className="text-sm font-medium text-gray-700">
              This is a branding product
            </span>
          </label>
        </div>

        {/* EXISTING IMAGES */}
        {existingImages.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Current Images ({existingImages.length})
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {existingImages.map(img => (
                <div key={img.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-400 transition">
                    <img
                      src={img.image_url}
                      alt="product"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {img.is_primary && (
                    <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-md font-medium shadow-lg">
                      Primary
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADD NEW IMAGES */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {initialData ? "Add More Images" : "Product Images"}
          </h2>
          
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mb-2 text-sm text-gray-600 font-medium">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {/* NEW IMAGE PREVIEWS */}
          {previews.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                New Images to Upload ({previews.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {previews.map((src, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-blue-200 hover:border-blue-400 transition">
                      <img
                        src={src}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-md font-medium shadow-lg">
                      New
                    </span>
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 sm:flex-none bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm hover:shadow-md"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            ) : (
              initialData ? "Update Product" : "Create Product"
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="flex-1 sm:flex-none border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}