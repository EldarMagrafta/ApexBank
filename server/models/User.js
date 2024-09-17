const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    status: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'blocked'],
        default: 'pending'
    },
}, {timestamps: true}); // Enables `createdAt` and `updatedAt` timestamps

console.log("hello eldar");

module.exports = mongoose.model('User', userSchema);
