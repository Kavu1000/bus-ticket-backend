const mongoose = require('mongoose');
const Schedule = require('./src/models/Schedule');
const Bus = require('./src/models/Bus'); // Bus model is referenced
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

const checkSchedules = async () => {
    await connectDB();

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        console.log('Today (set to 00:00:00):', today);
        console.log('Current Time:', new Date());

        const schedules = await Schedule.find({}).sort({ date: 1 });

        console.log('\n--- ALL SCHEDULES ---');
        console.log(`Total Schedules: ${schedules.length}`);

        schedules.forEach(s => {
            const isExpired = new Date(s.date) < today;
            console.log(`ID: ${s._id} | Date: ${new Date(s.date).toDateString()} | Status: ${s.status} | Expired (< Today): ${isExpired}`);
        });

        const activeExpired = await Schedule.find({
            date: { $lt: today },
            status: 'active'
        });

        console.log('\n--- ACTIVE & EXPIRED (Should be updated) ---');
        console.log(`Count: ${activeExpired.length}`);
        activeExpired.forEach(s => {
            console.log(`ID: ${s._id} | Date: ${new Date(s.date).toDateString()}`);
        });

    } catch (error) {
        console.error(error);
    } finally {
        mongoose.connection.close();
    }
};

checkSchedules();
