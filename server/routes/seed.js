const express = require('express');
const router = express.Router();
const MarketPrice = require('../models/MarketPrice');
const MarketOpportunity = require('../models/MarketOpportunity');

// @route   POST /seed/market
// @desc    Seed sample market data
// @access  Public (should be protected in production)
router.post('/market', async (req, res) => {
    try {
        // Clear existing data
        await MarketPrice.deleteMany({});
        await MarketOpportunity.deleteMany({});

        // Sample market prices
        const marketPrices = [
            { commodity_name: 'Tomatoes', current_price_per_kg: 30, price_change_percent_vs_last_week: 12, level: 'high' },
            { commodity_name: 'Onions', current_price_per_kg: 25, price_change_percent_vs_last_week: -5, level: 'medium' },
            { commodity_name: 'Potatoes', current_price_per_kg: 20, price_change_percent_vs_last_week: -3, level: 'low' },
            { commodity_name: 'Carrots', current_price_per_kg: 35, price_change_percent_vs_last_week: 8, level: 'high' },
            { commodity_name: 'Cabbage', current_price_per_kg: 18, price_change_percent_vs_last_week: -2, level: 'low' },
            { commodity_name: 'Cauliflower', current_price_per_kg: 40, price_change_percent_vs_last_week: 15, level: 'high' },
            { commodity_name: 'Spinach', current_price_per_kg: 28, price_change_percent_vs_last_week: 5, level: 'medium' },
            { commodity_name: 'Brinjal (Eggplant)', current_price_per_kg: 32, price_change_percent_vs_last_week: 10, level: 'high' }
        ];

        // Sample market opportunities
        const marketOpportunities = [
            { buyer_name: 'Fresh Mart Groceries', requirement_description: 'Organic Vegetables - Mixed variety', quantity_needed_kg: 500, offered_price_per_kg: 32, location: 'Mumbai, Maharashtra', status: 'active', contact_phone: '+91-9876543210', contact_email: 'procurement@freshmart.com' },
            { buyer_name: 'Green Valley Co-op', requirement_description: 'Fresh Tomatoes & Potatoes', quantity_needed_kg: 1000, offered_price_per_kg: 22, location: 'Bangalore, Karnataka', status: 'active', contact_phone: '+91-9876543211', contact_email: 'orders@greenvalley.com' },
            { buyer_name: 'Organic Foods Ltd', requirement_description: 'Premium Quality Organic Tomatoes', quantity_needed_kg: 300, offered_price_per_kg: 35, location: 'Delhi', status: 'active', contact_phone: '+91-9876543212', contact_email: 'sourcing@organicfoods.in' },
            { buyer_name: 'Farm Fresh Supermarket', requirement_description: 'Seasonal Vegetables - All types', quantity_needed_kg: 800, offered_price_per_kg: 28, location: 'Pune, Maharashtra', status: 'active', contact_phone: '+91-9876543213', contact_email: 'buy@farmfresh.com' },
            { buyer_name: 'Healthy Harvest Chain', requirement_description: 'Leafy Greens & Root Vegetables', quantity_needed_kg: 600, offered_price_per_kg: 30, location: 'Hyderabad, Telangana', status: 'active', contact_phone: '+91-9876543214', contact_email: 'procurement@healthyharvest.in' },
            { buyer_name: 'City Bazaar', requirement_description: 'Daily Fresh Vegetables', quantity_needed_kg: 400, offered_price_per_kg: 25, location: 'Chennai, Tamil Nadu', status: 'active', contact_phone: '+91-9876543215', contact_email: 'orders@citybazaar.com' }
        ];

        await MarketPrice.insertMany(marketPrices);
        await MarketOpportunity.insertMany(marketOpportunities);

        res.json({
            msg: 'Market data seeded successfully',
            prices: marketPrices.length,
            opportunities: marketOpportunities.length
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
