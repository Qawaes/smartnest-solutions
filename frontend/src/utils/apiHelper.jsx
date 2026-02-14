const getApiUrl = () => {
  const hostname = window.location.hostname;

  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, "");
  }

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }

  return 'https://smartnest-backend-3vi6.onrender.com';
};

export const API_URL = getApiUrl();
