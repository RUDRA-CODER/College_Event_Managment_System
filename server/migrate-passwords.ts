import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import StudentModel from './models/Student';
import CoordinatorModel from './models/Coordinator';
import AdminModel from './models/Admin';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ckpcet_events';

async function migratePasswords() {
    try {
        await mongoose.connect(MONGO_URI, { dbName: 'ckpcet_events' });
        console.log('Connected to MongoDB');

        const defaultPassword = 'password123';
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(defaultPassword, salt);

        // Update Students
        const students = await StudentModel.updateMany(
            { passwordHash: { $exists: false } },
            { $set: { passwordHash } }
        );
        console.log(`Updated ${students.modifiedCount} students`);

        // Update Coordinators
        const coordinators = await CoordinatorModel.updateMany(
            { passwordHash: { $exists: false } },
            { $set: { passwordHash } }
        );
        console.log(`Updated ${coordinators.modifiedCount} coordinators`);

        // Update Admins
        const admins = await AdminModel.updateMany(
            { passwordHash: { $exists: false } },
            { $set: { passwordHash } }
        );
        console.log(`Updated ${admins.modifiedCount} admins`);

        console.log('Migration complete. Default password is "password123".');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

migratePasswords();
