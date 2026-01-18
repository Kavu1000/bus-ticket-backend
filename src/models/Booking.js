const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    busId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
        required: [true, 'Bus ID is required'],
    },
    seatNumber: {
        type: String,
        required: [true, 'Seat number is required'],
    },
    departureStation: {
        type: String,
        required: [true, 'Departure station is required'],
    },
    arrivalStation: {
        type: String,
        required: [true, 'Arrival station is required'],
    },
    departureTime: {
        type: Date,
        required: [true, 'Departure time is required'],
    },
    arrivalTime: {
        type: Date,
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
    },
    status: {
        type: String,
        enum: ['booked', 'cancelled', 'completed', 'expired'],
        default: 'booked',
    },
    bookingDate: {
        type: Date,
        default: Date.now,
    },
    passengerDetails: {
        name: String,
        age: Number,
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
        },
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'refunded', 'failed'],
        default: 'pending',
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'cash', 'upi', 'wallet', 'phapay'],
    },
    paymentOrderNo: {
        type: String,
        sparse: true, // Allow null values but index unique non-null values
    },
}, {
    timestamps: true,
});

// Index for efficient querying
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ busId: 1, departureTime: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
