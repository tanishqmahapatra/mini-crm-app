// campaignRoutes.js

const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const CommunicationsLog = require('../models/CommunicationsLog');
const Customer = require('../models/Customer');
const axios = require('axios');

// POST /api/campaigns - Create a new campaign and save audience in communications_log
router.post('/', async (req, res) => {
    const { name, segmentConditions, message, audienceSize } = req.body;

    if (!name || !message || !segmentConditions) {
        return res.status(400).json({ error: 'Campaign name, message, and segment conditions are required.' });
    }

    try {
        // Step 1: Create and save the new campaign
        const newCampaign = new Campaign({
            name,
            segmentConditions,
            message,
            audienceSize,
        });
        await newCampaign.save();

        // Step 2: Find the target audience based on the segment conditions
        const audience = await Customer.find(segmentConditions);
        if (!audience || audience.length === 0) {
            return res.status(404).json({ error: 'No audience found for the specified conditions.' });
        }

        // Step 3: Create and save communication logs for each audience member
        const logEntries = await Promise.all(audience.map(async (customer) => {
            const personalizedMessage = `Hi ${customer.name}, here’s 10% off on your next order!`;
            const logEntry = new CommunicationsLog({
                campaignId: newCampaign._id,
                customerId: customer._id,
                message: personalizedMessage,
                status: 'PENDING',
                sentAt: new Date(),
            });
            await logEntry.save();

            // Step 4: Attempt to call the delivery receipt API
            try {
                await axios.post(`http://localhost:3001/api/campaigns/${logEntry._id}/delivery`);
            } catch (deliveryError) {
                console.error(`Failed to call delivery receipt for message ID ${logEntry._id}:`, deliveryError.message);
            }

            return logEntry;
        }));

        res.status(201).json({ message: 'Campaign created and messages sent to audience', logEntries });
    } catch (error) {
        console.error('Error creating campaign:', error);
        res.status(500).json({ error: 'Failed to create campaign', details: error.message });
    }
});

// GET /api/campaigns - Retrieve all campaigns, ordered by most recent
router.get('/', async (req, res) => {
    try {
        const campaigns = await Campaign.find().sort({ createdAt: -1 });
        res.json(campaigns);
    } catch (error) {
        console.error('Error retrieving campaigns:', error);
        res.status(500).json({ error: 'Failed to retrieve campaigns' });
    }
});

// GET /api/campaigns/:campaignId/stats - Retrieve campaign statistics by campaignId
router.get('/:campaignId/stats', async (req, res) => {
    const { campaignId } = req.params;

    try {
        const sentCount = await CommunicationsLog.countDocuments({ campaignId, status: 'SENT' });
        const failedCount = await CommunicationsLog.countDocuments({ campaignId, status: 'FAILED' });
        const audienceSize = sentCount + failedCount;

        res.json({ audienceSize, sentCount, failedCount });
    } catch (error) {
        console.error('Error fetching campaign stats:', error);
        res.status(500).json({ error: 'Failed to fetch campaign statistics' });
    }
});

// GET /api/campaigns/:campaignId/logs - Retrieve communication logs for a campaign
router.get('/:campaignId/logs', async (req, res) => {
    const { campaignId } = req.params;

    try {
        const logs = await CommunicationsLog.find({ campaignId });
        res.json(logs);
    } catch (error) {
        console.error('Error fetching communication logs:', error);
        res.status(500).json({ error: 'Failed to fetch communication logs' });
    }
});

// POST /api/campaigns/:logId/delivery - Update delivery status for a message in communications_log
router.post('/:logId/delivery', async (req, res) => {
    const { logId } = req.params;

    try {
        const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';
        await CommunicationsLog.findByIdAndUpdate(logId, { status });
        res.json({ message: 'Delivery status updated', status });
    } catch (error) {
        console.error('Error updating delivery status:', error);
        res.status(500).json({ error: 'Failed to update delivery status' });
    }
});

// GET /api/campaigns/stats - Get aggregated stats for campaigns
router.get('/stats', async (req, res) => {
    try {
        // Calculate total audience size from all campaigns
        const campaigns = await Campaign.find();
        const totalAudienceSize = campaigns.reduce((sum, campaign) => sum + (campaign.audienceSize || 0), 0);

        // Calculate sent and failed counts from communications log
        const sentCount = await CommunicationsLog.countDocuments({ status: 'SENT' });
        const failedCount = await CommunicationsLog.countDocuments({ status: 'FAILED' });

        res.json({ audienceSize: totalAudienceSize, sentCount, failedCount });
    } catch (error) {
        console.error('Error fetching campaign stats:', error);
        res.status(500).json({ error: 'Failed to fetch campaign statistics' });
    }
});

module.exports = router;
