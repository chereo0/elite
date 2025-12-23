import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

// Load env vars
dotenv.config();

/**
 * Seed admin user if not exists
 */
const seedAdmin = async (): Promise<void> => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected to MongoDB');

        // Check if admin exists
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@elitemotion.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('✅ Admin user already exists');
            console.log(`   Email: ${adminEmail}`);
        } else {
            // Create admin user
            const admin = await User.create({
                name: process.env.ADMIN_NAME || 'Admin',
                email: adminEmail,
                password: process.env.ADMIN_PASSWORD || 'Admin@123',
                role: 'admin',
            });

            console.log('✅ Admin user created successfully!');
            console.log(`   Name: ${admin.name}`);
            console.log(`   Email: ${admin.email}`);
            console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
        }

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
