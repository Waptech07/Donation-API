const bcrypt = require('bcryptjs');
const { Wallet } = require('../models');

exports.verifyTransactionPin = async (userId, transactionPin) => {
    const wallet = await Wallet.findOne({ where: { userId } });

    // Check if wallet exists and has a stored transactionPin
    if (!wallet || !wallet.pin) {
        throw new Error('Transaction PIN not set for this wallet');
    }

    // Compare the provided transactionPin with the hashed one
    return await bcrypt.compare(transactionPin, wallet.pin);
};
