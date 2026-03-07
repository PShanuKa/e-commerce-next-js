import { Routes, Route, Navigate } from "react-router-dom";
import AuthGuard from "@/components/auth/AuthGuard";
import LoginPage from "@/pages/auth/LoginPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import CategoriesPage from "@/pages/categories/CategoriesPage";
import ProductsPage from "@/pages/products/ProductsPage";
import CustomersPage from "@/pages/customers/CustomersPage";
import OrdersPage from "@/pages/orders/OrdersPage";
import OrderDetailsPage from "@/pages/orders/OrderDetailsPage";
import PaymentsPage from "@/pages/payments/PaymentsPage";

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/login" element={<LoginPage />} />

    {/* Protected admin routes */}
    <Route element={<AuthGuard />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/orders/:id" element={<OrderDetailsPage />} />
      <Route path="/payments" element={<PaymentsPage />} />
      <Route path="/customers" element={<CustomersPage />} />
    </Route>

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default AppRoutes;
