const getApiUrl = () => {
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://smartnest-backend-3vi6.onrender.com";

  return API_URL.replace(/\/$/, "");
};

export const API_URL = getApiUrl();
