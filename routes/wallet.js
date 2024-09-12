const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getWallet, setTransactionPin, createWallet, updateTransactionPin } = require('../controllers/walletController');

/**
 * @swagger
 * /wallet:
 *   get:
 *     summary: Get the user's wallet balance
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: pin
 *         in: query
 *         description: The 4-digit PIN for validation
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved wallet balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *                   description: The current balance of the user's wallet
 *       400:
 *         description: Error retrieving wallet balance
 */
router.get('/', authenticate, getWallet);

/**
 * @swagger
 * /wallet/pin:
 *   post:
 *     summary: Set or update the transaction PIN for the user's wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pin:
 *                 type: string
 *                 description: The 4-digit PIN to set for transactions
 *     responses:
 *       200:
 *         description: Transaction PIN set successfully
 *       400:
 *         description: Error setting the transaction PIN or invalid PIN format
 */
router.post('/pin', authenticate, setTransactionPin);

/**
 * @swagger
 * /wallet/create:
 *   post:
 *     summary: Create a wallet for a user
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pin:
 *                 type: string
 *                 description: The 4-digit PIN to set for transactions
 *     responses:
 *       201:
 *         description: Wallet created successfully
 *       400:
 *         description: Error creating wallet or invalid PIN format
 */
router.post('/create', authenticate, createWallet);

/**
 * @swagger
 * /wallet/update-pin:
 *   patch:
 *     summary: Update the transaction PIN for the user's wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPin:
 *                 type: string
 *                 description: The current 4-digit PIN
 *               newPin:
 *                 type: string
 *                 description: The new 4-digit PIN
 *     responses:
 *       200:
 *         description: Transaction PIN updated successfully
 *       400:
 *         description: Error updating the transaction PIN
 */
router.patch('/update-pin', authenticate, updateTransactionPin);

module.exports = router;
