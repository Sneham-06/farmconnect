import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, ShoppingBag, TrendingUp, ClipboardList, LogOut, Menu, X } from 'lucide-react';

const Layout = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        // Optionally save preference to backend
    };

    const navItems = [
        { path: '/dashboard', label: t('dashboard'), icon: LayoutDashboard, roles: ['farmer', 'consumer'] },
        { path: '/market', label: t('market_access'), icon: TrendingUp, roles: ['farmer', 'consumer'] },
        { path: '/products', label: t('products'), icon: ShoppingBag, roles: ['farmer'] },
        { path: '/browse', label: t('products'), icon: ShoppingBag, roles: ['consumer'] },
        { path: '/transactions', label: t('transactions'), icon: ClipboardList, roles: ['farmer'] },
        { path: '/orders', label: t('orders'), icon: ClipboardList, roles: ['farmer', 'consumer'] },
    ];

    const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
                <div className="flex items-center justify-between p-4 border-b">
                    <h1 className="text-2xl font-bold text-primary">{t('app_name')}</h1>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
                        <X size={24} />
                    </button>
                </div>
                <nav className="mt-4">
                    {filteredNavItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-primary ${location.pathname === item.path ? 'bg-green-50 text-primary border-r-4 border-primary' : ''}`}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <item.icon size={20} className="mr-3" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="absolute bottom-0 w-full p-4 border-t">
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded">
                        <LogOut size={20} className="mr-3" />
                        {t('logout')}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between p-4 bg-white shadow-sm">
                    <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-gray-600">
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center space-x-4 ml-auto">
                        <select
                            className="border rounded px-2 py-1 text-sm"
                            value={i18n.language}
                            onChange={(e) => changeLanguage(e.target.value)}
                        >
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                            <option value="kn">Kannada</option>
                            <option value="te">Telugu</option>
                        </select>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <span className="hidden md:block text-sm font-medium">{user.name}</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
