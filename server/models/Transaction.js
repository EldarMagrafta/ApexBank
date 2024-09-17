const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    from: {
        type: String, // Account number of the sender
        required: true
    },
    to: {
        type: String, // Account number of the recipient
        required: true
    },
    amount: { // Transaction amount
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'declined'], // Status options (fixed typo)
        default: 'confirmed'
    }
}, {timestamps: true});

module.exports = mongoose.model('Transaction', transactionSchema);
