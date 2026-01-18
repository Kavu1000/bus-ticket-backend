const express = require('express');
const router = express.Router();
const {
    createBus,
    getAllBuses,
    getBusById,
    updateBus,
    deleteBus,
    getAvailableSeats,
} = require('../controllers/busController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', getAllBuses);
router.get('/:id', getBusById);
router.get('/:id/seats', getAvailableSeats);

// Admin routes
router.post('/', protect, admin, createBus);
router.put('/:id', protect, admin, updateBus);
router.delete('/:id', protect, admin, deleteBus);

module.exports = router;
