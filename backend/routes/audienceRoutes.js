const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer'); // Ensure this model exists and is correct

// POST /api/audience/preview - Calculate audience size based on conditions
router.post('/preview', async (req, res) => {
    const { conditions } = req.body;

    try {
        // Build a MongoDB query based on conditions
        const query = conditions.reduce((acc, condition, index) => {
            const { field, operator, value, logic } = condition;

            let conditionQuery = {};
            if (operator === 'gt') conditionQuery[field] = { $gt: value };
            else if (operator === 'lt') conditionQuery[field] = { $lt: value };
            else if (operator === 'eq') conditionQuery[field] = { $eq: value };
            else if (operator === 'lte') conditionQuery[field] = { $lte: value };
            else if (operator === 'gte') conditionQuery[field] = { $gte: value };

            if (index === 0) {
                acc = { ...conditionQuery };
            } else if (logic === 'AND') {
                acc = { ...acc, ...conditionQuery };
            } else if (logic === 'OR') {
                acc = { $or: [acc, conditionQuery] };
            }
            return acc;
        }, {});

        const audienceSize = await Customer.countDocuments(query);
        res.json({ audienceSize });
    } catch (error) {
        console.error('Error calculating audience size:', error);
        res.status(500).json({ error: 'Failed to calculate audience size' });
    }
});

// POST /api/audience/save - Save the audience segment
router.post('/save', async (req, res) => {
    const { conditions } = req.body;

    try {
        const segment = new AudienceSegment({ conditions });
        await segment.save();
        res.status(200).json({ message: 'Segment saved successfully' });
    } catch (error) {
        console.error('Error saving segment:', error);
        res.status(500).json({ error: 'Failed to save segment' });
    }
});


module.exports = router;
