require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');

const fixBusIndex = async () => {
    try {
        console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Found' : 'Not found');
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get the buses collection
        const db = mongoose.connection.db;
        const collection = db.collection('buses');

        // List all indexes
        console.log('\nCurrent indexes:');
        const indexes = await collection.indexes();
        indexes.forEach(index => {
            console.log(`- ${index.name}:`, JSON.stringify(index.key));
        });

        // Drop the busNumber_1 index if it exists
        try {
            await collection.dropIndex('busNumber_1');
            console.log('\n✓ Successfully dropped busNumber_1 index');
        } catch (err) {
            if (err.code === 27) {
                console.log('\n✓ busNumber_1 index does not exist (already removed)');
            } else {
                throw err;
            }
        }

        // List indexes after dropping
        console.log('\nIndexes after fix:');
        const indexesAfter = await collection.indexes();
        indexesAfter.forEach(index => {
            console.log(`- ${index.name}:`, JSON.stringify(index.key));
        });

        console.log('\n✓ Fix completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing bus index:', error);
        process.exit(1);
    }
};

fixBusIndex();
