import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://smartnest-backend-3vi6.onrender.com";
const ADMIN_AUTH_BASE = `${API_URL}/api/admin/auth`;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyToken();
  }, []);

  const getToken = () =>
    localStorage.getItem("admin_token") || localStorage.getItem("adminToken");

  const clearToken = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("adminToken");
  };

  const verifyToken = async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${ADMIN_AUTH_BASE}/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.admin);
      } else {
        clearToken();
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      clearToken();
    } finally {
      setLoading(false);
    }
  };

  const requestOTP = async (email) => {
    const response = await fetch(`${ADMIN_AUTH_BASE}/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to send OTP");
    }

    return data;
  };

  const verifyOTP = async (email, otp) => {
    const response = await fetch(`${ADMIN_AUTH_BASE}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "OTP verification failed");
    }

    localStorage.setItem("admin_token", data.access_token);
    localStorage.setItem("adminToken", data.access_token);
    setUser(data.admin);
    return data;
  };

  const logout = async () => {
    const token = getToken();
    
    if (token) {
      try {
        await fetch(`${ADMIN_AUTH_BASE}/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Logout request failed:", error);
      }
    }
    
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        requestOTP,
        verifyOTP,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
