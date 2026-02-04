import { Routes, Route } from "react-router-dom";
import HostRouter from "./HostRouter";

import AppLayout from "../components/layout/AppLayout";
import AuthLayout from "../components/layout/AuthLayout";
import AdminLayout from "../components/layout/AdminLayout";
import AdminRoute from "./AdminRoute";
import ProtectedRoute from "./ProtectedRoute";

/* ADMIN PAGES */
import Dashboard from "../pages/admin/Dashboard";
import ProductsPage from "../pages/admin/Products/ProductsPage";
import OrdersPage from "../pages/admin/Orders/OrdersPage";
import BrandingRequestsPage from "../pages/admin/Branding/BrandingRequestsPage";
import AdminPayments from "../pages/admin/Payments/AdminPayments";
import Inventory from "../pages/admin/Inventory/Inventory";

/* STORE PAGES */
import Home from "../pages/Home/Home";
import Category from "../pages/Category/Category";
import CartPage from "../pages/Cart/CartPage";
import Checkout from "../pages/Checkout/Checkout";
import Product from "../pages/Product/Product";
import RequestQuote from "../pages/Quote/RequestQuote";
import OrderSuccess from "../pages/Checkout/OrderSuccess";
import About from "../pages/AboutUs";
import Contact from "../pages/Contact";
import Terms from "../pages/Terms";
import Privacy from "../pages/Privacy"

/* AUTH PAGES */
import AdminLogin from "../pages/Auth/Login";


/* MISC */
import NotFound from "../pages/Misc/NotFound";

export default function AppRoutes() {
  return (
    <HostRouter>
      <Routes>

        {/* STORE LAYOUT */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/quote/:id" element={<RequestQuote />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/AboutUs" element={<About />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Terms" element={<Terms />} />
           <Route path="/Privacy" element={<Privacy />} />

        </Route>

        {/* AUTH LAYOUT */}
        <Route element={<AuthLayout />}>
          <Route path="/admin/login" element={<AdminLogin />} />
         
        </Route>

        {/* ADMIN ROUTES */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/products" element={<ProductsPage />} />
            <Route path="/admin/inventory" element={<Inventory />} />
            <Route path="/admin/orders" element={<OrdersPage />} />
            <Route path="/admin/branding" element={<BrandingRequestsPage />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
          </Route>
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </HostRouter>
  );
}
