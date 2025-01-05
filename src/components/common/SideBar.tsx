import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLayerGroup, faClipboardList,
    faBoxes,

} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { cn } from '@/lib/utils';

function SideBar() {
    const navigate = useNavigate(); // Initialize useNavigate

    const authUser = {
        role: 'admin'
    }
    const mockDataSidebar = [
        {
            id: 1,
            label: "Tổng quan",
            icon: faLayerGroup,
            path: "/", // Add path for navigation
            allowRoles: ['admin']
        },
        {
            id: 2, // Changed from 5 to 4 for sequential ID
            label: "Hàng hóa",
            icon: faBoxes,
            path: "/products", // Add path for navigation
            allowRoles: ['admin']
        },
        {
            id: 3,
            label: "Đơn hàng",
            icon: faClipboardList,
            path: "/orders",
            allowRoles: ['admin']
        }
    ];

    return (
        <div className="flex h-screen fixed top-0 left-0 border-r border-slate-500/10 z-50 select-none">
            <div className={`transition-transform duration-300 md:translate-x-0 w-64 h-full bg-white shadow-md md:block hidden`}>
                <div className="p-6">
                    <h1 className="flex justify-center items-center text-2xl font-bold text-gray-800">
                        <span className="text-primary font-bold text-center">Laundry</span>
                    </h1>
                </div>

                <nav className="mt-6 mx-4">
                    <ul>
                        {authUser && mockDataSidebar.map((menuItem) => {
                            return menuItem.allowRoles.includes(authUser?.role) && (
                                <li
                                    key={menuItem.id}
                                    className={cn("flex items-center p-4 text-gray-700 rounded-lg mb-2 cursor-pointer hover:bg-slate-100",
                                        location.pathname === menuItem.path && 'bg-primary text-white hover:bg-primary'
                                    )}
                                    onClick={() => {
                                        navigate(menuItem.path); // Navigate on click
                                    }}
                                >
                                    <FontAwesomeIcon icon={menuItem.icon} className="mr-3" />
                                    <span>{menuItem.label}</span>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default SideBar;
