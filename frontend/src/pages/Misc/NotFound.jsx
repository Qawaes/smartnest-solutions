import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft, Package, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <h1 className="text-[200px] md:text-[280px] font-black text-gray-200 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-blue-100 rounded-full flex items-center justify-center animate-bounce">
                <Package className="w-16 h-16 md:w-20 md:h-20 text-blue-600" />
              </div>
              {/* Floating icons */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center animate-pulse">
                <Search className="w-6 h-6 text-orange-600" />
              </div>
              <div className="absolute -bottom-2 -left-4 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center animate-pulse animation-delay-500">
                <ShoppingBag className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-2">
            The page you're looking for seems to have wandered off.
          </p>
          <p className="text-gray-500">
            Don't worry, even the best explorers get lost sometimes!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Back to Home
          </Link>

          <Link
            to="/category/gifts"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 rounded-lg font-semibold text-lg transition-all shadow-md hover:shadow-lg"
          >
            <ShoppingBag className="w-5 h-5" />
            Browse Products
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4 font-medium">Popular Pages:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/category/gifts"
              className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              Gifts
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              to="/category/home"
              className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              Home Essentials
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              to="/category/branding"
              className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              Branding
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}