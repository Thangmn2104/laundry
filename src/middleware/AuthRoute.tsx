import { useAuth } from "@/store/useAuthStore";
import { Navigate } from "react-router-dom";

type props = {
    children: React.ReactNode;
    allowedRoles: string[];
}

const AuthRoute = ({ children }: props) => {
    const { token } = useAuth();

    if (token) {
        return <Navigate to="/" replace />
    }

    return children;
};

export default AuthRoute;
