import { ApiClient } from "@/constants/ApiClient";
import { useLayoutEffect } from "react";
import { Navigate, } from "react-router-dom";

type Props = {
    children: React.ReactNode;
    role: string;
    allowedRoles: string[];
};

const ProtectedRoute = ({ children, role, allowedRoles }: Props) => {

    // const token = getCookie('_at');
    const token = '123'

    ApiClient.defaults.headers.common = {
        'Authorization': token ? `Bearer ${token}` : null,
    };

    const handleGetMe = async () => {
        if (token) {
            /// get me
        }
    };

    useLayoutEffect(() => {
        handleGetMe();
    }, [token]);


    if (!allowedRoles.includes(role)) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
