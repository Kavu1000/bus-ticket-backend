const Station = require('../models/Station');
const Bus = require('../models/Bus');

// @desc    Create queue entry
// @route   POST /api/stations/queue
// @access  Private/Admin
const createQueueEntry = async (req, res, next) => {
    try {
        const { busId } = req.body;

        // Verify bus exists
        const bus = await Bus.findById(busId);
        if (!bus) {
            res.status(404);
            throw new Error('Bus not found');
        }

        const queueEntry = await Station.create(req.body);

        res.status(201).json({
            success: true,
            data: queueEntry,
            message: 'Queue entry created successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get station queue
// @route   GET /api/stations/:stationName/queue
// @access  Public
const getStationQueue = async (req, res, next) => {
    try {
        const { stationName } = req.params;
        const status = req.query.status;

        const filter = { stationName };
        if (status) {
            filter.status = status;
        }

        const queue = await Station.find(filter)
            .populate('busId', 'busNumber type route capacity')
            .sort({ queuePosition: 1 });

        res.status(200).json({
            success: true,
            data: queue,
            count: queue.length,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update queue position
// @route   PUT /api/stations/queue/:id
// @access  Private/Admin
const updateQueuePosition = async (req, res, next) => {
    try {
        const queueEntry = await Station.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        ).populate('busId', 'busNumber type route');

        if (!queueEntry) {
            res.status(404);
            throw new Error('Queue entry not found');
        }

        res.status(200).json({
            success: true,
            data: queueEntry,
            message: 'Queue entry updated successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete queue entry
// @route   DELETE /api/stations/queue/:id
// @access  Private/Admin
const deleteQueueEntry = async (req, res, next) => {
    try {
        const queueEntry = await Station.findById(req.params.id);

        if (!queueEntry) {
            res.status(404);
            throw new Error('Queue entry not found');
        }

        await queueEntry.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Queue entry deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get queue by bus ID
// @route   GET /api/stations/queue/bus/:busId
// @access  Public
const getQueueByBus = async (req, res, next) => {
    try {
        const { busId } = req.params;

        const queueEntries = await Station.find({ busId })
            .populate('busId', 'busNumber type route')
            .sort({ estimatedArrival: 1 });

        res.status(200).json({
            success: true,
            data: queueEntries,
            count: queueEntries.length,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createQueueEntry,
    getStationQueue,
    updateQueuePosition,
    deleteQueueEntry,
    getQueueByBus,
};
