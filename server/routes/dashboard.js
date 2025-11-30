const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const ConsumerOrder = require('../models/ConsumerOrder');
const Product = require('../models/Product');
const { authFarmer, authConsumer } = require('../middleware/auth');

// @route   GET /dashboard/farmer-summary
// @desc    Get dashboard summary for farmer
// @access  Private (Farmer)
router.get('/farmer-summary', authFarmer, async (req, res) => {
    try {
        const farmerId = req.user.id;

        // Transactions
        const transactions = await Transaction.find({ farmer_id: farmerId });
        const completedTransactions = transactions.filter(t => t.status === 'completed');
        const pendingTransactions = transactions.filter(t => t.status === 'pending');

        const totalIncome = completedTransactions.reduce((acc, curr) => acc + curr.total_amount, 0);

        // Orders
        const orders = await ConsumerOrder.find({ farmer_id: farmerId });
        const newOrders = orders.filter(o => o.status === 'requested');

        // Products
        const products = await Product.find({ farmer_id: farmerId });
        const activeProducts = products.filter(p => p.status === 'available');
        const readyToHarvest = activeProducts.filter(p => new Date(p.harvest_date) <= new Date());

        // Monthly Income Data (Mock logic or aggregation)
        // For simplicity, let's just return 0s if no data, or aggregate real data
        const monthlyIncomeData = Array(12).fill(0);
        completedTransactions.forEach(t => {
            const month = new Date(t.date).getMonth();
            monthlyIncomeData[month] += t.total_amount;
        });

        res.json({
            total_income: totalIncome,
            completed_sales_count: completedTransactions.length,
            pending_sales_count: pendingTransactions.length,
            number_of_orders: orders.length,
            number_of_new_orders: newOrders.length,
            active_products_count: activeProducts.length,
            ready_to_harvest_count: readyToHarvest.length,
            monthly_income_data: monthlyIncomeData,
            income_growth_data: [], // Placeholder
            recent_transactions: transactions.slice(0, 5)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /dashboard/consumer-summary
// @desc    Get dashboard summary for consumer
// @access  Private (Consumer)
router.get('/consumer-summary', authConsumer, async (req, res) => {
    try {
        const consumerId = req.user.id;

        const orders = await ConsumerOrder.find({ consumer_id: consumerId }).populate('product_id', 'name').populate('farmer_id', 'name');
        const completedOrders = orders.filter(o => o.status === 'completed');
        const pendingOrders = orders.filter(o => o.status === 'requested' || o.status === 'accepted');

        const totalSpent = completedOrders.reduce((acc, curr) => acc + curr.total_amount, 0);

        res.json({
            total_spent: totalSpent,
            orders_count: orders.length,
            completed_orders_count: completedOrders.length,
            pending_orders_count: pendingOrders.length,
            recent_orders: orders.slice(0, 5)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
