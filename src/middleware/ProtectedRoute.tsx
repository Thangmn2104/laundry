import { ApiClient } from "@/constants/ApiClient";
import { useAuth } from "@/store/useAuthStore";
import { Navigate, } from "react-router-dom";

type Props = {
    children: React.ReactNode;
    allowedRoles: string[];
};

const ProtectedRoute = ({ children, allowedRoles }: Props) => {

    const { token, user } = useAuth();

    ApiClient.defaults.headers.common = {
        'Authorization': token ? `Bearer ${token}` : null,
    };

    if (!allowedRoles.includes(user?.role || '')) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
