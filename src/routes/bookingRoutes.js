const express = require('express');
const router = express.Router();
const {
    createBooking,
    getUserBookings,
    getBookingById,
    updateBooking,
    cancelBooking,
    getAllBookings,
    getBookingsByOrderNo,
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/auth');

// User routes
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getUserBookings);
router.get('/order/:orderNo', protect, getBookingsByOrderNo);
router.get('/:id', protect, getBookingById);
router.put('/:id', protect, updateBooking);
router.delete('/:id', protect, cancelBooking);

// Admin routes
router.get('/', protect, admin, getAllBookings);

module.exports = router;
