import { ReactNode } from "react";

const AuthLayout = ({
    children
}: {
    children: ReactNode
}) => {
    return (
        <div className="min-h-screen w-full flex">
            {/* Left side - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 bg-blue-600 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-90" />
                <div className="relative z-10 w-full flex flex-col items-center justify-center p-12 text-white">
                    <h1 className="text-5xl font-bold mb-8">Laundry Service</h1>
                    <p className="text-xl text-blue-100 text-center">
                        Quản lý dịch vụ giặt ủi chuyên nghiệp và hiệu quả
                    </p>
                </div>
            </div>

            {/* Right side - Content */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
