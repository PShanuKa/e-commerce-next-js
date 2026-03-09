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
import ProductSingle from "@/pages/products/productSingle";
import CategorySingle from "@/pages/categories/categorySingle";
import CustomerSingle from "@/pages/customers/customerSingle";

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/admin/login" element={<LoginPage />} />

    {/* Protected admin routes */}
    <Route element={<AuthGuard />}>
      <Route path="/admin/dashboard" element={<DashboardPage />} />
      <Route path="/admin/categories" element={<CategoriesPage />} />
      <Route path="/admin/categories/add" element={<CategorySingle type="add" />} />
      <Route path="/admin/categories/:id" element={<CategorySingle type="edit" />} />
      <Route path="/admin/products" element={<ProductsPage />} />
      <Route path="/admin/products/add" element={<ProductSingle type="add" />} />
      <Route path="/admin/products/:id" element={<ProductSingle type="edit" />} />
      <Route path="/admin/orders" element={<OrdersPage />} />
      <Route path="/admin/orders/:id" element={<OrderDetailsPage />} />
      <Route path="/admin/payments" element={<PaymentsPage />} />
      <Route path="/admin/customers" element={<CustomersPage />} />
      <Route path="/admin/customers/add" element={<CustomerSingle type="add" />} />
      <Route path="/admin/customers/:id" element={<CustomerSingle type="view" />} />
      <Route
        path="/admin/customers/:id/edit"
        element={<CustomerSingle type="edit" />}
      />
    </Route>

    {/* Fallback */}
    <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
    <Route path="/*" element={<Navigate to="/admin/dashboard" replace />} />
  </Routes>
);

export default AppRoutes;
