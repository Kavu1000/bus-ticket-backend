const mongoose = require('mongoose');
require('dotenv').config();

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
}, { strict: false });

const Bus = mongoose.model('Bus', busSchema);
const Schedule = mongoose.model('Schedule', scheduleSchema);

async function fixOrphanedSchedules() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find all schedules
        const schedules = await Schedule.find();
        console.log(`Found ${schedules.length} total schedules\n`);

        // Check each schedule for valid bus reference
        const orphanedSchedules = [];

        for (const schedule of schedules) {
            if (schedule.busId) {
                const bus = await Bus.findById(schedule.busId);
                if (!bus) {
                    orphanedSchedules.push(schedule);
                    console.log(`❌ Orphaned schedule found:`);
                    console.log(`   Schedule ID: ${schedule._id}`);
                    console.log(`   Invalid Bus ID: ${schedule.busId}`);
                    console.log(`   Route: ${schedule.route.from} -> ${schedule.route.to}`);
                    console.log(`   Date: ${schedule.date}`);
                }
            }
        }

        if (orphanedSchedules.length === 0) {
            console.log('✅ No orphaned schedules found!');
            await mongoose.disconnect();
            return;
        }

        console.log(`\n⚠️  Found ${orphanedSchedules.length} orphaned schedules\n`);

        // Get a valid bus to reassign to
        const validBuses = await Bus.find();
        console.log('Available buses to reassign to:');
        validBuses.forEach((bus, index) => {
            console.log(`   ${index + 1}. ${bus.name} (${bus.company}) - ID: ${bus._id}`);
        });

        // Use the first valid bus as replacement
        const replacementBus = validBuses[0];
        console.log(`\n📝 Will reassign orphaned schedules to: ${replacementBus.name} (ID: ${replacementBus._id})\n`);

        // Fix each orphaned schedule
        for (const schedule of orphanedSchedules) {
            await Schedule.findByIdAndUpdate(schedule._id, {
                busId: replacementBus._id
            });
            console.log(`✅ Fixed schedule ${schedule._id}`);
        }

        console.log(`\n🎉 Successfully fixed ${orphanedSchedules.length} orphaned schedules!`);

        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixOrphanedSchedules();
