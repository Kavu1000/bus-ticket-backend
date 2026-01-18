const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');

// Validation middleware
const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required'),
];

const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

// Routes
console.log('Registering auth routes...');
router.post('/register', (req, res, next) => {
    console.log('Register route handler hit');
    next();
}, registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/login', (req, res) => {
    res.status(405).json({
        success: false,
        message: 'Method Not Allowed. Please use POST to login.',
    });
});
router.get('/me', protect, getMe);

module.exports = router;
