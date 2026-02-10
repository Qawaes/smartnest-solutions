const getApiUrl = () => {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  
  return `http://${hostname}:5000`;
};

export const API_URL = getApiUrl();
