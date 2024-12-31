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
import Cookies from "js-cookie";

export const Header = () => {

    const navigate = useNavigate()

    const authUser = {
        role: 'admin',
        userName: 'Admin',
        image: 'https://via.placeholder.com/150'
    }

    const handleLogout = async () => {
        Cookies.remove('_at')
        const a = document.createElement('a')
        a.href = '/login'
        a.click()
    }
    const handleTranslateRole = (value: string) => {
        if (value == 'student') {
            return 'Học viên'
        }
        if (value == 'teacher') {
            return 'Giáo viên'
        }
        return 'Quản trị viên'
    }
    return (
        <header
            className="w-full h-20 bg-white px-4 flex items-center fixed top-0 left-0 z-50 p-2 pr-12 pl-[300px] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
            {/* <div className="rounded-full p-1 px-4 border flex items-center gap-2 border-slate-500/20 w-1/3 focus-within:border-primary group">
                <Search size={18} className="text-slate-400" />
                <input placeholder="Tìm kiếm khóa học, bài viết, video, ..." className="flex-1 border-none shadow-none outline-none h-9 text-sm text-slate-700" />
            </div> */}
            <div className="flex-1 flex items-center gap-4 justify-end">
                {/* <Button variant={'link'} className="font-bold text-sm px-0 underline-0"
                    onClick={() => handleTeacher()}>For teacher</Button> */}
                {/* <Bell className="text-slate-500 cursor-pointer" /> */}
                {/* <Button variant={'link'} className="font-bold text-sm px-0" onClick={handleCourse}>
                    Khóa học của tôi
                </Button> */}
                {
                    authUser ?
                        (
                            <>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild className="w-10 h-10 rounded-full bg-secondary text-xl flex items-center justify-center border relative cursor-pointer">
                                        {
                                            authUser?.image ?
                                                <img src={authUser?.image} className="w-10 h-10 rounded-full" alt="" />
                                                : <p className="font-semibold text-primary uppercase border">{authUser?.userName?.slice(0, 1)}</p>
                                        }
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="border-border/20 w-60">
                                        <DropdownMenuLabel>
                                            <div className="py-2">
                                                <span className="text-normal">{authUser.userName}</span>
                                                <p className="font-light text-[12px] text-slate-500/80">
                                                    {handleTranslateRole(authUser.role)}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => navigate('/profile')}
                                            className="text-slate-500 py-3 cursor-pointer">Trang cá nhân</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                            className="text-slate-500 py-3 cursor-pointer">Đăng xuất</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        )
                        :
                        (
                            <Link className="flex items-center gap-2 font-medium cursor-pointer " to="/login">
                                <CircleUserRound className="" />
                                <span className="lg:inline hidden">Thành viên</span>
                            </Link>
                        )
                }
            </div>
        </header>
    )
};
