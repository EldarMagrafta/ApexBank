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
        type: String, // Currency type (e.g., USD, EUR)
        required: true,
        default: 'USD'
    }
});

accountSchema.pre('save', generateUniqueAccountNumber);

/**
 * Helper function to generate a random 10-digit number
 * This function returns a string of 10 digits to be used as an account number.
 * It ensures the number is in the range of 1000000000 to 9999999999.
 */
function generateRandomAccountNumber() {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

/**
 * Middleware function to generate and assign a unique account number
 * This function is triggered before saving a new document to the database.
 * It loops to generate a 10-digit random account number and checks if it already exists.
 * If the generated number exists in the database, it regenerates another number until it finds a unique one.
 * Once a unique number is found, it assigns it to the account's `accountNumber` field.
 *
 * @param {Function} next - Function to signal Mongoose to proceed with the save operation.
 */
async function generateUniqueAccountNumber(next) {
    if (this.isNew) { // Only generate on new documents
        let accountNumber;
        let accountExists = true;

        // Loop to ensure the generated account number is unique
        while (accountExists) {
            accountNumber = generateRandomAccountNumber();
            accountExists = await mongoose.models.Account.exists({accountNumber}); // Check if the number exists in the database
        }

        this.accountNumber = accountNumber;
    }
    next(); // Call next to proceed with saving the document
}

module.exports = mongoose.model('Account', accountSchema);
