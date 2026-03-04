import { Routes, Route, Navigate } from "react-router-dom";
import AuthGuard from "@/components/auth/AuthGuard";
import LoginPage from "@/pages/auth/LoginPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import CategoriesPage from "@/pages/categories/CategoriesPage";

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/login" element={<LoginPage />} />

    {/* Protected admin routes */}
    <Route element={<AuthGuard />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      {/* Future pages go here */}
      {/* <Route path="/products"   element={<ProductsPage />} /> */}
      {/* <Route path="/orders"     element={<OrdersPage />} /> */}
      {/* <Route path="/customers"  element={<CustomersPage />} /> */}
      <Route path="/categories" element={<CategoriesPage />} />
    </Route>

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default AppRoutes;
