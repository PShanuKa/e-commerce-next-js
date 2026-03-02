import { useLocation } from "react-router-dom";
import Default from "./Layouts/Default";
import AuthDefault from "./Layouts/AuthDefault";
import AllRoutes from "./routes/Routes";

const AUTH_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

function App() {
  const location = useLocation();
  const isAuthPage = AUTH_PATHS.includes(location.pathname);

  return isAuthPage ? (
    <AuthDefault>
      <AllRoutes />
    </AuthDefault>
  ) : (
    <Default>
      <AllRoutes />
    </Default>
  );
}

export default App;
