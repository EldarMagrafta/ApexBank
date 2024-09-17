const Account = require('../models/Account');

function getAccount(req, res) {
    res.send("FROM getAccount()")
}

async function createBankAccount(req, res) {
    const {name, currency} = req.body;
    try {
        // Create an account for the new user with the provided or default currency
        const account = new Account({
            owner: user._id,
            accountNumber: 0,
            balance: 0,
            currency
        });
        await account.save();   // Save the account in the database
    } catch (error) {
        console.error('Error creating account:', error.message);
        throw new Error('Account creation failed');
    }
}


module.exports = {getAccount, createBankAccount};
