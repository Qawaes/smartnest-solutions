import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Upload, X, Tag, DollarSign, Image } from 'lucide-react';

import { API_URL } from '../../../utils/apiHelper';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    is_branding: false,
    stock_quantity: '',
    discount_percent: ''
  });
  const [productImages, setProductImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter]);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`${API_URL}/api/products`),
        fetch(`${API_URL}/api/categories/`)
      ]);
      
      if (!productsRes.ok || !categoriesRes.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      
      console.log('Categories loaded:', categoriesData);
      
      setProducts(productsData);
      setCategories(categoriesData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load data. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleNewImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    const imagePreviewsWithFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));

    setNewImages(prev => [...prev, ...imagePreviewsWithFiles]);
  };

  const handleRemoveNewImage = (imageId) => {
    setNewImages(prev => {
      const updated = prev.filter(img => img.id !== imageId);
      const removed = prev.find(img => img.id === imageId);
      if (removed) {
        URL.revokeObjectURL(removed.preview);
      }
      return updated;
    });
  };

  const handleImageUpload = async (e, productId) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);

    try {
      const uploadFormData = new FormData();
      for (let i = 0; i < files.length; i++) {
        uploadFormData.append('images', files[i]);
      }

      const response = await fetch(`${API_URL}/api/products/${productId}/images`, { // ✅ Dynamic URL
        method: 'POST',
        body: uploadFormData
      });

      if (response.ok) {
        await fetchData();
        if (editingProduct) {
          const updatedProduct = products.find(p => p.id === productId);
          if (updatedProduct) {
            setProductImages(updatedProduct.images || []);
          }
        }
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDeleteImage = async (imageId, productId) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`${API_URL}/api/products/images/${imageId}`, { // ✅ Dynamic URL
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchData();
        if (editingProduct) {
          setProductImages(prev => prev.filter(img => img.id !== imageId));
        }
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category_id) {
      alert('Please select a category');
      return;
    }
    
    try {
     const url = editingProduct
     ? `${API_URL}/api/products/${editingProduct.id}` // ✅ CORRECT
     : `${API_URL}/api/products`; // ✅ CORRECT
      
      const method = editingProduct ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        price: Number(formData.price),
        stock_quantity: Number(formData.stock_quantity || 0),
        discount_percent: Number(formData.discount_percent || 0)
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const savedProduct = await response.json();
        
        if (!editingProduct && newImages.length > 0) {
          const uploadFormData = new FormData();
          newImages.forEach(img => {
            uploadFormData.append('images', img.file);
          });

          await fetch(`${API_URL}/api/products/${savedProduct.id}/images`, { // ✅ Dynamic URL
            method: 'POST',
            body: uploadFormData
          });
        }
        
        await fetchData();
        closeModal();
      } else {
        const error = await response.json();
        alert(`Failed to save product: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await fetch(`${API_URL}/api/products/${id}`, { // ✅ Dynamic URL
        method: 'DELETE'
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setProductImages([]);
    setNewImages([]);
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      is_branding: false,
      stock_quantity: '',
      discount_percent: ''
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setProductImages(product.images || []);
    setNewImages([]);
    const categoryMatch = categories.find(c => c.slug === product.category);
    
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category_id: categoryMatch?.id || '',
      is_branding: product.is_branding,
      stock_quantity: product.stock_quantity ?? '',
      discount_percent: product.discount_percent ?? ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    newImages.forEach(img => URL.revokeObjectURL(img.preview));
    setShowModal(false);
    setEditingProduct(null);
    setProductImages([]);
    setNewImages([]);
  };

  const getPrimaryImage = (product) => {
    if (!product.images || product.images.length === 0) return null;
    const primary = product.images.find(img => img.is_primary);
    return primary ? primary.image_url : product.images[0].image_url;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product catalog</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 font-medium"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="px-4 py-2 bg-blue-50 rounded-lg">
          <span className="text-sm text-blue-700 font-medium">
            Total Products: {products.length}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer transition-all"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Image size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">
            {searchTerm || categoryFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Get started by adding your first product'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              <div className="relative aspect-square bg-gray-100">
                {getPrimaryImage(product) ? (
                  <img
                    src={getPrimaryImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image size={48} className="text-gray-300" />
                  </div>
                )}
                {product.is_branding && (
                  <span className="absolute top-3 right-3 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                    Branding
                  </span>
                )}
                {product.discount_percent > 0 && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full">
                    -{product.discount_percent}%
                  </span>
                )}
              </div>
              
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
                    {product.name}
                  </h3>
                </div>
                
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {product.description || 'No description available'}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    KSh {parseFloat(product.discounted_price ?? product.price).toLocaleString()}
                  </span>
                  {product.discount_percent > 0 && (
                    <span className="text-sm text-gray-500 line-through">
                      KSh {parseFloat(product.price).toLocaleString()}
                    </span>
                  )}
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full capitalize">
                    {product.category}
                  </span>
                </div>

                <div className="mb-4 text-sm text-gray-600">
                  Stock: {product.stock_quantity ?? 0}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal code remains the same - just showing it's there */}
     {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        <button
          onClick={closeModal}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="4"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            placeholder="Enter product description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (KSh) *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="number"
                required
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              required
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer bg-white"
            >
              <option value="">Select category</option>
              {categories.length > 0 ? (
                categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>No categories available</option>
              )}
            </select>
            {categories.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                Please add categories first before creating products
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity
            </label>
            <input
              type="number"
              min="0"
              value={formData.stock_quantity}
              onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Percent
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.discount_percent}
              onChange={(e) => setFormData({ ...formData, discount_percent: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_branding"
            checked={formData.is_branding}
            onChange={(e) => setFormData({ ...formData, is_branding: e.target.checked })}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="is_branding" className="text-sm font-medium text-gray-700">
            This is a branding product
          </label>
        </div>

        {/* Image Upload Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
            <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer font-medium">
              <Upload size={18} />
              {editingProduct ? 'Upload More Images' : 'Add Images'}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={editingProduct ? (e) => handleImageUpload(e, editingProduct.id) : handleNewImageSelect}
                className="hidden"
                disabled={uploadingImages}
              />
            </label>
          </div>

          {uploadingImages && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-500 mt-2">Uploading images...</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Show existing images when editing */}
            {editingProduct && productImages.map((image, index) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.image_url}
                  alt={`Product ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-lg border-2 border-gray-200"
                />
                {image.is_primary && (
                  <span className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">
                    Primary
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteImage(image.id, editingProduct.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ))}

            {/* Show preview images when creating */}
            {!editingProduct && newImages.map((image, index) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveNewImage(image.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            
            {/* Empty state */}
            {!editingProduct && newImages.length === 0 && !uploadingImages && (
              <div className="col-span-2 md:col-span-4 text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Image size={48} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No images selected</p>
                <p className="text-xs text-gray-400 mt-1">Click "Add Images" to upload</p>
              </div>
            )}

            {editingProduct && productImages.length === 0 && !uploadingImages && (
              <div className="col-span-2 md:col-span-4 text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Image size={48} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No images uploaded yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 pt-4 flex gap-3">
          <button
            type="button"
            onClick={closeModal}
            className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
          >
            {editingProduct ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}
