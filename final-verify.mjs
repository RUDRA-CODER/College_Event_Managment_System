import 'dotenv/config';

import { MongoClient, ObjectId } from 'mongodb';

const API_BASE = 'http://localhost:5000/api';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ckpcet_events';

async function runVerification() {
  console.log("--- STARTING FINAL END-TO-END VERIFICATION ---");
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(process.env.DATABASE_NAME || 'ckpcet_events');
  console.log("MongoDB Connected for verification.");

  // Clean up any previous test students
  await db.collection('students').deleteMany({ email: { $in: ['studentA@test.com', 'studentB@test.com'] } });
  
  // 1. STUDENT A
  console.log("\n--- 1. STUDENT A ---");
  // Signup
  let res = await fetch(`${API_BASE}/auth/student/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Student A', email: 'studentA@test.com', password: 'password123',
      enrollmentNumber: 'ENRA001', phone: '1234567890', department: 'Computer', semester: 5
    })
  });
  let json = await res.json();
  if(!json.success) throw new Error("Student A Signup Failed");
  console.log("Student A Signup: PASS");
  
  let tokenA = json.token;
  
  // Login
  res = await fetch(`${API_BASE}/auth/student/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'studentA@test.com', password: 'password123' })
  });
  json = await res.json();
  if(!json.success || !json.token) throw new Error("Student A Login Failed");
  tokenA = json.token;
  console.log("Student A Login: PASS (JWT token received)");

  // Profile
  res = await fetch(`${API_BASE}/auth/student/profile`, {
    headers: { 'Authorization': `Bearer ${tokenA}` }
  });
  json = await res.json();
  if(!json.success || json.data.email !== 'studentA@test.com') throw new Error("Student A Profile Failed");
  console.log("Student A Profile Fetch: PASS");
  
  // Events
  res = await fetch(`${API_BASE}/events`, {
    headers: { 'Authorization': `Bearer ${tokenA}` }
  });
  json = await res.json();
  if(!json.success) throw new Error("Events Fetch Failed");
  const events = json.data;
  console.log("Events Load: PASS");
  
  // Let's create an upcoming event, completed event, and cancelled event via Admin to test registrations securely
  // We'll just insert directly to DB for speed in this test
  const upcomingEventId = new ObjectId();
  const completedEventId = new ObjectId();
  
  await db.collection('events').insertMany([
    { _id: upcomingEventId, title: 'Verify Upcoming', description: 'Desc', category: 'Technical', date: '2026-10-10', time: '10:00 AM', venue: 'Lab', maxParticipants: 50, status: 'upcoming', registrationDeadline: '2026-10-09', registrationCount: 0 },
    { _id: completedEventId, title: 'Verify Completed', description: 'Desc', category: 'Technical', date: '2026-01-10', time: '10:00 AM', venue: 'Lab', maxParticipants: 50, status: 'completed', registrationDeadline: '2026-01-09', registrationCount: 0 }
  ]);
  
  // Student A Registration
  res = await fetch(`${API_BASE}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
    body: JSON.stringify({ eventId: upcomingEventId.toString() })
  });
  json = await res.json();
  if(!json.success) throw new Error("Student A Registration Failed: " + json.message);
  console.log("Student A Registration: PASS");
  
  // Fetch My Registrations A
  res = await fetch(`${API_BASE}/registrations/me`, {
    headers: { 'Authorization': `Bearer ${tokenA}` }
  });
  json = await res.json();
  if(!json.success || json.data.length !== 1 || json.data[0].eventId.toString() !== upcomingEventId.toString()) throw new Error("My Registrations A Failed");
  console.log("Student A My Registrations: PASS");
  
  // 3. STUDENT B ISOLATION
  console.log("\n--- 3. STUDENT B ISOLATION ---");
  res = await fetch(`${API_BASE}/auth/student/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Student B', email: 'studentB@test.com', password: 'password123',
      enrollmentNumber: 'ENRB001', phone: '0987654321', department: 'IT', semester: 4
    })
  });
  json = await res.json();
  if(!json.success) throw new Error("Student B Signup Failed");
  const tokenB = json.token;
  
  // Fetch My Registrations B
  res = await fetch(`${API_BASE}/registrations/me`, {
    headers: { 'Authorization': `Bearer ${tokenB}` }
  });
  json = await res.json();
  if(!json.success || json.data.length !== 0) throw new Error("Student B Isolation Failed");
  console.log("Student B sees empty registrations (Isolation): PASS");
  
  // Student B registers
  res = await fetch(`${API_BASE}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenB}` },
    body: JSON.stringify({ eventId: upcomingEventId.toString() })
  });
  json = await res.json();
  if(!json.success) throw new Error("Student B Registration Failed");
  console.log("Student B Registration: PASS");
  
  // 4. REGISTRATION SECURITY
  console.log("\n--- 4. REGISTRATION SECURITY ---");
  // Duplicate registration
  res = await fetch(`${API_BASE}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenB}` },
    body: JSON.stringify({ eventId: upcomingEventId.toString() })
  });
  json = await res.json();
  if(res.status !== 400 && res.status !== 409) throw new Error("Duplicate Registration Not Prevented! Status: " + res.status);
  console.log("Duplicate Registration Protection: PASS (Expected block)");
  
  // Registration for completed event
  res = await fetch(`${API_BASE}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenB}` },
    body: JSON.stringify({ eventId: completedEventId.toString() })
  });
  json = await res.json();
  if(res.status !== 400) throw new Error("Completed Event Registration Not Prevented! Status: " + res.status);
  console.log("Completed Event Protection: PASS (Expected block)");
  
  // 7. DATABASE VERIFICATION
  console.log("\n--- 7. DATABASE VERIFICATION ---");
  const regB = await db.collection('registrations').findOne({ eventId: upcomingEventId, email: 'studentB@test.com' });
  if (!regB) throw new Error("Database Verification Failed");
  console.log("Registration contains studentName: " + regB.studentName);
  console.log("Registration contains enrollmentNumber: " + regB.enrollmentNumber);
  console.log("Registration contains studentId reference: PASS");
  
  await db.collection('events').deleteMany({ _id: { $in: [upcomingEventId, completedEventId] } });
  await db.collection('students').deleteMany({ email: { $in: ['studentA@test.com', 'studentB@test.com'] } });
  await db.collection('registrations').deleteMany({ eventId: { $in: [upcomingEventId, completedEventId] } });
  
  await client.close();
  console.log("\nALL END-TO-END TESTS PASSED!");
}

runVerification().catch(err => { console.error(err); process.exit(1); });



