const express = require('express');
const router = express.Router();
const redisClient = require('../redisClient'); // Import `redisClient` directly

// POST /api/customers - Validate and publish data to Redis
router.post('/', async (req, res) => {
    const { name, email, totalSpending, lastVisit } = req.body;

    // Basic validation
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    const customerData = { name, email, totalSpending, lastVisit };

    try {
        // Publish data directly with redisClient
        await redisClient.publish('customerChannel', JSON.stringify(customerData));
        res.status(200).json({ message: 'Customer data published for processing' });
    } catch (error) {
        res.status(500).json({ error: 'Redis publish failed: ' + error.message });
    }
});

module.exports = router;
