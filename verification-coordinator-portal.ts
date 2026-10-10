import mongoose from 'mongoose';
import path from 'path';
import bcrypt from 'bcryptjs';

import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '.env') });

const API_BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- PHASE 25: STARTING FULL COORDINATOR VERIFICATION TEST ---');
  
  await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: process.env.DATABASE_NAME
  });
  console.log('MongoDB Atlas connection: PASS');

  // Admin login to set up testing env
  const adminDb = mongoose.connection.db?.collection('admins');
  const hashedAdminPassword = await bcrypt.hash('password123', 10);
  await adminDb?.updateOne(
      { email: 'admin@ckpcet.ac.in' },
      { $set: { name: 'Admin', role: 'admin', passwordHash: hashedAdminPassword } },
      { upsert: true }
  );
  
  let adminToken = '';
  const loginRes = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ckpcet.ac.in', password: 'password123' })
  });
  const loginBody = await loginRes.json();
  adminToken = loginBody.data?.token;

  console.log('\\n--- SETUP: Create Coordinator A and Coordinator B ---');
  const coordAData = {
    name: 'Coord A',
    email: `coord_a_${Date.now()}@test.com`,
    password: 'password123',
    department: 'Dept A',
    role: 'coordinator',
    avatar: 'a.jpg'
  };
  const coordBData = {
    name: 'Coord B',
    email: `coord_b_${Date.now()}@test.com`,
    password: 'password123',
    department: 'Dept B',
    role: 'coordinator',
    avatar: 'b.jpg'
  };

  const createA = await fetch(`${API_BASE}/admin/coordinators`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` }, body: JSON.stringify(coordAData)
  });
  const bodyA = await createA.json();
  const coordAId = bodyA.data.id || bodyA.data._id;

  const createB = await fetch(`${API_BASE}/admin/coordinators`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` }, body: JSON.stringify(coordBData)
  });
  const bodyB = await createB.json();
  const coordBId = bodyB.data.id || bodyB.data._id;
  
  console.log('Coordinator A & B created.');

  console.log('\\n--- SETUP: Create Events ---');
  // Event A (Assigned to A)
  const evARes = await fetch(`${API_BASE}/events`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ title: 'Event A', description: 'Desc A', venue: 'Room 1', registrationDeadline: '2026-10-01', maxParticipants: 100, coordinatorIds: [coordAId], date: '2026-10-10', time: '10:00', status: 'upcoming', category: 'Tech' })
  });
  const evABody = await evARes.json();
  if (!evABody.success) throw new Error('Failed to create Event A: ' + JSON.stringify(evABody));
  const eventAId = evABody.data.id || evABody.data._id;

  // Event B (Assigned to B)
  const evBRes = await fetch(`${API_BASE}/events`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ title: 'Event B', description: 'Desc B', venue: 'Room 2', registrationDeadline: '2026-10-01', maxParticipants: 100, coordinatorIds: [coordBId], date: '2026-10-10', time: '10:00', status: 'upcoming', category: 'Tech' })
  });
  const evBBody = await evBRes.json();
  if (!evBBody.success) throw new Error('Failed to create Event B: ' + JSON.stringify(evBBody));
  const eventBId = evBBody.data.id || evBBody.data._id;

  // Shared Event (Assigned to A and B)
  const evSharedRes = await fetch(`${API_BASE}/events`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ title: 'Shared Event', description: 'Desc Shared', venue: 'Room 3', registrationDeadline: '2026-10-01', maxParticipants: 100, coordinatorIds: [coordAId, coordBId], date: '2026-10-10', time: '10:00', status: 'upcoming', category: 'Tech' })
  });
  const evSharedBody = await evSharedRes.json();
  if (!evSharedBody.success) throw new Error('Failed to create Shared Event: ' + JSON.stringify(evSharedBody));
  const eventSharedId = evSharedBody.data.id || evSharedBody.data._id;
  
  console.log('Events created.');

  console.log('\\n--- SETUP: Create Registrations ---');
  // Create dummy student token (mock simple login)
  let studentToken = 'student_test_token';
  const studEmail = `stud_a_${Date.now()}@t.com`;
  const studARes = await fetch(`${API_BASE}/auth/student/signup`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Student A', email: studEmail, enrollmentNumber: 'S'+Date.now(), password: 'password123', department: 'Test', semester: '1' })
  });
  const sBodyA = await studARes.json();
  
  const studLoginARes = await fetch(`${API_BASE}/auth/student/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: studEmail, password: 'password123' })
  });
  const studLoginBody = await studLoginARes.json();
  if (!studLoginBody.success) throw new Error('Student login failed: ' + JSON.stringify(studLoginBody));
  studentToken = studLoginBody.token;

  // Register Student A to Event A
  const regARes = await fetch(`${API_BASE}/registrations`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${studentToken}` },
      body: JSON.stringify({ eventId: eventAId, studentName: 'Student A' })
  });
  const regABody = await regARes.json();
  if (!regABody.success) throw new Error('Reg A Failed: ' + JSON.stringify(regABody));

  // Register Student B to Event B (same student account for ease, but different event)
  const regBRes = await fetch(`${API_BASE}/registrations`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${studentToken}` },
      body: JSON.stringify({ eventId: eventBId, studentName: 'Student B' })
  });
  const regBBody = await regBRes.json();
  if (!regBBody.success) throw new Error('Reg B Failed: ' + JSON.stringify(regBBody));

  // Register Student C to Shared Event
  const regSharedRes = await fetch(`${API_BASE}/registrations`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${studentToken}` },
      body: JSON.stringify({ eventId: eventSharedId, studentName: 'Student C' })
  });
  const regSharedBody = await regSharedRes.json();
  if (!regSharedBody.success) throw new Error('Reg Shared Failed: ' + JSON.stringify(regSharedBody));

  console.log('Registrations created.');

  // Login Coordinator A and B
  const loginARes = await fetch(`${API_BASE}/coordinator/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: coordAData.email, password: 'defaultPassword123' })
  });
  const tokenA = (await loginARes.json()).data?.token;

  const loginBRes = await fetch(`${API_BASE}/coordinator/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: coordBData.email, password: 'defaultPassword123' })
  });
  const tokenB = (await loginBRes.json()).data?.token;

  console.log('\\n--- TESTS ---');
  
  // Phase 18: Two-Coordinator Security Test
  const aEventsReq = await fetch(`${API_BASE}/coordinator/events`, { headers: { 'Authorization': `Bearer ${tokenA}` } });
  const aEvents = await aEventsReq.json();
  const aCanSeeA = aEvents.data.some((e: any) => e.id === eventAId);
  const aCanSeeShared = aEvents.data.some((e: any) => e.id === eventSharedId);
  const aCannotSeeB = !aEvents.data.some((e: any) => e.id === eventBId);
  console.log('Phase 18 (Coord A Visibility):', (aCanSeeA && aCanSeeShared && aCannotSeeB) ? 'PASS' : 'FAIL');

  const bEventsReq = await fetch(`${API_BASE}/coordinator/events`, { headers: { 'Authorization': `Bearer ${tokenB}` } });
  const bEvents = await bEventsReq.json();
  const bCanSeeB = bEvents.data.some((e: any) => e.id === eventBId);
  const bCanSeeShared = bEvents.data.some((e: any) => e.id === eventSharedId);
  const bCannotSeeA = !bEvents.data.some((e: any) => e.id === eventAId);
  console.log('Phase 18 (Coord B Visibility):', (bCanSeeB && bCanSeeShared && bCannotSeeA) ? 'PASS' : 'FAIL');

  // Phase 19: Registration Isolation Test
  const aRegReq = await fetch(`${API_BASE}/coordinator/registrations`, { headers: { 'Authorization': `Bearer ${tokenA}` } });
  const aReg = await aRegReq.json();
  const aSeesRegA = aReg.data.some((r: any) => r.eventId === eventAId || r.eventId?._id === eventAId || r.eventId?.id === eventAId);
  const aSeesRegShared = aReg.data.some((r: any) => r.eventId === eventSharedId || r.eventId?._id === eventSharedId || r.eventId?.id === eventSharedId);
  const aNotSeesRegB = !aReg.data.some((r: any) => r.eventId === eventBId || r.eventId?._id === eventBId || r.eventId?.id === eventBId);
  console.log('Phase 19 (Reg Isolation A):', (aSeesRegA && aSeesRegShared && aNotSeesRegB) ? 'PASS' : 'FAIL', 'A:', aSeesRegA, 'Shared:', aSeesRegShared, 'NotB:', aNotSeesRegB);
  if (!(aSeesRegA && aSeesRegShared && aNotSeesRegB)) {
      console.log('Reg Array:', JSON.stringify(aReg.data), 'EventA:', eventAId, 'Shared:', eventSharedId, 'EventB:', eventBId);
  }

  // Phase 20: Security Attack Tests
  // 4. Coordinator A modifies Event B (Expect 403)
  const aModBReq = await fetch(`${API_BASE}/events/${eventBId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` }, body: JSON.stringify({ title: 'Hacked' })
  });
  console.log('Phase 20 (A modifies B):', aModBReq.status === 403 ? 'PASS' : 'FAIL (Status ' + aModBReq.status + ')');

  // 7. Coordinator attempts Admin-only event deletion (Expect 403)
  const aDelReq = await fetch(`${API_BASE}/events/${eventAId}`, {
      method: 'DELETE', headers: { 'Authorization': `Bearer ${tokenA}` }
  });
  console.log('Phase 20 (Coord Delete):', aDelReq.status === 403 ? 'PASS' : 'FAIL');

  // 8. Unauthenticated user attempts protected endpoint (Expect 401)
  const unauthReq = await fetch(`${API_BASE}/coordinator/events`, {
      method: 'GET'
  });
  console.log('Phase 20 (Unauth access):', unauthReq.status === 401 ? 'PASS' : 'FAIL');

  console.log('\\n--- CLEANUP ---');
  await mongoose.connection.db?.collection('coordinators').deleteOne({ _id: new mongoose.Types.ObjectId(coordAId) });
  await mongoose.connection.db?.collection('coordinators').deleteOne({ _id: new mongoose.Types.ObjectId(coordBId) });
  await mongoose.connection.db?.collection('events').deleteMany({ _id: { $in: [new mongoose.Types.ObjectId(eventAId), new mongoose.Types.ObjectId(eventBId), new mongoose.Types.ObjectId(eventSharedId)] } });
  await mongoose.connection.db?.collection('registrations').deleteMany({ eventId: { $in: [eventAId, eventBId, eventSharedId] } });
  await mongoose.connection.db?.collection('students').deleteMany({ email: /stud_.*@t\.com/ });

  console.log('Cleanup complete.');
  
  await mongoose.disconnect();
}

runTests().catch(console.error);
