import { useState, useEffect } from 'react';
import { Search, Eye, Calendar, Palette, FileText, Phone, Mail } from 'lucide-react';

export default function BrandingRequestsPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBrandingRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [orders, searchTerm]);

  const fetchBrandingRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders');
      const data = await response.json();
      const brandingOrders = data.filter(order => order.branding !== null);
      setOrders(brandingOrders);
      setFilteredOrders(brandingOrders);
    } catch (error) {
      console.error('Error fetching branding requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.phone.includes(searchTerm) ||
        order.id.toString().includes(searchTerm)
      );
    }

    setFilteredOrders(filtered);
  };

  const viewDetails = (order) => {
    setSelectedRequest(order);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Branding Requests</h1>
          <p className="text-gray-500 mt-1">Manage custom branding orders</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-purple-50 rounded-lg">
            <span className="text-sm text-purple-600 font-medium">
              {filteredOrders.length} Requests
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by customer name, phone, or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <Palette size={20} />
                  <span className="font-semibold">Order #{order.id}</span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm">
                  {order.status}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{order.customer.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <Phone size={14} />
                    {order.customer.phone}
                  </p>
                  {order.customer.email && (
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Mail size={14} />
                      {order.customer.email}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    KSh {parseFloat(order.total).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{order.items.length} items</p>
                </div>
              </div>

              {order.branding && (
                <div className="bg-purple-50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-purple-700 font-medium text-sm">
                    <Palette size={16} />
                    Branding Details
                  </div>
                  
                  {order.branding.logo && (
                    <div className="text-sm">
                      <span className="text-gray-600">Logo: </span>
                      <span className="text-gray-900 font-medium">{order.branding.logo}</span>
                    </div>
                  )}
                  
                  {order.branding.colors && (
                    <div className="text-sm">
                      <span className="text-gray-600">Colors: </span>
                      <span className="text-gray-900 font-medium">{order.branding.colors}</span>
                    </div>
                  )}
                  
                  {order.branding.deadline && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={14} className="text-gray-600" />
                      <span className="text-gray-600">Deadline: </span>
                      <span className="text-gray-900 font-medium">{formatDate(order.branding.deadline)}</span>
                    </div>
                  )}
                  
                  {order.branding.notes && (
                    <div className="text-sm">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <FileText size={14} />
                        Notes:
                      </div>
                      <p className="text-gray-900 text-xs bg-white rounded-lg p-2">
                        {order.branding.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  {order.created_at}
                </span>
                <button
                  onClick={() => viewDetails(order)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium group-hover:scale-105"
                >
                  <Eye size={16} />
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Palette size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No branding requests found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search criteria' : 'Branding requests will appear here when customers place orders'}
          </p>
        </div>
      )}

      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 flex items-center justify-between">
              <div className="text-white">
                <h2 className="text-2xl font-bold">Branding Request #{selectedRequest.id}</h2>
                <p className="text-purple-100 text-sm mt-1">{selectedRequest.customer.name}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-purple-100 transition-colors text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Phone size={18} className="text-purple-600" />
                    Customer Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Name: </span>
                      <span className="font-medium text-gray-900">{selectedRequest.customer.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone: </span>
                      <span className="font-medium text-gray-900">{selectedRequest.customer.phone}</span>
                    </div>
                    {selectedRequest.customer.email && (
                      <div>
                        <span className="text-gray-600">Email: </span>
                        <span className="font-medium text-gray-900">{selectedRequest.customer.email}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">Address: </span>
                      <span className="font-medium text-gray-900">{selectedRequest.customer.address}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Palette size={18} className="text-purple-600" />
                    Branding Specifications
                  </h3>
                  <div className="space-y-2 text-sm">
                    {selectedRequest.branding?.logo && (
                      <div>
                        <span className="text-gray-600">Logo: </span>
                        <span className="font-medium text-gray-900">{selectedRequest.branding.logo}</span>
                      </div>
                    )}
                    {selectedRequest.branding?.colors && (
                      <div>
                        <span className="text-gray-600">Colors: </span>
                        <span className="font-medium text-gray-900">{selectedRequest.branding.colors}</span>
                      </div>
                    )}
                    {selectedRequest.branding?.deadline && (
                      <div>
                        <span className="text-gray-600">Deadline: </span>
                        <span className="font-medium text-gray-900">{formatDate(selectedRequest.branding.deadline)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedRequest.branding?.notes && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FileText size={18} className="text-purple-600" />
                    Additional Notes
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedRequest.branding.notes}
                  </p>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedRequest.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.qty}</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        KSh {parseFloat(item.subtotal).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-purple-600">
                    KSh {parseFloat(selectedRequest.total).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <span className="text-sm text-gray-600">Payment Method: </span>
                  <span className="text-sm font-medium text-gray-900 capitalize">{selectedRequest.payment_method}</span>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(selectedRequest.status)}`}>
                  {selectedRequest.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
