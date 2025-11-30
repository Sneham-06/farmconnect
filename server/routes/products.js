const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, authFarmer, authConsumer } = require('../middleware/auth');

// @route   GET /products
// @desc    Get all products for logged in farmer
// @access  Private (Farmer)
router.get('/', authFarmer, async (req, res) => {
    try {
        const products = await Product.find({ farmer_id: req.user.id }).sort({ date: -1 });
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /products
// @desc    Add new product
// @access  Private (Farmer)
router.post('/', authFarmer, async (req, res) => {
    const { name, category, quantity_kg, price_per_kg, harvest_date, status } = req.body;

    try {
        const newProduct = new Product({
            farmer_id: req.user.id,
            name,
            category,
            quantity_kg,
            price_per_kg,
            harvest_date,
            status
        });

        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /products/:id
// @desc    Update product
// @access  Private (Farmer)
router.put('/:id', authFarmer, async (req, res) => {
    const { name, category, quantity_kg, price_per_kg, harvest_date, status } = req.body;

    // Build product object
    const productFields = {};
    if (name) productFields.name = name;
    if (category) productFields.category = category;
    if (quantity_kg) productFields.quantity_kg = quantity_kg;
    if (price_per_kg) productFields.price_per_kg = price_per_kg;
    if (harvest_date) productFields.harvest_date = harvest_date;
    if (status) productFields.status = status;

    try {
        let product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ msg: 'Product not found' });

        // Make sure user owns product
        if (product.farmer_id.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: productFields },
            { new: true }
        );

        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /products/:id
// @desc    Delete product
// @access  Private (Farmer)
router.delete('/:id', authFarmer, async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ msg: 'Product not found' });

        // Make sure user owns product
        if (product.farmer_id.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Product.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /public/products
// @desc    Get all available products (Consumer browsing)
// @access  Private (Consumer) - Spec says accessible to authenticated consumers
router.get('/public', authConsumer, async (req, res) => {
    try {
        const products = await Product.find({ status: 'available' })
            .populate('farmer_id', 'name village state')
            .sort({ date: -1 });
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
