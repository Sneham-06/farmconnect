import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { User, Phone, Mail, Lock, MapPin, Sprout } from 'lucide-react';

const Signup = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        role: 'farmer',
        village: '',
        state: '',
        city: '',
        preferred_language: 'en'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Signup failed');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 flex flex-col justify-center w-full">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <Sprout size={28} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold">FarmConnect</h1>
                    </div>

                    <h2 className="text-5xl font-bold mb-6 leading-tight">
                        Join India's Largest<br />Farm Network
                    </h2>
                    <p className="text-xl text-white/90 mb-12 max-w-md">
                        Whether you're a farmer or consumer, connect with thousands and transform how agriculture works.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <p className="text-lg">List and sell your produce directly</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <p className="text-lg">Access fresh farm products instantly</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <p className="text-lg">Track income and manage orders</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
                <div className="w-full max-w-md py-8">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                            <Sprout size={28} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">FarmConnect</h1>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
                            <p className="text-gray-500">Join the farming revolution today</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center">
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Role Selector */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('role')}</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'farmer' })}
                                        className={`p-3 rounded-xl border-2 transition-all ${formData.role === 'farmer' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <div className="text-center">
                                            <div className={`text-xl mb-1 ${formData.role === 'farmer' ? 'text-green-600' : 'text-gray-400'}`}>🌾</div>
                                            <div className={`text-sm font-semibold ${formData.role === 'farmer' ? 'text-green-600' : 'text-gray-700'}`}>{t('farmer')}</div>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'consumer' })}
                                        className={`p-3 rounded-xl border-2 transition-all ${formData.role === 'consumer' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <div className="text-center">
                                            <div className={`text-xl mb-1 ${formData.role === 'consumer' ? 'text-green-600' : 'text-gray-400'}`}>🛒</div>
                                            <div className={`text-sm font-semibold ${formData.role === 'consumer' ? 'text-green-600' : 'text-gray-700'}`}>{t('consumer')}</div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('name')}</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone & Email */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('phone')}</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                            placeholder="Phone"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('email')}</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                            placeholder="Email"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('password')}</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        placeholder="Create a password"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Location Fields */}
                            {formData.role === 'farmer' ? (
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('village')}</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                name="village"
                                                value={formData.village}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                placeholder="Village"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('state')}</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                placeholder="State"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('city')}</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                            placeholder="City (optional)"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Language */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('preferred_language')}</label>
                                <select
                                    name="preferred_language"
                                    value={formData.preferred_language}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                >
                                    <option value="en">English</option>
                                    <option value="hi">हिन्दी (Hindi)</option>
                                    <option value="kn">ಕನ್ನಡ (Kannada)</option>
                                    <option value="te">తెలుగు (Telugu)</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Creating account...
                                    </div>
                                ) : (
                                    t('signup')
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <Link to="/login" className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                                    {t('login')}
                                </Link>
                            </p>
                        </div>
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        © 2025 FarmConnect. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
