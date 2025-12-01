import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import { TrendingUp, ShoppingBag, Users, DollarSign } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

const Dashboard = () => {
    const { t } = useTranslation();
    const [data, setData] = useState(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const endpoint = user.role === 'farmer'
                    ? 'https://farmconnect-backend-m1p3.onrender.com/dashboard/farmer-summary'
                    : 'https://farmconnect-backend-m1p3.onrender.com/dashboard/consumer-summary';

                const res = await axios.get(endpoint, {
                    headers: { 'x-auth-token': token }
                });
                setData(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [user.role, token]);

    if (!data) return <div className="p-6">Loading...</div>;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">{t('dashboard')}</h1>
            <p className="text-gray-600 mb-8">{t('welcome_back')}</p>

            {user.role === 'farmer' ? (
                <>
                    {/* Farmer Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard title={t('total_income')} value={formatCurrency(data.total_income)} icon={DollarSign} color="bg-green-100 text-green-600" />
                        <StatCard title={t('market_orders')} value={data.number_of_orders} icon={ShoppingBag} color="bg-blue-100 text-blue-600" />
                        <StatCard title={t('active_products')} value={data.active_products_count} icon={TrendingUp} color="bg-yellow-100 text-yellow-600" />
                        <StatCard title="Ready to Harvest" value={data.ready_to_harvest_count} icon={Users} color="bg-purple-100 text-purple-600" />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold mb-4">Monthly Income Trends</h3>
                            <Bar
                                data={{
                                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                                    datasets: [{
                                        label: 'Income (INR)',
                                        data: data.monthly_income_data,
                                        backgroundColor: '#16a34a',
                                    }]
                                }}
                            />
                        </div>
                        {/* Placeholder for another chart */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold mb-4">Income Growth</h3>
                            <Line
                                data={{
                                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                                    datasets: [{
                                        label: 'Growth %',
                                        data: [10, 15, 12, 20, 25, 30], // Mock data
                                        borderColor: '#d97706',
                                        tension: 0.3
                                    }]
                                }}
                            />
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-semibold">{t('recent_transactions')}</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.recent_transactions.map((t) => (
                                        <tr key={t._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{t.product_id}</td> {/* Ideally populate name */}
                                            <td className="px-6 py-4 whitespace-nowrap">{t.buyer_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(t.total_amount)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${t.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {t.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Consumer Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard title="Total Spent" value={formatCurrency(data.total_spent)} icon={DollarSign} color="bg-green-100 text-green-600" />
                        <StatCard title="Total Orders" value={data.orders_count} icon={ShoppingBag} color="bg-blue-100 text-blue-600" />
                        <StatCard title="Pending Orders" value={data.pending_orders_count} icon={Users} color="bg-yellow-100 text-yellow-600" />
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-semibold">{t('recent_transactions')}</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.recent_orders.map((o) => (
                                        <tr key={o._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{o.product_id?.name || 'Unknown'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{o.farmer_id?.name || 'Unknown'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(o.total_amount)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${o.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {o.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow flex items-center">
        <div className={`p-3 rounded-full mr-4 ${color}`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

export default Dashboard;
