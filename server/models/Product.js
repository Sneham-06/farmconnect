const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    category: { type: String, enum: ['Vegetables', 'Fruits', 'Other'], required: true },
    quantity_kg: { type: Number, required: true },
    price_per_kg: { type: Number, required: true }, // In INR
    currency_code: { type: String, default: 'INR' },
    status: { type: String, enum: ['available', 'sold'], default: 'available' },
    harvest_date: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
