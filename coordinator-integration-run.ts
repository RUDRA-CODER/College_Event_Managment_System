import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const API_BASE = 'http://localhost:5000/api';
let adminToken = '';
let testCoordId = '';
let testEventId = '';

async function runTest() {
  console.log('--- STARTING COORDINATOR INTEGRATION TEST ---');
  
  await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: process.env.DATABASE_NAME
  });
  console.log('MongoDB Atlas connection: PASS');

  const adminDb = mongoose.connection.db?.collection('admins');
  const hashedAdminPassword = await bcrypt.hash('password123', 10);
  await adminDb?.updateOne(
      { email: 'admin@ckpcet.ac.in' },
      { $set: { name: 'Admin', role: 'admin', passwordHash: hashedAdminPassword } },
      { upsert: true }
  );
  
  const loginRes = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ckpcet.ac.in', password: 'password123' })
  });
  const loginBody = await loginRes.json();
  adminToken = loginBody.data?.token;

  console.log('\n--- CREATE TEST COORDINATOR ---');
  const coordData = {
    name: 'Test Coord',
    email: `testcoord_${Date.now()}@test.com`,
    password: 'password123',
    department: 'Test Dept',
    role: 'coordinator',
    avatar: 'test.jpg'
  };
  const coordRes = await fetch(`${API_BASE}/admin/coordinators`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
    body: JSON.stringify(coordData)
  });
  const coordBody = await coordRes.json();
  if (coordBody.success) {
    testCoordId = coordBody.data.id || coordBody.data._id;
    console.log('Coordinator creation: PASS', testCoordId);
  } else {
    console.log('Coordinator creation: FAIL', JSON.stringify(coordBody));
  }

  console.log('\n--- COORDINATOR FLOW ---');
  let coordToken = '';
  if (testCoordId) {
    const coordLoginRes = await fetch(`${API_BASE}/coordinator/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: coordData.email, password: 'defaultPassword123' })
    });
    const coordLoginBody = await coordLoginRes.json();
    coordToken = coordLoginBody.token || coordLoginBody.data?.token;
    console.log('Coordinator login:', coordToken ? 'PASS' : 'FAIL ' + JSON.stringify(coordLoginBody));

    console.log('\n--- FETCH DASHBOARD ---');
    const coordDashRes = await fetch(`${API_BASE}/coordinator/dashboard`, {
        headers: { 'Authorization': `Bearer ${coordToken}` }
    });
    const coordDash = await coordDashRes.json();
    if (coordDash.success) {
        console.log('Dashboard fetch: PASS', coordDash.data);
    } else {
        console.log('Dashboard fetch: FAIL', JSON.stringify(coordDash));
    }

    console.log('\n--- FETCH PROFILE ---');
    const coordProfileRes = await fetch(`${API_BASE}/coordinator/profile`, {
        headers: { 'Authorization': `Bearer ${coordToken}` }
    });
    const coordProfile = await coordProfileRes.json();
    if (coordProfile.success) {
        console.log('Profile fetch: PASS', coordProfile.data.email);
    } else {
        console.log('Profile fetch: FAIL', JSON.stringify(coordProfile));
    }

    console.log('\n--- FETCH EVENTS ---');
    const coordEventsRes = await fetch(`${API_BASE}/coordinator/events`, {
        headers: { 'Authorization': `Bearer ${coordToken}` }
    });
    const coordEvents = await coordEventsRes.json();
    if (coordEvents.success) {
        console.log('Events fetch: PASS', coordEvents.data.length);
    } else {
        console.log('Events fetch: FAIL', JSON.stringify(coordEvents));
    }
  }

  console.log('\n--- CLEANUP ---');
  if (testCoordId) await mongoose.connection.db?.collection('coordinators').deleteOne({ _id: new mongoose.Types.ObjectId(testCoordId) });

  console.log('Cleanup complete.');
  
  await mongoose.disconnect();
}

runTest().catch(console.error);
