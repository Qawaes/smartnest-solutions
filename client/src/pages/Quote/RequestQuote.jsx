import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function RequestQuote() {
  const { id } = useParams();
  const navigate = useNavigate();

  // TEMP: mock product lookup
  const product = products.find(p => p.id === Number(id));

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    quantity: 100,
    details: "",
  });

  if (!product) {
    return <p className="text-center">Product not found</p>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.phone) {
      alert("Name and phone number are required");
      return;
    }

    // WhatsApp message
    const message = `
Hello SmartNest Solution 👋

I would like a quote for the following custom branding product:

Product: ${product.name}
Quantity: ${form.quantity}

Customer Name: ${form.name}
Phone: ${form.phone}
Email: ${form.email}

Customization Details:
${form.details || "N/A"}
    `.trim();

    const whatsappUrl = `https://wa.me/254727925858?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
    navigate("/");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <h1 className="text-2xl md:text-3xl font-semibold">
        Request Quote – {product.name}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="border rounded-lg p-6 space-y-4"
      >
        <input
          name="name"
          placeholder="Your Name *"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          name="phone"
          placeholder="Phone Number (WhatsApp) *"
          value={form.phone}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address (optional)"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="number"
          name="quantity"
          min={1}
          value={form.quantity}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

        <textarea
          name="details"
          placeholder="Customization details (logo, colors, text, deadline, etc.)"
          value={form.details}
          onChange={handleChange}
          rows={4}
          className="w-full border rounded px-3 py-2"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
        >
          Send Quote Request via WhatsApp
        </button>
      </form>
    </div>
  );
}

/* TEMP MOCK PRODUCTS */
const products = [
  {
    id: 3,
    name: "Branded Mugs (Custom Logo)",
    category: "custom-branding",
  },
];
