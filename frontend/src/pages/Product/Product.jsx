import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Product() {
  const { id } = useParams();
  const { cart, addToCart, removeFromCart } = useCart();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);

  // Find if product is in cart
  const cartItem = cart.find(
    (item) => item.product_id === product?.id
  );
  const inCart = Boolean(cartItem);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/products`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => String(p.id) === id);
        setProduct(found);

        if (found?.images?.length) {
          const primary =
            found.images.find((img) => img.is_primary) ||
            found.images[0];
          setActiveImage(primary.image_url);
        }

        setLoading(false);
      });
  }, [id]);

  // Toggle cart function
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

  if (loading) {
    return <p className="text-center py-20">Loading...</p>;
  }

  if (!product) {
    return <p className="text-center py-20">Product not found</p>;
  }

  return (
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

      {/* IMAGE GALLERY */}
      <div>
        {/* HERO IMAGE */}
        <div className="w-full h-[380px] md:h-[480px] bg-gray-100 rounded-lg overflow-hidden mb-4">
          {activeImage && (
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* THUMBNAILS */}
        {product.images?.length > 1 && (
          <div className="flex gap-3 overflow-x-auto">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(img.image_url)}
                className={`h-20 w-20 flex-shrink-0 rounded border overflow-hidden ${
                  activeImage === img.image_url
                    ? "ring-2 ring-black"
                    : ""
                }`}
              >
                <img
                  src={img.image_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* PRODUCT INFO */}
      <div className="space-y-6">

        <h1 className="text-2xl md:text-3xl font-semibold">
          {product.name}
        </h1>

        <p className="text-xl font-bold">
          KES {Number(product.price).toLocaleString()}
        </p>

        {product.is_branding && (
          <div className="bg-yellow-100 text-yellow-800 text-sm px-3 py-2 rounded">
            This is a custom branding product. Branding details will be
            requested at checkout.
          </div>
        )}

        <p className="text-gray-600">
          {product.description}
        </p>

        <button
          onClick={handleToggleCart}
          className={`px-6 py-3 rounded transition ${
            inCart
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {inCart ? "added to cart" : "Add to Cart"}
        </button>

      </div>
    </div>
  );
}