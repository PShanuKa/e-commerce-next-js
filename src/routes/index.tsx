import HomePage from "../pages/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ShopPage from "../pages/Shop";
import ProductDetail from "../pages/ProductDetail";
import CartPage from "../pages/Cart";
import CheckoutPage from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";
import ProfilePage from "../pages/Account";
import OrdersPage from "../pages/Account/Orders";
import WishlistPage from "../pages/Wishlist";
import AboutPage from "../pages/About";
import ContactPage from "../pages/Contact";
import NotFound from "../pages/NotFound";
import CategoriesPage from "../pages/Categories";

export const PublicRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/products", element: <ShopPage /> },
  { path: "/categories", element: <CategoriesPage /> },
  { path: "/product/:id", element: <ProductDetail /> },
  { path: "/cart", element: <CartPage /> },
  { path: "/checkout", element: <CheckoutPage /> },
  { path: "/order-success", element: <OrderSuccess /> },
  { path: "/wishlist", element: <WishlistPage /> },
  { path: "/account", element: <ProfilePage /> },
  { path: "/account/orders", element: <OrdersPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "*", element: <NotFound /> },
];

export const AuthRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
];
