const mongoose = require('mongoose');

const MarketOpportunitySchema = new mongoose.Schema({
    buyer_name: { type: String, required: true },
    requirement_description: { type: String, required: true },
    quantity_needed_kg: { type: Number, required: true },
    offered_price_per_kg: { type: Number, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ['active', 'closed'], default: 'active' },
    contact_phone: { type: String },
    contact_email: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('MarketOpportunity', MarketOpportunitySchema);
