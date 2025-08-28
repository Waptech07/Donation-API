const { Wallet } = require('../models');
const bcrypt = require('bcryptjs');

exports.getWallet = async (req, res) => {
    const { pin } = req.query;

    try {
        const wallet = await Wallet.findOne({ where: { userId: req.user.id } });
        if (!wallet || !bcrypt.compareSync(pin, wallet.pin)) {
            return res.status(400).json({ error: 'Invalid PIN' });
        }
        res.json({ balance: wallet.balance });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.setTransactionPin = async (req, res) => {
    const { pin } = req.body;
    if (!pin || pin.length !== 4) {
        return res.status(400).json({ error: 'PIN must be 4 digits' });
    }

    try {
        const hashedPin = bcrypt.hashSync(pin, 10);
        const [wallet, created] = await Wallet.upsert({
            userId: req.user.id,
            pin: hashedPin,
            balance: 0,
        });
        if (!created) {
            return res.status(400).json({ error: 'Wallet already exists' });
        }
        res.json({ message: 'Transaction PIN set successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.createWallet = async (req, res) => {
    const { pin } = req.body;
    if (!pin || pin.length !== 4) {
        return res.status(400).json({ error: 'PIN must be 4 digits' });
    }

    try {
        const existingWallet = await Wallet.findOne({ where: { userId: req.user.id } });
        if (existingWallet) {
            return res.status(400).json({ error: 'Wallet already exists' });
        }
        const hashedPin = bcrypt.hashSync(pin, 10);
        await Wallet.create({ userId: req.user.id, balance: 0, pin: hashedPin });
        res.status(201).json({ message: 'Wallet created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateTransactionPin = async (req, res) => {
    const { oldPin, newPin } = req.body;
    
    if (!oldPin || oldPin.length !== 4 || !newPin || newPin.length !== 4) {
        return res.status(400).json({ error: 'PIN must be 4 digits' });
    }

    try {
        // Find wallet for the user
        const wallet = await Wallet.findOne({ where: { userId: req.user.id } });
        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        // Check if the old pin matches the existing one
        const isOldPinValid = bcrypt.compareSync(oldPin, wallet.pin);
        if (!isOldPinValid) {
            return res.status(400).json({ error: 'Invalid old transaction PIN' });
        }

        // Hash the new pin and update the wallet
        const hashedNewPin = bcrypt.hashSync(newPin, 10);
        await wallet.update({ pin: hashedNewPin });

        res.json({ message: 'Transaction PIN updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
