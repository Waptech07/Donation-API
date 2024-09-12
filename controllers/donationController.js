const { Donation, User, Wallet } = require('../models');
const { Op } = require('sequelize');
const { verifyTransactionPin } = require('../utils/security');
const { sendEmail } = require('../utils/email');

exports.makeDonation = async (req, res) => {
    const { amount, beneficiaryId, pin } = req.body;

    
    try {
        if (!pin) {
            return res.status(400).json({ error: 'Transaction PIN is required' + pin + amount + beneficiaryId });
        }

        // Validate donation amount
        if (amount < 100) {
            return res.status(400).json({ error: 'Minimum donation amount is 100 NGN' });
        }

        // Fetch sender and beneficiary wallets
        const senderWallet = await Wallet.findOne({ where: { userId: req.user.id } });
        const beneficiaryWallet = await Wallet.findOne({ where: { userId: beneficiaryId } });

        if (!senderWallet) {
            return res.status(404).json({ error: 'Sender wallet not found' });
        }

        if (!beneficiaryWallet) {
            return res.status(404).json({ error: 'Beneficiary wallet not found' });
        }

        // Verify the transaction PIN
        const isPinValid = await verifyTransactionPin(req.user.id, pin);
        if (!isPinValid) {
            return res.status(400).json({ error: 'Invalid transaction PIN' });
        }

        // Check sender's balance
        if (senderWallet.balance < amount) {
            return res.status(400).json({ error: 'Insufficient funds' });
        }

        // Deduct from sender's wallet and add to beneficiary's wallet
        await senderWallet.update({ balance: senderWallet.balance - amount });
        await beneficiaryWallet.update({ balance: beneficiaryWallet.balance + amount });

        // Create a donation record
        const donation = await Donation.create({
            amount,
            userId: req.user.id,
            beneficiaryId,
            transactionId: req.body.transactionId, // Auto-generate if not provided
        });

        // Optional: Thank user for making multiple donations
        const donationCount = await Donation.count({ where: { userId: req.user.id } });
        if (donationCount >= 2) {
            await sendEmail(req.user.email, 'You\'ve made two or more donations', `Thank you for your generosity!. You have successfully donated ${amount} NGN to beneficiary ID: ${beneficiaryId}.`);
        }

        res.status(201).json({ message: 'Donation made successfully', donation });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.getDonations = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const donations = await Donation.findAndCountAll({
            where: { userId: req.user.id },
            limit,
            offset: (page - 1) * limit,
            include: [{ model: User, as: 'beneficiary', attributes: ['name', 'email'] }],
        });
        res.json({
            total: donations.count,
            page,
            pages: Math.ceil(donations.count / limit),
            data: donations.rows,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getDonationById = async (req, res) => {
    try {
        const donation = await Donation.findOne({
            where: { transactionId: req.params.id, userId: req.user.id }, // Updated to use transactionId
            include: [{ model: User, as: 'beneficiary', attributes: ['name', 'email'] }],
        });
        if (!donation) return res.status(404).json({ error: 'Donation not found' });
        res.json(donation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getDonationsByPeriod = async (req, res) => {
    const { start_date, end_date } = req.query;

    try {
        const donations = await Donation.findAll({
            where: {
                userId: req.user.id,
                createdAt: {
                    [Op.between]: [new Date(start_date), new Date(end_date)],
                },
            },
            include: [{ model: User, as: 'beneficiary', attributes: ['name', 'email'] }],
        });
        res.json(donations);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getDonationCount = async (req, res) => {
    try {
        const count = await Donation.count({ where: { userId: req.user.id } });
        res.json({ donationCount: count });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
