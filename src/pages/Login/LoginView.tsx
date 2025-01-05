import { toast } from '@/hooks/use-toast';
import AuthService from '@/services/auth.service';
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
interface LoginFormData {
    username: string;
    password: string;
}

interface FormErrors {
    username?: string;
    password?: string;
}

const LoginView = () => {
    const [formData, setFormData] = useState<LoginFormData>({
        username: '',
        password: '',
    });
    const { setAuth } = useAuthStore()
    const [errors, setErrors] = useState<FormErrors>({});
    const authService = new AuthService('auth')
    const navigate = useNavigate()
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.username) {
            newErrors.username = 'Tên đăng nhập là bắt buộc';
        }

        if (!formData.password) {
            newErrors.password = 'Mật khẩu là bắt buộc';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            const res: any = await authService.login(formData)
            if (res.status === 200) {
                const { token, user } = res.data
                setAuth(token, user)
                navigate('/')
                toast({
                    title: 'Đăng nhập thành công',
                    description: 'Chào mừng bạn đã đăng nhập',
                    variant: 'default'
                })
            } else {
                toast({
                    title: 'Đăng nhập thất bại',
                    description: 'Tên đăng nhập hoặc mật khẩu không đúng',
                    variant: 'destructive'
                })
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="w-full max-w-md px-6">
            <div className="space-y-8">
                <div className="flex justify-center">
                    <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Đăng nhập</h2>
                    <p className="text-gray-500">Quản lý dịch vụ giặt ủi của bạn</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Tên đăng nhập
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all px-4 py-3"
                                placeholder="Nhập tên đăng nhập"
                            />
                            {errors.username && (
                                <p className="mt-2 text-sm text-red-600">{errors.username}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Mật khẩu
                        </label>
                        <div className="mt-1">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all px-4 py-3"
                                placeholder="Nhập mật khẩu"
                            />
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>
                        {/* <div className="flex items-center justify-end mt-2">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div> */}
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium transition-colors"
                    >
                        Đăng nhập
                    </button>
                </form>

                {/* <p className="text-center text-sm text-gray-500">
                    Chưa có tài khoản?{' '}
                    <Link to="/register" className="font-medium text-blue-600 hover:text-blue-800">
                        Đăng ký ngay
                    </Link>
                </p> */}
            </div>
        </div>
    );
};

export default LoginView;
