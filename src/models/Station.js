const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    stationName: {
        type: String,
        required: [true, 'Station name is required'],
        trim: true,
    },
    location: {
        address: {
            type: String,
            required: [true, 'Address is required'],
        },
        city: {
            type: String,
            required: [true, 'City is required'],
        },
        coordinates: {
            latitude: Number,
            longitude: Number,
        },
    },
    busId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
        required: [true, 'Bus ID is required'],
    },
    queuePosition: {
        type: Number,
        required: [true, 'Queue position is required'],
        min: [1, 'Queue position must be at least 1'],
    },
    estimatedArrival: {
        type: Date,
        required: [true, 'Estimated arrival time is required'],
    },
    actualArrival: {
        type: Date,
    },
    estimatedDeparture: {
        type: Date,
    },
    actualDeparture: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['waiting', 'boarding', 'departed', 'cancelled'],
        default: 'waiting',
    },
}, {
    timestamps: true,
});

// Index for efficient querying
stationSchema.index({ stationName: 1, queuePosition: 1 });
stationSchema.index({ busId: 1 });

module.exports = mongoose.model('Station', stationSchema);
