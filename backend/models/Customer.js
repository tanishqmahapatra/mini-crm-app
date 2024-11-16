const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    totalSpending: { type: Number, required: true },
    lastVisit: { type: Date, required: true },
    visits: { type: Number, required: true } // Ensure visits field is required
});

module.exports = mongoose.model('Customer', customerSchema);
