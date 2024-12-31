type props = {
    children: React.ReactNode;
    role: string;
    allowedRoles: string[];
}

const AuthRoute = ({ children }: props) => {
    // let token = '';

    // useEffect(() => {
    //     handleCheckToken
    // }, [])

    // const handleCheckToken = () => {
    //     token = getCookie('_at')
    //     if (token) {
    //         return <Navigate to="/" replace />
    //     }
    // }

    // if (!allowedRoles.includes(role)) {
    //     return <Navigate to="/404" replace />;
    // }

    return children;
};

export default AuthRoute;
