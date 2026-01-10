import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/254728840848"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-2xl shadow-lg hover:bg-green-700 transition"
      aria-label="Chat with us on WhatsApp"
       title="Get in touch" 
    >
      <FaWhatsapp />
    </a>
  );
}
