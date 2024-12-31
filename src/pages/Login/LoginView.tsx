import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';

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
    const [errors, setErrors] = useState<FormErrors>({});

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

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form data:', formData);
            // Xử lý logic đăng nhập ở đây
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-gray-50 p-2 sm:p-4">
            <div className="w-full max-w-[340px] sm:max-w-md space-y-4 sm:space-y-6 p-4 sm:p-8 bg-white rounded-xl shadow-lg">
                <div className="text-center space-y-1 sm:space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Chào mừng trở lại!</h2>
                    <p className="text-sm sm:text-base text-gray-500">Đăng nhập để quản lý dịch vụ giặt ủi của bạn</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Tên đăng nhập
                        </label>
                        <div className="mt-1 relative">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Nhập tên đăng nhập"
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Mật khẩu
                        </label>
                        <div className="mt-1 relative">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Nhập mật khẩu"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>
                        <div className="flex items-center justify-end mt-2">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginView;
