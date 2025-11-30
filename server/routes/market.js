const express = require('express');
const router = express.Router();
const MarketPrice = require('../models/MarketPrice');
const MarketOpportunity = require('../models/MarketOpportunity');
const { auth } = require('../middleware/auth');

// @route   GET /market/prices
// @desc    Get all market prices
// @access  Private (Both)
router.get('/prices', auth, async (req, res) => {
    try {
        const prices = await MarketPrice.find().sort({ last_updated_date: -1 });
        res.json(prices);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /market/opportunities
// @desc    Get all market opportunities
// @access  Private (Both)
router.get('/opportunities', auth, async (req, res) => {
    try {
        const opportunities = await MarketOpportunity.find({ status: 'active' }).sort({ created_at: -1 });
        res.json(opportunities);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
