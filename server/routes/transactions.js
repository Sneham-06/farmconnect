const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { authFarmer } = require('../middleware/auth');

// @route   GET /transactions
// @desc    Get all transactions for logged in farmer
// @access  Private (Farmer)
router.get('/', authFarmer, async (req, res) => {
    try {
        const transactions = await Transaction.find({ farmer_id: req.user.id }).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /transactions
// @desc    Create manual transaction
// @access  Private (Farmer)
router.post('/', authFarmer, async (req, res) => {
    const { product_id, buyer_name, quantity_kg, total_amount, payment_method, status } = req.body;

    try {
        const newTransaction = new Transaction({
            farmer_id: req.user.id,
            product_id,
            buyer_name,
            quantity_kg,
            total_amount,
            payment_method,
            status
        });

        const transaction = await newTransaction.save();
        res.json(transaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
