import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import HomePage from "../pages/Home";

export const PublicRoutes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
];
