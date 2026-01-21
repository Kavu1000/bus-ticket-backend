const Schedule = require('../models/Schedule');
const Bus = require('../models/Bus');

// @desc    Create new schedule
// @route   POST /api/schedules
// @access  Private/Admin
const createSchedule = async (req, res, next) => {
    try {
        console.log('Create Schedule Request Body:', req.body); // Debug log
        const { busId } = req.body;

        // Validate busId is provided
        if (!busId) {
            res.status(400);
            throw new Error('Please select a bus');
        }

        const bus = await Bus.findById(busId);
        if (!bus) {
            res.status(404);
            throw new Error('Bus not found');
        }

        const schedule = await Schedule.create(req.body);

        res.status(201).json({
            success: true,
            data: schedule,
            message: 'Schedule created successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all schedules
// @route   GET /api/schedules
// @access  Public
const getAllSchedules = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};

        if (req.query.status) {
            filter.status = req.query.status;
        }

        if (req.query.from) {
            filter['route.from'] = new RegExp(req.query.from, 'i');
        }

        if (req.query.to) {
            filter['route.to'] = new RegExp(req.query.to, 'i');
        }

        if (req.query.date) {
            // Match date (ignoring time)
            const date = new Date(req.query.date);
            const nextDate = new Date(date);
            nextDate.setDate(date.getDate() + 1);
            filter.date = { $gte: date, $lt: nextDate };
        }

        const schedules = await Schedule.find(filter)
            .populate('busId', 'name company licensePlate capacity phone')
            .limit(limit)
            .skip(skip)
            .sort({ date: 1, departureTime: 1 });

        const total = await Schedule.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: schedules,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get schedule by ID
// @route   GET /api/schedules/:id
// @access  Public
const getScheduleById = async (req, res, next) => {
    try {
        const schedule = await Schedule.findById(req.params.id)
            .populate('busId', 'name company licensePlate capacity phone');

        if (!schedule) {
            res.status(404);
            throw new Error('Schedule not found');
        }

        res.status(200).json({
            success: true,
            data: schedule,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update schedule
// @route   PUT /api/schedules/:id
// @access  Private/Admin
const updateSchedule = async (req, res, next) => {
    try {
        const schedule = await Schedule.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        ).populate('busId', 'name company licensePlate capacity phone');

        if (!schedule) {
            res.status(404);
            throw new Error('Schedule not found');
        }

        res.status(200).json({
            success: true,
            data: schedule,
            message: 'Schedule updated successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete schedule
// @route   DELETE /api/schedules/:id
// @access  Private/Admin
const deleteSchedule = async (req, res, next) => {
    try {
        const schedule = await Schedule.findById(req.params.id);

        if (!schedule) {
            res.status(404);
            throw new Error('Schedule not found');
        }

        await schedule.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Schedule deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update expired schedules and create new ones
// @route   POST /api/schedules/update-expired
// @access  Private/Admin
const updateExpiredSchedules = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find all active schedules with past dates
        const expiredSchedules = await Schedule.find({
            date: { $lt: today },
            status: 'active'
        });

        if (expiredSchedules.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No expired schedules found',
                data: { updated: 0, created: 0 }
            });
        }

        let updatedCount = 0;
        let createdCount = 0;

        for (const schedule of expiredSchedules) {
            // Mark as completed
            await Schedule.findByIdAndUpdate(schedule._id, { status: 'completed' });
            updatedCount++;

            // Create new schedule for tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const newSchedule = new Schedule({
                busId: schedule.busId,
                route: schedule.route,
                departureTime: schedule.departureTime,
                arrivalTime: schedule.arrivalTime,
                duration: schedule.duration,
                date: tomorrow,
                price: schedule.price,
                pricePerSeat: schedule.pricePerSeat,
                availableSeats: schedule.availableSeats,
                status: 'active'
            });

            await newSchedule.save();
            createdCount++;
        }

        res.status(200).json({
            success: true,
            message: `Updated ${updatedCount} expired schedule(s) and created ${createdCount} new schedule(s)`,
            data: { updated: updatedCount, created: createdCount }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
    updateExpiredSchedules,
};

