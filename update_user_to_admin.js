// Script to update a user to admin role
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bus-ticket';

// Define User Schema inline
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function updateUserToAdmin() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Email of the user to update - CHANGE THIS!
        const userEmail = 'arlisa@gmail.com';

        // Find and update the user
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            console.log(`User with email "${userEmail}" not found!`);
            console.log('\nAvailable users:');
            const allUsers = await User.find({}, 'email username role');
            allUsers.forEach(u => {
                console.log(`  - ${u.email} (${u.username}) - Role: ${u.role}`);
            });
        } else {
            // Update to admin role
            user.role = 'admin';
            user.isActive = true;
            await user.save();

            console.log(`\n✅ Successfully updated user "${userEmail}" to admin role!`);
            console.log(`Username: ${user.username}`);
            console.log(`Email: ${user.email}`);
            console.log(`Role: ${user.role}`);
            console.log('\nYou can now refresh the admin panel and it should show the data!');
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

updateUserToAdmin();
