const Booking = require('../models/Booking');
const Bus = require('../models/Bus');
const User = require('../models/User');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
    try {
        const { busId, seatNumber } = req.body;

        // Verify bus exists
        const bus = await Bus.findById(busId);
        if (!bus) {
            res.status(404);
            throw new Error('Bus not found');
        }

        // Create booking
        const booking = await Booking.create({
            ...req.body,
            userId: req.user._id,
        });

        // Populate booking data
        const populatedBooking = await Booking.findById(booking._id)
            .populate('userId', 'username email phone')
            .populate('busId', 'name company licensePlate capacity phone');

        res.status(201).json({
            success: true,
            data: populatedBooking,
            message: 'Booking created successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getUserBookings = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { userId: req.user._id };

        if (req.query.status) {
            filter.status = req.query.status;
        }

        const bookings = await Booking.find(filter)
            .populate('busId', 'name company licensePlate capacity phone')
            .limit(limit)
            .skip(skip)
            .sort({ bookingDate: -1 });

        const total = await Booking.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: bookings,
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

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('userId', 'username email phone')
            .populate('busId', 'name company licensePlate capacity phone');

        if (!booking) {
            res.status(404);
            throw new Error('Booking not found');
        }

        // Check if user owns the booking or is admin
        if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to access this booking');
        }

        res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
const updateBooking = async (req, res, next) => {
    try {
        require('fs').appendFileSync('booking_debug.log', JSON.stringify({
            timestamp: new Date(),
            method: 'updateBooking',
            params: req.params,
            body: req.body,
            user: req.user ? { id: req.user._id, role: req.user.role } : 'no user'
        }) + '\n');

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            res.status(404);
            throw new Error('Booking not found');
        }

        // Check if user owns the booking or is admin
        if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to update this booking');
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        ).populate('userId', 'username email')
            .populate('busId', 'name company licensePlate capacity phone');

        res.status(200).json({
            success: true,
            data: updatedBooking,
            message: 'Booking updated successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            res.status(404);
            throw new Error('Booking not found');
        }

        // Check if user owns the booking or is admin
        if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to cancel this booking');
        }

        // Check if booking is already cancelled
        if (booking.status === 'cancelled') {
            res.status(400);
            throw new Error('Booking is already cancelled');
        }

        // Update booking status
        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};

        if (req.query.status) {
            filter.status = req.query.status;
        }

        if (req.query.busId) {
            filter.busId = req.query.busId;
        }

        if (req.query.paymentStatus) {
            filter.paymentStatus = req.query.paymentStatus;
        }

        const bookings = await Booking.find(filter)
            .populate('userId', 'username email phone')
            .populate('busId', 'name company licensePlate capacity phone')
            .limit(limit)
            .skip(skip)
            .sort({ bookingDate: -1 });

        const total = await Booking.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: bookings,
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

// @desc    Get bookings by order number
// @route   GET /api/bookings/order/:orderNo
// @access  Private
const getBookingsByOrderNo = async (req, res, next) => {
    try {
        const { orderNo } = req.params;

        const bookings = await Booking.find({ paymentOrderNo: orderNo })
            .populate('userId', 'username email phone')
            .populate('busId', 'name company licensePlate capacity phone');

        if (!bookings || bookings.length === 0) {
            res.status(404);
            throw new Error('No bookings found for this order');
        }

        // Check authorization (user must own at least one booking in the order)
        const isOwner = bookings.some(b => b.userId._id.toString() === req.user._id.toString());
        if (!isOwner && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to access these bookings');
        }

        res.status(200).json({
            success: true,
            data: bookings,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBooking,
    getUserBookings,
    getBookingById,
    updateBooking,
    cancelBooking,
    getAllBookings,
    getBookingsByOrderNo,
};
