const Account = require('../models/Account');
const _ = require('lodash'); // Import Lodash

function getAccount(req, res) {
    res.send("FROM getAccount()")
}

async function createBankAccount(req, res) {
    const {currency} = req.body;
    const user = req.user;

    try {
        // Create an account for the new user with the provided or default currency
        const account = new Account({
            owner: user.userId,
            accountNumber: await generateUniqueAccountNumber(),
            balance: 0,
            currency: currency // Mongoose will validate this
        });
        await account.save();

        // Use Lodash to pick only accountNumber and _id
        const accountInfo = _.pick(account, ['_id', 'owner', 'accountNumber', 'balance', 'currency']);
        res.send(accountInfo);

    } catch (error) {
        console.error('Error creating account:', error.message);
        // Handle Mongoose validation errors and other errors
        if (error.name === 'ValidationError') {
            res.status(400).json({error: 'Invalid input'});
        } else {
            res.status(500).json({error: 'Account creation failed'});
        }
    }
}

/*helper methods*/
/**
 * Helper function to generate a random 10-digit number
 * This function returns a string of 10 digits to be used as an account number.
 * It ensures the number is in the range of 1000000000 to 9999999999.
 */
function generateRandomAccountNumber() {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString(); // Generates a string
}

async function generateUniqueAccountNumber() {
    let accountExists = true;
    let accountNumber = ''; // Initialize as an empty string

    // Loop to ensure the generated account number is unique
    while (accountExists) {
        accountNumber = generateRandomAccountNumber(); // accountNumber is already a string
        accountExists = await Account.exists({accountNumber}); // Check if the number exists in the database
    }

    return accountNumber; // Return the accountNumber as a string
}


module.exports = {getAccount, createBankAccount};
