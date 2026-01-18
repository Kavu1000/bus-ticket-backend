const express = require('express');
const router = express.Router();
const {
    generateQR,
    verifyQR,
    getQRByTicket,
    invalidateQR,
    getAllQRCodes,
} = require('../controllers/qrController');
const { protect, admin } = require('../middleware/auth');

// User routes
router.post('/generate/:ticketId', protect, generateQR);
router.post('/verify', protect, verifyQR);
router.get('/ticket/:ticketId', protect, getQRByTicket);

// Admin routes
router.put('/:id/invalidate', protect, admin, invalidateQR);
router.get('/', protect, admin, getAllQRCodes);

module.exports = router;
