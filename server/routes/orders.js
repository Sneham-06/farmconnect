const express = require('express');
const router = express.Router();
const ConsumerOrder = require('../models/ConsumerOrder');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const { auth, authConsumer, authFarmer } = require('../middleware/auth');

// @route   POST /orders
// @desc    Create a new order (Consumer)
// @access  Private (Consumer)
router.post('/', authConsumer, async (req, res) => {
    const { product_id, quantity_kg, payment_method } = req.body;

    try {
        const product = await Product.findById(product_id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        if (product.quantity_kg < quantity_kg) {
            return res.status(400).json({ msg: 'Insufficient quantity available' });
        }

        const total_amount = product.price_per_kg * quantity_kg;

        const newOrder = new ConsumerOrder({
            consumer_id: req.user.id,
            farmer_id: product.farmer_id,
            product_id,
            quantity_kg,
            price_per_kg: product.price_per_kg,
            total_amount,
            payment_method,
            status: 'requested'
        });

        const order = await newOrder.save();
        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /orders
// @desc    Get orders for current consumer
// @access  Private (Consumer)
router.get('/', authConsumer, async (req, res) => {
    try {
        const orders = await ConsumerOrder.find({ consumer_id: req.user.id })
            .populate('product_id', 'name')
            .populate('farmer_id', 'name')
            .sort({ order_date: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /farmer/orders
// @desc    Get orders for current farmer
// @access  Private (Farmer)
router.get('/farmer', authFarmer, async (req, res) => {
    try {
        const orders = await ConsumerOrder.find({ farmer_id: req.user.id })
            .populate('product_id', 'name')
            .populate('consumer_id', 'name')
            .sort({ order_date: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /orders/:id/status
// @desc    Update order status
// @access  Private (Both)
router.put('/:id/status', auth, async (req, res) => {
    const { status } = req.body;

    try {
        let order = await ConsumerOrder.findById(req.params.id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        // Check permissions and valid transitions
        if (req.user.role === 'farmer') {
            if (order.farmer_id.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'Not authorized' });
            }
            // Farmer transitions
            if (status === 'accepted' && order.status === 'requested') {
                order.status = 'accepted';
            } else if (status === 'completed' && order.status === 'accepted') {
                order.status = 'completed';

                // Logic for completion: reduce product quantity, create transaction
                const product = await Product.findById(order.product_id);
                if (product) {
                    product.quantity_kg -= order.quantity_kg;
                    if (product.quantity_kg <= 0) {
                        product.quantity_kg = 0; // Ensure not negative
                        product.status = 'sold';
                    }
                    await product.save();
                }

                // Create Transaction
                const newTransaction = new Transaction({
                    farmer_id: order.farmer_id,
                    product_id: order.product_id,
                    consumer_id: order.consumer_id,
                    buyer_name: 'Consumer Order', // Or fetch consumer name if needed, but we have ID
                    quantity_kg: order.quantity_kg,
                    total_amount: order.total_amount,
                    payment_method: order.payment_method,
                    status: 'completed'
                });
                await newTransaction.save();

            } else if (status === 'cancelled') {
                order.status = 'cancelled';
            } else {
                return res.status(400).json({ msg: 'Invalid status transition' });
            }
        } else if (req.user.role === 'consumer') {
            if (order.consumer_id.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'Not authorized' });
            }
            // Consumer transitions
            if (status === 'cancelled' && order.status === 'requested') {
                order.status = 'cancelled';
            } else {
                return res.status(400).json({ msg: 'Invalid status transition or action not allowed' });
            }
        } else {
            return res.status(403).json({ msg: 'Invalid role' });
        }

        await order.save();
        res.json(order);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
