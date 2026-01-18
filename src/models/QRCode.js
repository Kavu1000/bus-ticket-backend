const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: [true, 'Ticket ID is required'],
        unique: true,
    },
    qrData: {
        type: String,
        required: [true, 'QR data is required'],
        unique: true,
    },
    qrImage: {
        type: String, // Base64 encoded image or URL
    },
    isValid: {
        type: Boolean,
        default: true,
    },
    scannedAt: {
        type: Date,
    },
    scannedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    expiresAt: {
        type: Date,
        required: [true, 'Expiry date is required'],
    },
    verificationCount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['active', 'used', 'expired', 'invalid'],
        default: 'active',
    },
}, {
    timestamps: true,
});

// Index for efficient querying
qrCodeSchema.index({ expiresAt: 1 });

// Method to check if QR code is expired
qrCodeSchema.methods.isExpired = function () {
    return new Date() > this.expiresAt;
};

module.exports = mongoose.model('QRCode', qrCodeSchema);
