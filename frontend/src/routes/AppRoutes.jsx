import { Routes, Route } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import AuthLayout from "../components/layout/AuthLayout";
import AdminLayout from "../components/layout/AdminLayout";
import AdminRoute from "./AdminRoute";
import ProtectedRoute from "./ProtectedRoute";

import Dashboard from '../pages/admin/Dashboard';
import ProductsPage from '../pages/admin/Products/ProductsPage';
import OrdersPage from '../pages/admin/Orders/OrdersPage';
import BrandingRequestsPage from '../pages/admin/Branding/BrandingRequestsPage';

import Home from "../pages/Home/Home";
import Category from "../pages/Category/Category";
import CartPage from "../pages/Cart/CartPage";
import Checkout from "../pages/Checkout/Checkout";
import Product from "../pages/Product/Product";
import RequestQuote from "../pages/Quote/RequestQuote";
import OrderSuccess from "../pages/Checkout/OrderSuccess";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";

import NotFound from "../pages/Misc/NotFound";

export default function AppRoutes() {
  return (
    <Routes>

      {/* STORE LAYOUT */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/category/:slug" element={<Category />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/quote/:id" element={<RequestQuote />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Route>

      {/* AUTH LAYOUT */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductsPage />} />
          <Route path="/admin/orders" element={<OrdersPage />} />
          <Route path="/admin/branding" element={<BrandingRequestsPage />} />
        </Route>
      </Route>
     
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}
