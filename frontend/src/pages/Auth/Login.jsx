import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, Loader } from 'lucide-react';
import { useAuthStore } from '../../store/AuthStore';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isUnverifiedDoctor, setIsUnverifiedDoctor] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // 🔹 New loading state

    const navigate = useNavigate();
    const { login, logout } = useAuthStore();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true); // Start loader

        try {
            await login(formData);

            const user = useAuthStore.getState().user;
            if (!user) {
                setError('Login failed. Invalid credentials.');
                return;
            }

            if (user.role === 'doctor' && !user.isValidated) {
                setIsUnverifiedDoctor(true);
                await logout();
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false); // Stop loader
        }
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center px-4 bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl space-y-6">
                <div>
                    <h2 className="text-3xl font-bold text-center text-gray-900">Welcome Back!</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Don&apos;t have an account?{' '}
                        <button
                            onClick={() => navigate('/auth/register')}
                            className="text-orange-600 font-medium hover:underline"
                        >
                            Sign up
                        </button>
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <div className="relative mt-1">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="you@example.com"
                                className="w-full pl-3 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative mt-1">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                id="password"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="********"
                                className="w-full pl-3 pr-10 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <div
                                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword
                                    ? <EyeOff className="h-5 w-5 text-gray-400" />
                                    : <Eye className="h-5 w-5 text-gray-400" />}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading} // disable while loading
                        className={`w-full py-2 px-4 font-semibold rounded-md transition-colors flex items-center justify-center 
                            ${isLoading ? 'bg-orange-500 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 text-white'}`}
                    >
                        {isLoading ? (
                            <>
                                <Loader className="animate-spin h-5 w-5 mr-2" />
                                Signing In...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>
            </div>

            {/* Unverified Modal */}
            {isUnverifiedDoctor && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="bg-orange-100 p-4 rounded-full">
                                <CheckCircle className="text-orange-600 w-12 h-12" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Verification Pending</h3>
                        <p className="text-gray-600">
                            Your doctor account is under review by our admin team.
                            You&apos;ll be notified via email once your account is verified.
                        </p>
                        <button
                            onClick={() => setIsUnverifiedDoctor(false)}
                            className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md"
                        >
                            Understood
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
