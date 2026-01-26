const mongoose = require('mongoose');
require('dotenv').config();

// Define models inline
const busSchema = new mongoose.Schema({
    name: String,
    company: String,
    licensePlate: String,
    capacity: Number,
});

const scheduleSchema = new mongoose.Schema({
    busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' },
    route: {
        from: String,
        to: String,
    },
    date: Date,
    departureTime: String,
    price: Number,
    availableSeats: Number,
    status: String,
});

const Bus = mongoose.model('Bus', busSchema);
const Schedule = mongoose.model('Schedule', scheduleSchema);

async function checkDataIntegrity() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        console.log('\n=== CHECKING SCHEDULES ===');
        const schedules = await Schedule.find({
            'route.from': /Vientiane/i,
            'route.to': /Pakse/i
        }).limit(5);

        console.log(`Found ${schedules.length} schedules for Vientiane -> Pakse`);

        for (const schedule of schedules) {
            console.log('\n--- Schedule ---');
            console.log('ID:', schedule._id.toString());
            console.log('BusId:', schedule.busId);
            console.log('Route:', `${schedule.route.from} -> ${schedule.route.to}`);
            console.log('Date:', schedule.date);
            console.log('Status:', schedule.status);

            // Check if the bus exists
            if (schedule.busId) {
                const bus = await Bus.findById(schedule.busId);
                if (bus) {
                    console.log('✅ Bus exists:', bus.name, '-', bus.company);
                } else {
                    console.log('❌ BUS NOT FOUND - Schedule references non-existent bus!');
                }
            } else {
                console.log('❌ NO BUS ID - Schedule has no busId reference!');
            }
        }

        console.log('\n=== CHECKING BUSES ===');
        const buses = await Bus.find().limit(5);
        console.log(`Total buses in database: ${buses.length}`);
        buses.forEach(bus => {
            console.log(`- ${bus.name} (${bus.company}) - ID: ${bus._id}`);
        });

        await mongoose.disconnect();
        console.log('\n✅ Check complete');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkDataIntegrity();
