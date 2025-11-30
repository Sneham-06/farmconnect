const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    consumer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional
    buyer_name: { type: String, required: true }, // Can be consumer name or external buyer
    quantity_kg: { type: Number, required: true },
    total_amount: { type: Number, required: true },
    currency_code: { type: String, default: 'INR' },
    payment_method: { type: String, enum: ['Cash', 'Bank Transfer', 'UPI'], default: 'Cash' },
    status: { type: String, enum: ['completed', 'pending'], default: 'completed' },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
