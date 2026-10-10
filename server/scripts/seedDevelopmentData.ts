import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

import Admin from '../models/Admin';
import Coordinator from '../models/Coordinator';
import Student from '../models/Student';
import Registration from '../models/Registration';
import Event from '../models/Event';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ckpcet_events', {
      dbName: 'ckpcet_events'
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data from admins, coordinators, students, registrations...');
    await Admin.deleteMany({});
    await Coordinator.deleteMany({});
    await Student.deleteMany({});
    await Registration.deleteMany({});
    console.log('Collections cleared.');

    const passwordHash = await bcrypt.hash('pass123', 10);

    // 1. Create Admins
    console.log('Creating Admins...');
    const admins = await Admin.insertMany([
      { name: 'System Admin', email: 'admin@ckpcet.ac.in', passwordHash, role: 'admin' },
      { name: 'Super Admin', email: 'superadmin@ckpcet.ac.in', passwordHash, role: 'superadmin' }
    ]);
    console.log(`Created ${admins.length} Admins.`);

    // 2. Create Coordinators
    console.log('Creating Coordinators...');
    const coordinatorData = Array.from({ length: 10 }).map((_, i) => ({
      name: `Coordinator ${i + 1}`,
      email: `coordinator${i + 1}@ckpcet.ac.in`,
      passwordHash,
      department: ['Computer Science', 'IT', 'Mechanical', 'Civil', 'Electrical'][i % 5],
      role: 'coordinator',
      employeeId: `EMP${1000 + i}`,
      phone: `98765432${i.toString().padStart(2, '0')}`,
      alternatePhone: `98765433${i.toString().padStart(2, '0')}`,
      designation: ['Professor', 'Assistant Professor', 'Associate Professor'][i % 3],
      facultyType: 'Teaching',
      address: `Staff Quarters ${i + 1}, CKPCET Campus`,
      city: 'Surat',
      state: 'Gujarat',
      pincode: '395007',
      joiningDate: '2020-01-01',
      experience: `${(i % 10) + 1} years`,
      emailVerified: true,
      dateOfBirth: `198${i % 10}-05-15`,
      gender: i % 2 === 0 ? 'Male' : 'Female'
    }));
    const coordinators = await Coordinator.insertMany(coordinatorData);
    console.log(`Created ${coordinators.length} Coordinators.`);

    // 3. Create Students
    console.log('Creating Students...');
    const studentData = Array.from({ length: 25 }).map((_, i) => ({
      name: `Student ${i + 1}`,
      enrollmentNumber: `ENR${2023000 + i}`,
      email: `student${i + 1}@ckpcet.ac.in`,
      passwordHash,
      department: ['Computer Science', 'IT', 'Mechanical', 'Civil', 'Electrical'][i % 5],
      semester: `${(i % 8) + 1}`,
      phone: `87654321${i.toString().padStart(2, '0')}`,
      address: `Hostel Room ${101 + i}, CKPCET`,
      city: 'Surat',
      state: 'Gujarat',
      pincode: '395007',
      dateOfBirth: `200${i % 5}-08-${10 + (i % 20)}`,
      gender: i % 2 === 0 ? 'Male' : 'Female',
      emailVerified: true
    }));
    const students = await Student.insertMany(studentData);
    console.log(`Created ${students.length} Students.`);

    // 4. Update Existing Events
    console.log('Assigning coordinators to existing events...');
    const events = await Event.find({});
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      if (!event.coordinatorIds || event.coordinatorIds.length === 0) {
        event.coordinatorIds = [coordinators[i % coordinators.length]._id];
        await event.save();
      }
    }
    console.log(`Checked/Updated ${events.length} events.`);

    // 5. Create Registrations
    console.log('Creating Registrations...');
    const registrations = [];
    if (events.length > 0) {
      for (const event of events) {
        // Register 5-10 random students for each event
        const numRegistrations = Math.floor(Math.random() * 6) + 5;
        // Shuffle students
        const shuffledStudents = [...students].sort(() => 0.5 - Math.random());
        const selectedStudents = shuffledStudents.slice(0, numRegistrations);

        for (const student of selectedStudents) {
          registrations.push({
            eventId: event._id,
            studentId: student._id,
            studentName: student.name,
            enrollmentNumber: student.enrollmentNumber,
            email: student.email,
            registrationDate: new Date().toISOString(),
            status: 'confirmed',
            attendance: Math.random() > 0.5
          });
        }
      }
      const createdRegistrations = await Registration.insertMany(registrations);
      console.log(`Created ${createdRegistrations.length} Registrations.`);
    } else {
      console.log('No events found. Skipping registrations.');
    }

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
