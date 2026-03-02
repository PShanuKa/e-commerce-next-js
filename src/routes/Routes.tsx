import { Route, Routes } from "react-router-dom"
import { PublicRoutes } from "."

const AllRoutes = () => {
    return (
        <Routes>
            {
                PublicRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))
            }
        </Routes>
    )
}

export default AllRoutes