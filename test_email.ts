import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { StudentController } from './server/controllers/StudentController';
import { PasswordController } from './server/controllers/passwordController';
import express, { Request, Response } from 'express';
import Student from './server/models/Student';

dotenv.config();

async function runTests() {
  await mongoose.connect(process.env.MONGODB_URI as string, { dbName: 'ckpcet_events' });
  console.log('Connected to DB');

  const studentController = new StudentController();
  const passwordController = new PasswordController();

  // Test 1: SMTP failure -> signup does not report successful email delivery
  console.log('\\n--- Test 1: SMTP Failure ---');
  const originalPass = process.env.SMTP_PASSWORD;
  process.env.SMTP_PASSWORD = 'wrongpassword';

  let req = {
    body: {
      name: 'Test Failure',
      enrollmentNumber: 'FAIL' + Date.now(),
      email: 'fail' + Date.now() + '@gmail.com',
      password: 'password123'
    }
  } as Request;

  let resStatus = 0;
  let resBody: any = null;
  let res = {
    status: (s: number) => { resStatus = s; return res; },
    json: (data: any) => { resBody = data; return res; }
  } as Response;

  await studentController.signup(req, res);
  console.log('Signup Response Status:', resStatus);
  console.log('Signup Response Body:', resBody);

  if (resStatus === 503) {
    console.log('PASS: Correctly returned 503 on SMTP failure.');
  } else {
    console.log('FAIL: Did not return 503.');
  }

  // Ensure student record was rolled back
  const foundStudent = await Student.findOne({ email: req.body.email });
  if (!foundStudent) {
    console.log('PASS: Student record was correctly rolled back.');
  } else {
    console.log('FAIL: Student record was NOT rolled back.');
  }

  // Test 2: SMTP success -> signup succeeds
  console.log('\\n--- Test 2: SMTP Success ---');
  process.env.SMTP_PASSWORD = originalPass;

  req.body.enrollmentNumber = 'SUCCESS' + Date.now();
  req.body.email = 'success' + Date.now() + '@gmail.com';

  await studentController.signup(req, res);
  console.log('Signup Response Status:', resStatus);
  console.log('Signup Response Body:', resBody);

  if (resStatus === 201) {
    console.log('PASS: Correctly returned 201 on SMTP success.');
  } else {
    console.log('FAIL: Did not return 201.');
  }

  const successStudent = await Student.findOne({ email: req.body.email }).select('+otpHash');
  if (successStudent) {
    console.log('PASS: Student record created.');
    console.log('emailVerified:', successStudent.emailVerified);
    console.log('otpHash exists:', !!successStudent.otpHash);
    if (!resBody.otp && !resBody.otpHash) {
      console.log('PASS: No plaintext OTP or hash exposed in API response.');
    } else {
      console.log('FAIL: OTP or hash exposed in response!');
    }
  } else {
    console.log('FAIL: Student record NOT created.');
  }

  process.exit(0);
}

runTests().catch(console.error);
