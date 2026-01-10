import { Link, NavLink } from "react-router-dom"
import { useState } from "react"
import { useCart } from "../../context/CartContext"
import { useSearch } from "../../context/SearchContext"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const { cart } = useCart()
  const { search, setSearch } = useSearch()

  // total items in cart
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container flex items-center justify-between py-3 gap-4">

        {/* LOGO */}
        <Link to="/" className="text-xl font-bold text-primary">
          SmartNest
        </Link>

        {/* SEARCH (GLOBAL) */}
        <div className="flex-1 max-w-xl hidden md:block">
          <input
            type="text"
            placeholder="Search gifts, home essentials, branding..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring"
          />
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/category/gifts" className="nav-link">Gifts</NavLink>
          <NavLink to="/category/home-essentials" className="nav-link">Home Essentials</NavLink>
          <NavLink to="/category/custom-branding" className="nav-link">Custom Branding</NavLink>

          {/* CART */}
          <Link to="/cart" className="relative text-xl">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-1 min-w-[18px] text-center">
                {cart.length}
              </span>
            )}
          </Link>

          <NavLink to="/auth/login" className="btn-primary">
            Login
          </NavLink>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t">
          <div className="p-4 space-y-4">

            {/* MOBILE SEARCH */}
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            />

            <nav className="flex flex-col space-y-4">
              <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
              <NavLink to="/category/gifts" onClick={() => setOpen(false)}>Gifts</NavLink>
              <NavLink to="/category/home-essentials" onClick={() => setOpen(false)}>Home Essentials</NavLink>
              <NavLink to="/category/custom-branding" onClick={() => setOpen(false)}>Custom Branding</NavLink>

              {/* CART (MOBILE) */}
              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2"
              >
                🛒 Cart
                {cartCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2">
                    {cartCount}
                  </span>
                )}
              </Link>

              <NavLink
                to="/auth/login"
                onClick={() => setOpen(false)}
                className="btn-primary text-center"
              >
                Login
              </NavLink>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
