import { Route, Routes } from "react-router-dom";
import { MappedAuthRoute, MappedAuthRouteType, routes } from "@/constants/Routes";
import AuthRoute from "@/middleware/AuthRoute";
import AuthLayout from "@/Layouts/AuthLayout";
import DefaultLayout from "@/Layouts/DefaultLayout";
import ProtectedRoute from "@/middleware/ProtectedRoute";
import NotFound from "@/pages/NotFound/NotFound";

const RouterWrapper = () => {
    return (
        <Routes>
            {MappedAuthRoute.map((route: MappedAuthRouteType, index: number) => (
                <Route
                    key={index}
                    path={route.path}
                    element={
                        <AuthRoute allowedRoles={route.allowedRoles}>
                            <AuthLayout>
                                {<route.element />}
                            </AuthLayout>
                        </AuthRoute>
                    }
                />
            ))}
            {routes.map((route: MappedAuthRouteType, index) => (
                <Route
                    key={index}
                    path={route.path}
                    element={
                        <ProtectedRoute allowedRoles={route.allowedRoles}>
                            {route.isUsedLayout ? (
                                <DefaultLayout>
                                    {<route.element />}
                                </DefaultLayout>
                            ) : (
                                <route.element />
                            )}
                        </ProtectedRoute>
                    }
                />
            ))}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default RouterWrapper;
