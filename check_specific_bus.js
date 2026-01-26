const mongoose = require('mongoose');
require('dotenv').config();

async function investigateBusId() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const Bus = mongoose.model('Bus', new mongoose.Schema({}, { strict: false }));

        const targetBusId = '697373ff1445aa264d7f408d';
        console.log(`🔍 Searching for bus with ID: ${targetBusId}\n`);

        const bus = await Bus.findById(targetBusId);

        if (bus) {
            console.log('✅ BUS FOUND!');
            console.log('Details:', JSON.stringify(bus, null, 2));
        } else {
            console.log('❌ BUS NOT FOUND in database');
            console.log('\nThis explains the "Bus not found" error!');
            console.log('The schedule references this bus, but it has been deleted from the database.');
        }

        // Also check all buses
        console.log('\n📋 All buses in database:');
        const allBuses = await Bus.find();
        allBuses.forEach(b => {
            console.log(`   - ${b._id}: ${b.name} (${b.company})`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

investigateBusId();
