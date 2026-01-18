// Script to create or update an admin user
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Load environment variables
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bus-ticket';

// Define User Schema inline (same as your User model)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createAdmin() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Admin credentials - CHANGE THESE!
        const adminEmail = 'admin@busgogo.com';
        const adminUsername = 'admin';
        const adminPassword = 'Admin123!';  // Must have letter, number, and special char
        const adminPhone = '0123456789';

        // Check if admin exists
        let admin = await User.findOne({ email: adminEmail });

        if (admin) {
            // Update existing user to admin role
            admin.role = 'admin';
            admin.isActive = true;
            await admin.save();
            console.log(`Updated existing user "${adminEmail}" to admin role`);
        } else {
            // Create new admin
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            admin = await User.create({
                username: adminUsername,
                email: adminEmail,
                password: hashedPassword,
                phone: adminPhone,
                role: 'admin',
                isActive: true
            });
            console.log(`Created new admin user: ${adminEmail}`);
        }

        console.log('\n=== Admin Credentials ===');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log('========================\n');

        console.log('You can now login to the admin panel with these credentials!');

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

createAdmin();
