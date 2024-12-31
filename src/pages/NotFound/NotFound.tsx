import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="flex items-center justify-center h-screen flex-col gap-6">
            <span className="text-[100px] font-bold text-slate-500/80 -mb-10">404</span>
            <span className="font-bold text-3xl">Không tìm thấy trang</span>
            <span className="font-normal text-slate-500/80">Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa</span>
            <div className="w-[360px] grid grid-cols-2 gap-2">
                <Button onClick={() => navigate('/login')} variant={'outline'} className="">Đăng nhập</Button>
                <Button onClick={() => navigate('/')}>Trang chủ</Button>
            </div>
        </div>
    );
};

export default NotFound;
