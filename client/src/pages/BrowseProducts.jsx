import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, MapPin } from 'lucide-react';

const BrowseProducts = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [orderQuantity, setOrderQuantity] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const token = localStorage.getItem('token');

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/products/public', {
                headers: { 'x-auth-token': token }
            });
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleOrderClick = (product) => {
        setSelectedProduct(product);
        setOrderQuantity(1);
        setIsModalOpen(true);
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/orders', {
                product_id: selectedProduct._id,
                quantity_kg: orderQuantity,
                payment_method: paymentMethod
            }, {
                headers: { 'x-auth-token': token }
            });
            alert('Order placed successfully!');
            setIsModalOpen(false);
            fetchProducts(); // Refresh to see updated quantities if needed (though quantity only updates on completion)
        } catch (err) {
            alert(err.response?.data?.msg || 'Order failed');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Browse Products</h1>
            <p className="text-gray-600 mb-8">Fresh produce directly from farmers.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                            <span className="text-4xl">🥬</span> {/* Placeholder image */}
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                                <span className="text-lg font-bold text-primary">₹{product.price_per_kg}/kg</span>
                            </div>

                            <div className="flex items-center text-gray-500 mb-4 text-sm">
                                <MapPin size={16} className="mr-1" />
                                {product.farmer_id?.village}, {product.farmer_id?.state}
                            </div>

                            <div className="flex justify-between items-center mb-6 text-sm">
                                <span className="text-gray-600">Farmer: <span className="font-medium text-gray-800">{product.farmer_id?.name}</span></span>
                                <span className="text-gray-600">Available: <span className="font-medium text-gray-800">{product.quantity_kg} kg</span></span>
                            </div>

                            <button
                                onClick={() => handleOrderClick(product)}
                                className="w-full bg-primary text-white py-2 rounded flex items-center justify-center hover:bg-green-700 transition"
                            >
                                <ShoppingCart size={18} className="mr-2" />
                                {t('order_now')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Order Modal */}
            {isModalOpen && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Place Order</h2>
                        <p className="mb-4 text-gray-600">Ordering <span className="font-bold">{selectedProduct.name}</span> from {selectedProduct.farmer_id?.name}</p>

                        <form onSubmit={handlePlaceOrder}>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">{t('quantity')} (kg)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={selectedProduct.quantity_kg}
                                    value={orderQuantity}
                                    onChange={(e) => setOrderQuantity(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Total: ₹{orderQuantity * selectedProduct.price_per_kg}</p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold mb-2">Payment Method</label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="UPI">UPI</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">{t('cancel')}</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-green-700">Confirm Order</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrowseProducts;
