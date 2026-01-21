const express = require('express');
const router = express.Router();
const {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
    updateExpiredSchedules,
} = require('../controllers/scheduleController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', getAllSchedules);

// Admin routes - specific routes before :id
router.post('/update-expired', protect, admin, updateExpiredSchedules);

router.get('/:id', getScheduleById);
router.post('/', protect, admin, createSchedule);
router.put('/:id', protect, admin, updateSchedule);
router.delete('/:id', protect, admin, deleteSchedule);

module.exports = router;

