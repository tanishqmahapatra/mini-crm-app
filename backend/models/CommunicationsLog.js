const mongoose = require('mongoose');

const communicationsLogSchema = new mongoose.Schema({
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true }, // Link to campaign
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true }, // Link to customer
    message: { type: String, required: true }, // Message content
    status: { type: String, enum: ['PENDING', 'SENT', 'FAILED'], default: 'PENDING' }, // Message status
    sentAt: { type: Date, default: Date.now } // Timestamp of when the message was sent
});

module.exports = mongoose.model('CommunicationsLog', communicationsLogSchema);
