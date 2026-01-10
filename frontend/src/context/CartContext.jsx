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
        return state.map(item =>
          item.product_id === action.payload.product_id
            ? { ...item, qty: item.qty + action.payload.qty }
            : item
        );
      }

      return [...state, action.payload];
    }

    case "UPDATE_QTY":
      return state
        .map(item =>
          item.product_id === action.payload.product_id
            ? { ...item, qty: action.payload.qty }
            : item
        )
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
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
