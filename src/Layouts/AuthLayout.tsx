import { ReactNode } from "react";

const AuthLayout = ({
    children
}: {
    children: ReactNode
}) => {
    return (
        <section className="grid grid-cols-1 w-full h-fit">
            {/* <div
                style={{
                    backgroundImage: `url(${LoginBg})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                }}
                className="bg-sky-500/20 min-h-screen sticky top-0"
            /> */}
            {children}
        </section>
    );
};

export default AuthLayout;
