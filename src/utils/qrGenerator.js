const QRCode = require('qrcode');
const crypto = require('crypto');

// Generate QR code data string
const generateQRData = (ticketId, userId, busId) => {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(16).toString('hex');

    // Create a unique QR data string
    const data = JSON.stringify({
        ticketId,
        userId,
        busId,
        timestamp,
        hash: crypto
            .createHash('sha256')
            .update(`${ticketId}-${userId}-${busId}-${timestamp}-${randomString}`)
            .digest('hex'),
    });

    return data;
};

// Generate QR code image (base64)
const generateQRImage = async (data) => {
    try {
        const qrImage = await QRCode.toDataURL(data, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.92,
            margin: 1,
            width: 300,
        });
        return qrImage;
    } catch (error) {
        throw new Error('Failed to generate QR code image');
    }
};

// Verify QR code data
const verifyQRData = (qrData) => {
    try {
        const parsed = JSON.parse(qrData);

        // Check if required fields exist
        if (!parsed.ticketId || !parsed.userId || !parsed.busId || !parsed.timestamp || !parsed.hash) {
            return { valid: false, message: 'Invalid QR code format' };
        }

        return { valid: true, data: parsed };
    } catch (error) {
        return { valid: false, message: 'Invalid QR code data' };
    }
};

module.exports = {
    generateQRData,
    generateQRImage,
    verifyQRData,
};
