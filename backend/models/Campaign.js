const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Campaign name
    segmentConditions: { type: Array, required: true }, // Conditions that define the audience
    message: { type: String, required: true }, // Message content
    audienceSize: { type: Number, required: true }, // Calculated audience size
    sentCount: { type: Number, default: 0 }, // Number of messages sent
    failedCount: { type: Number, default: 0 }, // Number of messages that failed
    createdAt: { type: Date, default: Date.now }, // Timestamp for campaign creation
});

module.exports = mongoose.model('Campaign', campaignSchema);
