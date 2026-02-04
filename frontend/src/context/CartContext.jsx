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
          const maxQty =
            action.payload.stock_quantity ?? item.stock_quantity;
          const nextQty = item.qty + action.payload.qty;
          const clampedQty =
            typeof maxQty === "number" ? Math.min(nextQty, maxQty) : nextQty;
          return { ...item, qty: clampedQty };
        });
      }

      if (typeof action.payload.stock_quantity === "number" && action.payload.stock_quantity <= 0) {
        return state;
      }
      return [...state, action.payload];
    }

    case "UPDATE_QTY":
      return state
        .map(item => {
          if (item.product_id !== action.payload.product_id) return item;
          const maxQty = item.stock_quantity;
          const nextQty =
            typeof maxQty === "number"
              ? Math.min(action.payload.qty, maxQty)
              : action.payload.qty;
          return { ...item, qty: nextQty };
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
    console.log("CART:", cart); // debug (remove later)
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
          const stockQty = Number(latest.stock_quantity ?? 0);
          const price = latest.effective_price ?? latest.discounted_price ?? latest.price;
          const clampedQty =
            typeof stockQty === "number"
              ? Math.min(item.qty, stockQty)
              : item.qty;
          if (clampedQty <= 0) return null;
          return {
            ...item,
            price: Number(price),
            stock_quantity: stockQty,
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
