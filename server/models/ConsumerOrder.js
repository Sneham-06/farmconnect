const mongoose = require('mongoose');

const ConsumerOrderSchema = new mongoose.Schema({
    consumer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity_kg: { type: Number, required: true },
    price_per_kg: { type: Number, required: true },
    total_amount: { type: Number, required: true },
    payment_method: { type: String, enum: ['Cash', 'Bank Transfer', 'UPI'], default: 'Cash' },
    status: {
        type: String,
        enum: ['requested', 'accepted', 'completed', 'cancelled'],
        default: 'requested'
    },
    order_date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('ConsumerOrder', ConsumerOrderSchema);
