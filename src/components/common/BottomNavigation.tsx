import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome,
    faBoxes,
    faFileInvoiceDollar
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

function BottomNavigation() {
    const navigate = useNavigate();
    const location = window.location;

    const authUser = {
        role: 'admin'
    }

    const navigationItems = [
        {
            id: 1,
            label: "Tổng quan",
            icon: faHome,
            path: "/",
            allowRoles: ['admin']
        },
        {
            id: 2,
            label: "Hàng hóa",
            icon: faBoxes,
            path: "/products",
            allowRoles: ['admin']
        },
        {
            id: 3,
            label: "Đơn hàng",
            icon: faFileInvoiceDollar,
            path: "/orders",
            allowRoles: ['admin']
        }
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
            <div className="flex justify-around items-center h-16">
                {authUser && navigationItems.map((item) => {
                    return item.allowRoles.includes(authUser?.role) && (
                        <button
                            key={item.id}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full",
                                location.pathname === item.path
                                    ? "text-primary"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                            onClick={() => navigate(item.path)}
                        >
                            <FontAwesomeIcon icon={item.icon} className="text-lg mb-1" />
                            <span className="text-xs">{item.label}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    );
}

export default BottomNavigation; 