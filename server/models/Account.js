const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User', // Refers to the User model
        required: true
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    currency: {
        type: String,
        enum: ['NIS', 'EUR', 'USD'], // Allow only NIS, EUR, and USD
        required: true,
        default: 'USD' // Default currency is USD
    }
});

module.exports = mongoose.model('Account', accountSchema);
