import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Student from './models/Student';
import { PasswordController } from './controllers/passwordController';
import { Request, Response } from 'express';
import { OTPService } from './services/otpService';

dotenv.config({ path: '../.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ckpcet_events';

async function testPasswordReset() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB');

    const testEmail = 'testreset2@ckpcet.ac.in';
    
    // 1. Setup a test user
    await Student.deleteOne({ email: testEmail });
    
    const initialPasswordHash = await bcrypt.hash('InitialPass123!', 10);
    const testStudent = new Student({
      name: 'Test Reset 2',
      email: testEmail,
      enrollmentNumber: 'RST002',
      department: 'Computer',
      semester: 1,
      passwordHash: initialPasswordHash,
      isVerified: true
    });
    
    const testOTP = '123456';
    const otpHash = OTPService.hashOTP(testOTP);
    testStudent.resetPasswordTokenHash = otpHash;
    testStudent.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
    
    await testStudent.save();
    console.log('Test student created with hashed OTP');

    const pc = new PasswordController();

    // 2. Mock Request for Reset Password
    const newPassword = 'NewSecurePassword456!';
    const reqReset = {
      body: { 
        email: testEmail, 
        role: 'student',
        token: testOTP,
        newPassword
      }
    } as Request;

    let resetResponseData: any = {};
    const resReset = {
      status: function (code: number) { (this as any).statusCode = code; return this; },
      json: function (data: any) { resetResponseData = data; }
    } as unknown as Response;

    console.log('Calling resetPassword...');
    await pc.resetPassword(reqReset, resReset);
    console.log('Reset Password response:', resetResponseData);

    // 3. Verify the new password can be used to log in
    const updatedUser = await Student.findOne({ email: testEmail }).select('+passwordHash');
    if (!updatedUser) throw new Error('User not found');
    
    const isMatch = await bcrypt.compare(newPassword, updatedUser.passwordHash);
    if (isMatch) {
      console.log('SUCCESS: Password was updated and matches perfectly.');
    } else {
      console.log('FAILED: Password mismatch after reset.');
    }

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

testPasswordReset();
