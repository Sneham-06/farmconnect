import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2 } from 'lucide-react';

const Products = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const token = localStorage.getItem('token');

    const [formData, setFormData] = useState({
        name: '',
        category: 'Vegetables',
        quantity_kg: '',
        price_per_kg: '',
        harvest_date: '',
        status: 'available'
    });

    const fetchProducts = async () => {
        try {
            const res = await axios.get('https://farmconnect-backend-m1p3.onrender.com/products', {
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

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await axios.delete(`https://farmconnect-backend-m1p3.onrender.com/products/${id}`, {
                    headers: { 'x-auth-token': token }
                });
                fetchProducts();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            quantity_kg: product.quantity_kg,
            price_per_kg: product.price_per_kg,
            harvest_date: product.harvest_date.split('T')[0],
            status: product.status
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentProduct) {
                await axios.put(`https://farmconnect-backend-m1p3.onrender.com/products/${currentProduct._id}`, formData, {
                    headers: { 'x-auth-token': token }
                });
            } else {
                await axios.post('https://farmconnect-backend-m1p3.onrender.com/products', formData, {
                    headers: { 'x-auth-token': token }
                });
            }
            setIsModalOpen(false);
            setCurrentProduct(null);
            setFormData({ name: '', category: 'Vegetables', quantity_kg: '', price_per_kg: '', harvest_date: '', status: 'available' });
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{t('products')}</h1>
                    <p className="text-gray-600">Manage your farm products and inventory.</p>
                </div>
                <button
                    onClick={() => { setCurrentProduct(null); setIsModalOpen(true); }}
                    className="bg-primary text-white px-4 py-2 rounded flex items-center hover:bg-green-700"
                >
                    <Plus size={20} className="mr-2" />
                    {t('add_product')}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                                <span className={`px-2 py-1 text-xs rounded-full ${product.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {t(product.status)}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">{product.category}</p>

                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">{t('quantity')}</span>
                                    <span className="font-semibold">{product.quantity_kg} kg</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">{t('price_per_kg')}</span>
                                    <span className="font-semibold">₹{product.price_per_kg}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">{t('harvest_date')}</span>
                                    <span className="font-semibold">{new Date(product.harvest_date).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-4 border-t">
                                <button
                                    onClick={() => handleEdit(product)}
                                    className="flex-1 flex items-center justify-center text-blue-600 hover:bg-blue-50 py-2 rounded"
                                >
                                    <Edit size={18} className="mr-2" />
                                    {t('edit')}
                                </button>
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className="flex-1 flex items-center justify-center text-red-600 hover:bg-red-50 py-2 rounded"
                                >
                                    <Trash2 size={18} className="mr-2" />
                                    {t('delete')}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">{currentProduct ? t('edit') : t('add_product')}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">{t('name')}</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border rounded px-3 py-2" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">{t('category')}</label>
                                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full border rounded px-3 py-2">
                                    <option value="Vegetables">Vegetables</option>
                                    <option value="Fruits">Fruits</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="flex space-x-4 mb-4">
                                <div className="w-1/2">
                                    <label className="block text-sm font-bold mb-2">{t('quantity')} (kg)</label>
                                    <input type="number" value={formData.quantity_kg} onChange={(e) => setFormData({ ...formData, quantity_kg: e.target.value })} className="w-full border rounded px-3 py-2" required />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm font-bold mb-2">{t('price_per_kg')} (₹)</label>
                                    <input type="number" value={formData.price_per_kg} onChange={(e) => setFormData({ ...formData, price_per_kg: e.target.value })} className="w-full border rounded px-3 py-2" required />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">{t('harvest_date')}</label>
                                <input type="date" value={formData.harvest_date} onChange={(e) => setFormData({ ...formData, harvest_date: e.target.value })} className="w-full border rounded px-3 py-2" required />
                            </div>
                            {currentProduct && (
                                <div className="mb-6">
                                    <label className="block text-sm font-bold mb-2">{t('status')}</label>
                                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full border rounded px-3 py-2">
                                        <option value="available">{t('available')}</option>
                                        <option value="sold">{t('sold')}</option>
                                    </select>
                                </div>
                            )}
                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">{t('cancel')}</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-green-700">{t('save')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
