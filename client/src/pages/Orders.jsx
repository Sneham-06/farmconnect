import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const Orders = () => {
    const { t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    const fetchOrders = async () => {
        try {
            const endpoint = user.role === 'farmer'
                ? 'https://farmconnect-backend-m1p3.onrender.com/orders/farmer'
                : 'https://farmconnect-backend-m1p3.onrender.com/orders';

            const res = await axios.get(endpoint, {
                headers: { 'x-auth-token': token }
            });
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user.role]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`https://farmconnect-backend-m1p3.onrender.com/orders/${id}/status`, { status: newStatus }, {
                headers: { 'x-auth-token': token }
            });
            fetchOrders();
        } catch (err) {
            alert(err.response?.data?.msg || 'Update failed');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'requested': return 'bg-yellow-100 text-yellow-800';
            case 'accepted': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">{t('orders')}</h1>
            <p className="text-gray-600 mb-8">
                {user.role === 'farmer' ? 'Manage incoming orders from consumers.' : 'Track your purchase requests.'}
            </p>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {user.role === 'farmer' ? 'Consumer' : 'Farmer'}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{order.product_id?.name || 'Unknown'}</div>
                                        <div className="text-xs text-gray-500">{new Date(order.order_date).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.role === 'farmer' ? order.consumer_id?.name : order.farmer_id?.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.quantity_kg} kg
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        ₹{order.total_amount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                            {t(order.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {user.role === 'farmer' && (
                                            <div className="flex space-x-2">
                                                {order.status === 'requested' && (
                                                    <>
                                                        <button onClick={() => handleStatusChange(order._id, 'accepted')} className="text-blue-600 hover:text-blue-900" title="Accept">
                                                            <CheckCircle size={20} />
                                                        </button>
                                                        <button onClick={() => handleStatusChange(order._id, 'cancelled')} className="text-red-600 hover:text-red-900" title="Reject">
                                                            <XCircle size={20} />
                                                        </button>
                                                    </>
                                                )}
                                                {order.status === 'accepted' && (
                                                    <button onClick={() => handleStatusChange(order._id, 'completed')} className="text-green-600 hover:text-green-900" title="Mark Completed">
                                                        <CheckCircle size={20} />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        {user.role === 'consumer' && order.status === 'requested' && (
                                            <button onClick={() => handleStatusChange(order._id, 'cancelled')} className="text-red-600 hover:text-red-900" title="Cancel Order">
                                                <XCircle size={20} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Orders;
