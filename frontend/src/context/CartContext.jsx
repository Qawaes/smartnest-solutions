import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext(null);

const initialState = JSON.parse(localStorage.getItem("cart")) || [];

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const existing = state.find(
        item => item.product_id === action.payload.product_id
      );

      if (existing) {
        return state.map(item => {
          if (item.product_id !== action.payload.product_id) return item;
          const nextQty = item.qty + action.payload.qty;
          return { ...item, qty: nextQty };
        });
      }

      return [...state, action.payload];
    }

    case "UPDATE_QTY":
      return state
        .map(item => {
          if (item.product_id !== action.payload.product_id) return item;
          return { ...item, qty: action.payload.qty };
        })
        .filter(item => item.qty > 0);

    case "REMOVE":
      return state.filter(
        item => item.product_id !== action.payload.product_id
      );

    case "CLEAR":
      return [];

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const refreshCartFromServer = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      const products = Array.isArray(data) ? data : data.products;
      if (!Array.isArray(products)) return;

      const productMap = new Map(products.map((p) => [p.id, p]));

      const updated = cart
        .map((item) => {
          const latest = productMap.get(item.product_id);
          if (!latest) return null;
          const price = latest.effective_price ?? latest.discounted_price ?? latest.price;
          if (latest.in_stock === false) return null;
          return {
            ...item,
            price: Number(price),
            in_stock: latest.in_stock !== false,
          };
        })
        .filter(Boolean);

      if (JSON.stringify(updated) !== JSON.stringify(cart)) {
        dispatch({ type: "CLEAR" });
        updated.forEach((item) => dispatch({ type: "ADD", payload: item }));
      }
    } catch (err) {
      console.error("Cart refresh failed:", err);
    }
  };

  // ✅ ACTIONS (ALL INSIDE PROVIDER)
  const addToCart = (item) =>
    dispatch({ type: "ADD", payload: item });

  const updateQty = (product_id, qty) =>
    dispatch({ type: "UPDATE_QTY", payload: { product_id, qty } });

  const removeFromCart = (item) =>
    dispatch({ type: "REMOVE", payload: item });

  const clearCart = () =>
    dispatch({ type: "CLEAR" });

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,       // ✅ THIS WAS MISSING
        removeFromCart,
        clearCart,
        refreshCartFromServer
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
