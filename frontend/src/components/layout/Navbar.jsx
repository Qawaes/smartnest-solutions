import { Link, NavLink } from "react-router-dom"
import { useState } from "react"
import { useCart } from "../../context/CartContext"
import { useSearch } from "../../context/SearchContext"
import { Search, ShoppingCart, Menu, X, User, Sparkles } from "lucide-react"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const { cart } = useCart()
  const { search, setSearch } = useSearch()

  // total items in cart
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between py-4 gap-4">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/smartnest-logo.jpg"
                alt="SmartNest Logo"
                className="h-10 w-10 rounded-xl object-cover ring-2 ring-purple-500/20 group-hover:ring-purple-500/40 transition-all"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-pulse" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-600 bg-clip-text text-transparent hidden sm:block">
              SmartNest
            </span>
          </Link>

          {/* SEARCH (GLOBAL) */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
              <input
                type="text"
                placeholder="Search gifts, home essentials, branding..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 focus:bg-white transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-2">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `px-4 py-2 rounded-xl font-medium transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              Home
            </NavLink>
            
            <NavLink 
              to="/category/gifts" 
              className={({ isActive }) => 
                `px-4 py-2 rounded-xl font-medium transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              Gifts
            </NavLink>
            
            <NavLink 
              to="/category/home-essentials" 
              className={({ isActive }) => 
                `px-4 py-2 rounded-xl font-medium transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              Home Essentials
            </NavLink>
            
            <NavLink 
              to="/category/custom-branding" 
              className={({ isActive }) => 
                `px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Sparkles className="w-4 h-4" />
              Custom Branding
            </NavLink>

            {/* CART */}
            <Link 
              to="/cart" 
              className="relative ml-2 p-3 rounded-xl hover:bg-gray-100 transition-all group"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-purple-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-lg animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>

            <NavLink 
              to="/auth/login" 
              className="ml-2 px-6 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl font-semibold hover:from-black hover:to-gray-900 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Login
            </NavLink>
          </nav>

          {/* MOBILE ICONS (Cart + Menu) */}
          <div className="flex lg:hidden items-center gap-2">
            <Link 
              to="/cart" 
              className="relative p-2 rounded-xl hover:bg-gray-100 transition-all"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-all"
              aria-label="Toggle menu"
            >
              {open ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div 
        className={`lg:hidden bg-white border-t border-gray-200 transition-all duration-300 ease-in-out ${
          open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="container mx-auto px-4 py-6 space-y-6">

          {/* MOBILE SEARCH */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all"
            />
          </div>

          <nav className="flex flex-col space-y-2">
            <NavLink 
              to="/" 
              onClick={() => setOpen(false)}
              className={({ isActive }) => 
                `px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              Home
            </NavLink>
            
            <NavLink 
              to="/category/gifts" 
              onClick={() => setOpen(false)}
              className={({ isActive }) => 
                `px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              Gifts
            </NavLink>
            
            <NavLink 
              to="/category/home-essentials" 
              onClick={() => setOpen(false)}
              className={({ isActive }) => 
                `px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              Home Essentials
            </NavLink>
            
            <NavLink 
              to="/category/custom-branding" 
              onClick={() => setOpen(false)}
              className={({ isActive }) => 
                `px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Sparkles className="w-4 h-4" />
              Custom Branding
            </NavLink>

            <div className="pt-4 border-t border-gray-200">
              <NavLink
                to="/auth/login"
                onClick={() => setOpen(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl font-semibold hover:from-black hover:to-gray-900 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                Login
              </NavLink>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}