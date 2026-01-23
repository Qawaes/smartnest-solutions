const getApiBase = () => {
  const hostname = window.location.hostname;

  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL}/api`;
  }

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }

  return `http://${hostname}:5000/api`;
};

export const API_BASE = getApiBase();

console.log('API Base URL:', API_BASE);

// Products
export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function fetchProductsByCategory(slug) {
  const res = await fetch(`${API_BASE}/products/category/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch category products");
  return res.json();
}

export const API_ENDPOINTS = {
  PRODUCTS: `${API_BASE}/products`,
  CATEGORIES: `${API_BASE}/categories`,
  ORDERS: `${API_BASE}/orders`,
  MPESA_STK: `${API_BASE}/payments/mpesa/stk`,
};

// Orders
export async function createOrder(orderData) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });

  if (!res.ok) throw new Error("Order failed");
  return res.json();
}

export async function fetchOrders() {
  const res = await fetch(`${API_BASE}/orders`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function updateOrderStatus(orderId, status) {
  const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error("Failed to update order status");
  return res.json();
}

// Payments - M-Pesa
export const initiateMpesaPayment = async (orderId, phone) => {
  const response = await fetch(`${API_BASE}/payments/mpesa/stk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      order_id: orderId,
      phone: phone,
    }),
  });

  if (!response.ok) {
    throw new Error('Payment initiation failed');
  }

  return response.json();
};
