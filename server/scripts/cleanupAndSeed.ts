import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

import Coordinator from '../models/Coordinator';
import Registration from '../models/Registration';
import Student from '../models/Student';
import Event from '../models/Event';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const cleanupAndSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ckpcet_events', {
      dbName: 'ckpcet_events'
    });
    console.log('MongoDB Connected');

    console.log('Clearing existing coordinators and registrations...');
    await Coordinator.deleteMany({});
    await Registration.deleteMany({});
    
    // Clear all students as per requirement "students = 0"
    console.log('Clearing all students...');
    await Student.deleteMany({});
    
    console.log('Inserting 3 sample coordinators...');
    const passwordHash = await bcrypt.hash('pass123', 10);
    
    await Coordinator.insertMany([
      {
        name: 'Student Coord 1',
        email: 'coord.student@ckpcet.ac.in',
        department: 'Computer Science',
        role: 'coordinator',
        coordinatorType: 'student',
        enrollmentNumber: 'ENR2020001',
        semester: '7',
        phone: '1234567890',
        gender: 'Male',
        dateOfBirth: '2000-01-01',
        address: '123 College Rd',
        city: 'Surat',
        state: 'Gujarat',
        pincode: '395001',
        profileImage: '',
        passwordHash,
        emailVerified: true
      },
      {
        name: 'Faculty Coord 1',
        email: 'coord.faculty1@ckpcet.ac.in',
        department: 'Information Technology',
        role: 'coordinator',
        coordinatorType: 'faculty',
        employeeId: 'EMP2001',
        designation: 'Assistant Professor',
        phone: '1234567891',
        gender: 'Female',
        dateOfBirth: '1985-05-15',
        address: '456 University Ave',
        city: 'Surat',
        state: 'Gujarat',
        pincode: '395002',
        profileImage: '',
        passwordHash,
        emailVerified: true
      },
      {
        name: 'Faculty Coord 2',
        email: 'coord.faculty2@ckpcet.ac.in',
        department: 'Mechanical',
        role: 'coordinator',
        coordinatorType: 'faculty',
        employeeId: 'EMP2002',
        designation: 'Associate Professor',
        phone: '1234567892',
        gender: 'Male',
        dateOfBirth: '1980-11-20',
        address: '789 Tech Park',
        city: 'Surat',
        state: 'Gujarat',
        pincode: '395003',
        profileImage: '',
        passwordHash,
        emailVerified: true
      }
    ]);
    
    console.log('Cleanup and seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
};

cleanupAndSeed();
