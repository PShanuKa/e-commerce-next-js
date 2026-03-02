import { Route, Routes } from "react-router-dom";
import { PublicRoutes, AuthRoutes } from ".";

const AllRoutes = () => (
  <Routes>
    {PublicRoutes.map((route, index) => (
      <Route key={index} path={route.path} element={route.element} />
    ))}
    {AuthRoutes.map((route, index) => (
      <Route key={`auth-${index}`} path={route.path} element={route.element} />
    ))}
  </Routes>
);

export default AllRoutes;
