const express = require('express');
const router = express.Router();
const {
    createQueueEntry,
    getStationQueue,
    updateQueuePosition,
    deleteQueueEntry,
    getQueueByBus,
} = require('../controllers/stationController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/:stationName/queue', getStationQueue);
router.get('/queue/bus/:busId', getQueueByBus);

// Admin routes
router.post('/queue', protect, admin, createQueueEntry);
router.put('/queue/:id', protect, admin, updateQueuePosition);
router.delete('/queue/:id', protect, admin, deleteQueueEntry);

module.exports = router;
