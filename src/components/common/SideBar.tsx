import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLayerGroup, faClipboardList,
    faBoxes,

} from '@fortawesome/free-solid-svg-icons';
import { CircleUserRound } from "lucide-react";

import { LogOut } from 'lucide-react';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { Avatar } from '@radix-ui/react-avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { cn } from '@/lib/utils';
import { useAuth } from '@/store/useAuthStore';
import { Button } from '../ui/button';

function SideBar() {
    const navigate = useNavigate(); // Initialize useNavigate

    const { user, logout, isAuthenticated } = useAuth()
    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    // Add loading state for hydration
    if (typeof isAuthenticated === 'undefined') {
        return null // or loading spinner
    }

    const handleTranslateRole = (role: string) => {
        switch (role) {
            case 'admin':
                return 'Quản trị viên'
            default:
                return role
        }
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
            <div className={`transition-transform duration-300 md:translate-x-0 w-36 h-full bg-white shadow-md md:block hidden`}>
                {/* <div
                    onClick={() => navigate('/')}
                    className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center mx-auto mt-10 cursor-pointer">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div> */}

                <div className="mx-auto mt-10 flex justify-center">
                    {isAuthenticated && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-12 w-12 rounded-full border items-center justify-center"
                                >
                                    <Avatar className="h-12 w-12 flex items-center justify-center text-lg">
                                        <AvatarFallback>
                                            {user.username.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-3">
                                        <p className="text-base font-medium leading-none">{user.username}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {handleTranslateRole(user.role)}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="text-red-600 cursor-pointer h-[48px]"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Đăng xuất</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center gap-2 text-sm font-medium"
                        >
                            <CircleUserRound className="h-5 w-5" />
                            <span className="hidden sm:inline">Đăng nhập</span>
                        </Link>
                    )}
                </div>

                <nav className="mt-10 mx-4">
                    <ul>
                        {mockDataSidebar.map((menuItem) => {
                            return menuItem.allowRoles.includes(user?.role || '') && (
                                <li
                                    key={menuItem.id}
                                    className={cn("flex flex-col justify-center items-center p-4 text-gray-700 rounded-lg mb-2 cursor-pointer hover:bg-slate-100 gap-2 text-center aspect-square",
                                        location.pathname === menuItem.path && 'bg-primary text-white hover:bg-primary'
                                    )}
                                    onClick={() => {
                                        navigate(menuItem.path); // Navigate on click
                                    }}
                                >
                                    <FontAwesomeIcon icon={menuItem.icon} className="" />
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
