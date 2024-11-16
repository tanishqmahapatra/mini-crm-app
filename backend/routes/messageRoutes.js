const express = require('express');
const router = express.Router();
const axios = require('axios'); // Import axios to make internal API calls
const Campaign = require('../models/Campaign');
const Customer = require('../models/Customer');
const CommunicationsLog = require('../models/CommunicationsLog');

// POST /api/messages/send - Send messages to the audience of a campaign
router.post('/send', async (req, res) => {
    const { campaignId, message } = req.body;

    try {
        // Fetch the campaign
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            console.error('Campaign not found');
            return res.status(404).json({ error: 'Campaign not found' });
        }

        // Fetch the audience (customers meeting the campaign's criteria)
        const audience = await Customer.find({ /* Add filtering based on campaign conditions */ });
        console.log('Audience size:', audience.length);

        if (audience.length === 0) {
            return res.status(404).json({ message: 'No audience found for this campaign' });
        }

        // Create a message log for each customer and immediately call the delivery receipt API
        const messageLogs = await Promise.all(audience.map(async (customer) => {
            const newLog = new CommunicationsLog({
                campaignId: campaign._id,
                customerId: customer._id,
                message: `Hi ${customer.name}, ${message}`,
                status: 'PENDING'
            });

            const savedLog = await newLog.save();
            console.log(`Message log created for customer ${customer._id}`, savedLog);

            // Call the Delivery Receipt API for this message log entry
            try {
                await axios.post(`https://mini-crm-app-backend.onrender.com/api/messages/delivery/${savedLog._id}`);
                console.log(`Delivery receipt updated for logId: ${savedLog._id}`);
            } catch (deliveryError) {
                console.error(`Failed to update delivery status for logId: ${savedLog._id}`, deliveryError.message);
            }

            return savedLog;
        }));

        res.status(200).json({ message: 'Messages sent to audience', messageLogs });
    } catch (error) {
        console.error('Error sending messages:', error.message);
        res.status(500).json({ error: 'Failed to send messages' });
    }
});

// POST /api/messages/delivery/:logId - Simulate message delivery status
router.post('/delivery/:logId', async (req, res) => {
    const { logId } = req.params;

    try {
        // Simulate delivery status: 90% chance of SENT, 10% chance of FAILED
        const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';

        // Update the message log entry
        const updatedLog = await CommunicationsLog.findByIdAndUpdate(logId, { status }, { new: true });
        console.log(`Delivery status updated for logId: ${logId} to ${status}`);

        res.status(200).json({ message: 'Delivery status updated', status });
    } catch (error) {
        console.error('Error updating delivery status:', error.message);
        res.status(500).json({ error: 'Failed to update delivery status' });
    }
});
router.get('/stats/:campaignId', async (req, res) => {
    const { campaignId } = req.params;

    try {
        // Count the number of messages sent, failed, and pending for this campaign
        const sentCount = await CommunicationsLog.countDocuments({ campaignId, status: 'SENT' });
        const failedCount = await CommunicationsLog.countDocuments({ campaignId, status: 'FAILED' });
        const pendingCount = await CommunicationsLog.countDocuments({ campaignId, status: 'PENDING' });
        const audienceSize = sentCount + failedCount + pendingCount;

        res.status(200).json({
            audienceSize,
            sentCount,
            failedCount,
            pendingCount,
        });
    } catch (error) {
        console.error('Error fetching campaign stats:', error.message);
        res.status(500).json({ error: 'Failed to retrieve campaign statistics' });
    }
});


module.exports = router;
