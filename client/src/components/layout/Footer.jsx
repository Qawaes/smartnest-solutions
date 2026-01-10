import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
    const year = new Date().getFullYear();  
 
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* BRAND */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">
            SmartNest Solution
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Gifts, home essentials, and custom branding solutions across Kenya.
          </p>

        {/* SOCIAL ICONS */}
        <div className="flex gap-4 text-xl">
        <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="hover:text-blue-600 transition"
        >
            <FaFacebookF />
        </a>

        <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="hover:text-pink-500 transition"
        >
            <FaInstagram />
        </a>

        <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter"
            className="hover:text-sky-500 transition"
        >
            <FaTwitter />
        </a>

        <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="hover:text-blue-500 transition"
        >
            <FaLinkedinIn />
        </a>
        </div>

        </div>

        {/* SHOP */}
        <div>
          <h4 className="text-white font-medium mb-3">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/category/gifts" className="hover:underline">Gifts</Link></li>
            <li><Link to="/category/home-essentials" className="hover:underline">Home Essentials</Link></li>
            <li><Link to="/category/custom-branding" className="hover:underline">Custom Branding</Link></li>
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h4 className="text-white font-medium mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:underline">About Us</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:underline">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="text-white font-medium mb-3">Get in Touch</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li> Kenya</li>
            <li> +254 700 000 000</li>
            <li> info@smartnest.co.ke</li>
            <li>
              <a
                href="https://wa.me/254700000000"
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Chat on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        © {year} SmartNest Solution · Kenya · All rights reserved.
      </div>
    </footer>
  );
}