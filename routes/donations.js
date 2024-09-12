/**
 * @swagger
 * tags:
 *   name: Donations
 *   description: API endpoints for managing donations.
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
    makeDonation,
    getDonations,
    getDonationById,
    getDonationsByPeriod,
    getDonationCount,
} = require('../controllers/donationController');

/**
 * @swagger
 * /donations:
 *   post:
 *     summary: Make a donation
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount to donate
 *               beneficiaryId:
 *                 type: integer
 *                 description: The ID of the beneficiary
 *               pin:
 *                 type: string
 *                 description: The 4-digit PIN to set for transactions
 *     responses:
 *       201:
 *         description: Donation made successfully
 *       400:
 *         description: Error making donation
 */
router.post('/', authenticate, makeDonation);

/**
 * @swagger
 * /donations:
 *   get:
 *     summary: Get a list of donations made by the user
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: Number of items per page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of donations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of donations
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 pages:
 *                   type: integer
 *                   description: Total number of pages
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Donation'
 *       400:
 *         description: Error retrieving donations
 */
router.get('/', authenticate, getDonations);

/**
 * @swagger
 * /donations/:
 *   get:
 *     summary: Get a specific donation by ID
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: query
 *         description: Transaction ID of the donation to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Donation details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donation'
 *       404:
 *         description: Donation not found
 *       400:
 *         description: Error retrieving donation
 */
router.get('/:id', authenticate, getDonationById);

/**
 * @swagger
 * /donations/period:
 *   get:
 *     summary: Get donations within a specified period
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: start_date
 *         in: query
 *         required: true
 *         description: Start date for the period (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *       - name: end_date
 *         in: query
 *         required: true
 *         description: End date for the period (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of donations within the specified period
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Donation'
 *       400:
 *         description: Error retrieving donations by period
 */
router.get('/period', authenticate, getDonationsByPeriod);

/**
 * @swagger
 * /donations/count:
 *   get:
 *     summary: Get the total number of donations made by the user
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total number of donations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 donationCount:
 *                   type: integer
 *                   description: Total number of donations made by the user
 *       400:
 *         description: Error retrieving donation count
 */
router.get('/count', authenticate, getDonationCount);

module.exports = router;
