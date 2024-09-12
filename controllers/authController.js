const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

exports.register = [
    // Validation middleware
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    async (req, res) => {
        // Validate inputs
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const user = await User.create(req.body);
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                // Handle unique constraint error (e.g., duplicate email)
                res.status(400).json({ error: 'Email already in use' });
            } else {
                // Handle other errors
                res.status(400).json({ error: error.message });
            }
        }
    },
];

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !user.validPassword(password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
