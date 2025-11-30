import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MarketAccess = () => {
    const { t } = useTranslation();
    const [prices, setPrices] = useState([]);
    const [opportunities, setOpportunities] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pricesRes = await axios.get('http://localhost:5000/market/prices', {
                    headers: { 'x-auth-token': token }
                });
                setPrices(pricesRes.data);

                const oppsRes = await axios.get('http://localhost:5000/market/opportunities', {
                    headers: { 'x-auth-token': token }
                });
                setOpportunities(oppsRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [token]);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">{t('market_access')}</h1>
            <p className="text-gray-600 mb-8">Current market prices and buyer opportunities.</p>

            {/* Market Prices */}
            <h2 className="text-xl font-semibold mb-4">{t('market_prices')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {prices.map((price) => (
                    <div key={price._id} className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-gray-800">{price.commodity_name}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${price.level === 'high' ? 'bg-green-100 text-green-800' :
                                    price.level === 'low' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {price.level.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-2">₹{price.current_price_per_kg}<span className="text-sm text-gray-500 font-normal">/kg</span></p>
                        <div className={`flex items-center text-sm ${price.price_change_percent_vs_last_week > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {price.price_change_percent_vs_last_week > 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                            {Math.abs(price.price_change_percent_vs_last_week)}% vs last week
                        </div>
                    </div>
                ))}
            </div>

            {/* Market Opportunities */}
            <h2 className="text-xl font-semibold mb-4">{t('market_opportunities')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {opportunities.map((opp) => (
                    <div key={opp._id} className="bg-white p-6 rounded-lg shadow border-l-4 border-secondary">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{opp.buyer_name}</h3>
                        <p className="text-sm text-gray-500 mb-4">{opp.location}</p>

                        <div className="mb-4">
                            <p className="text-sm font-semibold text-gray-700">Requirement:</p>
                            <p className="text-gray-600">{opp.requirement_description}</p>
                        </div>

                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <p className="text-xs text-gray-500">Quantity</p>
                                <p className="font-semibold">{opp.quantity_needed_kg} kg</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Offered Price</p>
                                <p className="font-semibold text-primary">₹{opp.offered_price_per_kg}/kg</p>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button className="flex-1 bg-primary text-white py-2 rounded hover:bg-green-700 transition">
                                {t('contact_buyer')}
                            </button>
                            <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 transition">
                                Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketAccess;
