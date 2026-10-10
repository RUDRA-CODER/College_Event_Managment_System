import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

import Student from '../models/Student';
import Event from '../models/Event';
import Registration from '../models/Registration';
import Coordinator from '../models/Coordinator';
import Admin from '../models/Admin';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ckpcet_events', {
      dbName: 'ckpcet_events'
    });
    console.log('MongoDB Connected');

    // 1. Delete existing students and registrations just to be sure we have exactly 2
    await Student.deleteMany({});
    await Registration.deleteMany({});

    // 2. Fetch 2 existing events
    const events = await Event.find({}).limit(2);
    if (events.length < 2) {
      console.error('Not enough events found in the database. Found:', events.length);
      process.exit(1);
    }
    const event1 = events[0];
    const event2 = events[1];

    // 3. Create 2 students
    const passwordHash = await bcrypt.hash('pass123', 10);

    const studentsToInsert = [
      {
        name: 'Aarav Patel',
        enrollmentNumber: 'ENR2021045',
        email: 'aarav.patel@ckpcet.ac.in',
        department: 'Computer Engineering',
        semester: '5',
        phone: '9876543210',
        gender: 'Male',
        dateOfBirth: '2003-04-12',
        address: '101 Sunrise Apartments',
        city: 'Surat',
        state: 'Gujarat',
        pincode: '395007',
        profileImage: '',
        passwordHash,
        emailVerified: true
      },
      {
        name: 'Priya Sharma',
        enrollmentNumber: 'ENR2022089',
        email: 'priya.sharma@ckpcet.ac.in',
        department: 'Information Technology',
        semester: '3',
        phone: '9123456789',
        gender: 'Female',
        dateOfBirth: '2004-09-25',
        address: '205 Green Valley',
        city: 'Surat',
        state: 'Gujarat',
        pincode: '395009',
        profileImage: '',
        passwordHash,
        emailVerified: true
      }
    ];

    const insertedStudents = await Student.insertMany(studentsToInsert);
    console.log('Created 2 temporary students.');

    const student1 = insertedStudents[0];
    const student2 = insertedStudents[1];

    // 4. Create 2 registrations
    const registrationsToInsert = [
      {
        eventId: event1._id,
        studentId: student1._id,
        studentName: student1.name,
        enrollmentNumber: student1.enrollmentNumber,
        email: student1.email,
        registrationDate: new Date(),
        status: 'confirmed',
        attendance: false
      },
      {
        eventId: event2._id,
        studentId: student2._id,
        studentName: student2.name,
        enrollmentNumber: student2.enrollmentNumber,
        email: student2.email,
        registrationDate: new Date(),
        status: 'confirmed',
        attendance: false
      }
    ];

    await Registration.insertMany(registrationsToInsert);
    console.log('Created 2 temporary registrations.');

    // 5. Validation
    const adminsCount = await Admin.countDocuments();
    const eventsCount = await Event.countDocuments();
    const coordinatorsCount = await Coordinator.countDocuments();
    const studentsCount = await Student.countDocuments();
    const registrationsCount = await Registration.countDocuments();

    console.log(`\n--- DB Counts ---`);
    console.log(`Admins: ${adminsCount}`);
    console.log(`Events: ${eventsCount}`);
    console.log(`Coordinators: ${coordinatorsCount}`);
    console.log(`Students: ${studentsCount}`);
    console.log(`Registrations: ${registrationsCount}`);

    console.log(`\n--- Verification Details ---`);
    console.log(`Student 1 Email: ${student1.email} -> Event 1: ${event1.title}`);
    console.log(`Student 2 Email: ${student2.email} -> Event 2: ${event2.title}`);

    // Verify authentication works
    const isAuth1Valid = await bcrypt.compare('pass123', student1.passwordHash);
    const isAuth2Valid = await bcrypt.compare('pass123', student2.passwordHash);
    console.log(`Student 1 Auth with 'pass123': ${isAuth1Valid ? 'PASS' : 'FAIL'}`);
    console.log(`Student 2 Auth with 'pass123': ${isAuth2Valid ? 'PASS' : 'FAIL'}`);

    // Verify each student sees ONLY their own registration
    const s1Regs = await Registration.find({ studentId: student1._id });
    const s2Regs = await Registration.find({ studentId: student2._id });
    console.log(`Student 1 Registrations Count: ${s1Regs.length} (Expected: 1)`);
    console.log(`Student 2 Registrations Count: ${s2Regs.length} (Expected: 1)`);

    process.exit(0);
  } catch (error) {
    console.error('Script Error:', error);
    process.exit(1);
  }
};

run();
