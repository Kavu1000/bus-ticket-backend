const express = require('express');
const router = express.Router();
const { createPaymentLink, handleWebhook, confirmPaymentSuccess } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// Create payment link (protected - requires authentication)
router.post('/create-link', protect, createPaymentLink);

// Confirm payment success (protected - called by frontend)
router.post('/confirm-success', protect, confirmPaymentSuccess);

// Webhook endpoint (public - called by LAPNet)
router.post('/webhook', handleWebhook);

module.exports = router;
