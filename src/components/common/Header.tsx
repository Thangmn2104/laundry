import { CircleUserRound } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { useAuth } from '@/store/useAuthStore'

export const Header = () => {
    const { user, logout, isAuthenticated } = useAuth()
    const navigate = useNavigate()
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

    return (
        <header className="fixed top-0 right-0 left-0 md:left-32 h-16 bg-white border-b border-slate-500/10 z-40">
            <div className="h-full flex items-center justify-between px-4">
                {/* Left side - Brand/Title (hidden on desktop) */}
                <div className="md:hidden">
                    <h1 className="text-lg font-semibold">Laundry</h1>
                </div>

                {/* Right side - User Menu */}
                <div className="ml-auto">
                    {isAuthenticated && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-10 w-10 rounded-full"
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback>
                                            {user.username.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.username}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {handleTranslateRole(user.role)}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="text-red-600 cursor-pointer"
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
            </div>
        </header>
    );
}
