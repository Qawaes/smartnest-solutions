import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function ProductCard({ product }) {
  const { cart, addToCart, removeFromCart } = useCart();

  const cartItem = cart.find(
    (item) => item.product_id === product.id
  );
  const inCart = Boolean(cartItem);

  const handleToggleCart = () => {
    if (inCart) {
      removeFromCart(cartItem);
    } else {
      addToCart({
        product_id: product.id,
        name: product.name,
        price: Number(product.price),
        qty: 1,
        is_branding: product.is_branding,
      });
    }
  };

  return (
    <div className="border rounded-lg p-3 flex flex-col hover:shadow transition bg-white">

      {/* IMAGE */}
      <Link to={`/product/${product.id}`}>
        <div className="h-48 w-full overflow-hidden rounded mb-3 bg-gray-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        <h3 className="font-medium text-sm mb-1 line-clamp-2">
          {product.name}
        </h3>
      </Link>

      <p className="text-sm font-semibold mb-3">
        KES {Number(product.price).toLocaleString()}
      </p>

      {/* CART BUTTON */}
      <button
        onClick={handleToggleCart}
        className={`mt-auto text-sm py-2 rounded transition ${
          inCart
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {inCart ? "Remove from Cart" : "Add to Cart"}
      </button>
    </div>
  );
}
