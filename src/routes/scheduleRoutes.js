const express = require('express');
const router = express.Router();
const {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
} = require('../controllers/scheduleController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', getAllSchedules);
router.get('/:id', getScheduleById);

// Admin routes
router.post('/', protect, admin, createSchedule);
router.put('/:id', protect, admin, updateSchedule);
router.delete('/:id', protect, admin, deleteSchedule);

module.exports = router;
