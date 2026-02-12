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
                  href="https://www.facebook.com/stntheboutique?rdid=RD1uAJmgPTGiIX9J&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F19zmTfyvED%2F"
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
                  href="https://www.linkedin.com/in/dr-lydia-mwai-phd-mmsk-20495a80?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
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
                  to="/AboutUs" 
                  className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-300 group"
                >
                  <span className="group-hover:border-b-2 border-purple-400">About Us</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/Contact" 
                  className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-300 group"
                >
                  <span className="group-hover:border-b-2 border-purple-400">Contact</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/Terms" 
                  className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-300 group"
                >
                  <span className="group-hover:border-b-2 border-purple-400">Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/Terms" 
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
                <a href="tel:+254728840848" className="hover:text-white transition-colors">
                  +254 728840848
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <a href="mailto:info@smartnestsolutionskenya@gmail.com" className="hover:text-white transition-colors">
                  smartnestsolutionskenya@gmail.com
                </a>
              </li>
              <li className="pt-2">
                <a
                  href="https://wa.me/254728840848"
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
              <Link to="/Privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}