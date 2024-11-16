const express = require('express');
const router = express.Router();
const redisClient = require('../redisClient'); // Import `redisClient` directly
const Order = require('../models/Order'); // Assuming you have an Order model

// POST /api/orders - Create a new order and publish to Redis
router.post('/', async (req, res) => {
    const { customerId, amount, date } = req.body;

    // Basic validation
    if (!customerId || !amount || !date) {
        return res.status(400).json({ error: 'customerId, amount, and date are required' });
    }

    const orderData = { customerId, amount, date };

    try {
        // Save order to MongoDB
        const newOrder = new Order(orderData);
        await newOrder.save();

        // Publish order data to Redis for other services or processes
        await redisClient.publish('orderChannel', JSON.stringify(orderData));

        res.status(201).json({ message: 'Order created and published', order: newOrder });
    } catch (error) {
        res.status(500).json({ error: 'Redis publish failed: ' + error.message });
    }
});

// GET /api/orders - Retrieve all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve orders: ' + error.message });
    }
});

module.exports = router;
