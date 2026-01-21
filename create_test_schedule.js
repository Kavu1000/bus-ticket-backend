const mongoose = require('mongoose');
const Schedule = require('./src/models/Schedule');
const Bus = require('./src/models/Bus');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};

const createTestSchedule = async () => {
    await connectDB();

    try {
        // Get the first bus
        const bus = await Bus.findOne();
        if (!bus) {
            console.log('No buses found. Cannot create schedule.');
            return;
        }

        // Create date for yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        const testSchedule = new Schedule({
            busId: bus._id,
            route: { from: 'Test City A', to: 'Test City B' },
            departureTime: '10:00',
            arrivalTime: '12:00',
            duration: '2h',
            date: yesterday,
            price: 100000,
            pricePerSeat: 100000,
            availableSeats: 20,
            status: 'active'
        });

        await testSchedule.save();
        console.log(`Created test active schedule for yesterday (${yesterday.toDateString()}) with ID: ${testSchedule._id}`);

    } catch (error) {
        console.error(error);
    } finally {
        mongoose.connection.close();
    }
};

createTestSchedule();
