import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { Mail, Phone, MapPin, Heart, Sparkles } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();  
 
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 mt-16 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 lg:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* BRAND */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <img
                    src="/smartnest-logo.jpg"
                    alt="SmartNest Logo"
                    className="h-12 w-12 rounded-xl object-cover ring-2 ring-purple-500/30"
                  />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  SmartNest
                </h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Elevating gifting experiences with curated home essentials and premium custom branding solutions across Kenya.
              </p>
            </div>

            {/* SOCIAL ICONS */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">
                Connect With Us
              </p>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-300 group"
                >
                  <FaFacebookF className="text-gray-400 group-hover:text-white transition-colors" />
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 hover:scale-110 transition-all duration-300 group"
                >
                  <FaInstagram className="text-gray-400 group-hover:text-white transition-colors" />
                </a>

                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter"
                  className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-sky-500 hover:scale-110 transition-all duration-300 group"
                >
                  <FaTwitter className="text-gray-400 group-hover:text-white transition-colors" />
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-300 group"
                >
                  <FaLinkedinIn className="text-gray-400 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>
          </div>

          {/* SHOP */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Shop
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/category/gifts" 
                  className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-300 group"
                >
                  <span className="group-hover:border-b-2 border-purple-400">Gifts</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/category/home-essentials" 
                  className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-300 group"
                >
                  <span className="group-hover:border-b-2 border-purple-400">Home Essentials</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/category/custom-branding" 
                  className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-300 group"
                >
                  <span className="group-hover:border-b-2 border-purple-400">Custom Branding</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-300 group"
                >
                  <span className="group-hover:border-b-2 border-purple-400">About Us</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-300 group"
                >
                  <span className="group-hover:border-b-2 border-purple-400">Contact</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-300 group"
                >
                  <span className="group-hover:border-b-2 border-purple-400">Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-300 group"
                >
                  <span className="group-hover:border-b-2 border-purple-400">Terms & Conditions</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span>Nairobi, Kenya</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <a href="tel:+254700000000" className="hover:text-white transition-colors">
                  +254 700 000 000
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <a href="mailto:info@smartnest.co.ke" className="hover:text-white transition-colors">
                  info@smartnest.co.ke
                </a>
              </li>
              <li className="pt-2">
                <a
                  href="https://wa.me/254700000000"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white px-5 py-2.5 rounded-xl font-medium hover:from-green-500 hover:to-green-400 transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:scale-105"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* NEWSLETTER SECTION (Optional) */}
        <div className="mt-16 pt-12 border-t border-gray-800">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-2xl font-bold text-white mb-3">Stay Updated</h4>
            <p className="text-gray-400 mb-6">
              Subscribe to our newsletter for exclusive deals and new arrivals
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder:text-gray-500"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="relative border-t border-gray-800/50 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p className="flex items-center gap-2">
              © {year} SmartNest Solution · Made with 
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> 
              in Kenya
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}