const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true }
});

module.exports = mongoose.model('Order', orderSchema);
