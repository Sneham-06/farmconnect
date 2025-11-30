const mongoose = require('mongoose');

const MarketPriceSchema = new mongoose.Schema({
    commodity_name: { type: String, required: true },
    current_price_per_kg: { type: Number, required: true },
    price_change_percent_vs_last_week: { type: Number, required: true },
    level: { type: String, enum: ['high', 'medium', 'low'], required: true },
    last_updated_date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('MarketPrice', MarketPriceSchema);
