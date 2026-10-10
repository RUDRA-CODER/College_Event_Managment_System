import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const API_BASE = 'http://localhost:5000/api';
let adminToken = '';
let testCoordId = '';
let testEventId = '';
let testStudentId = '';
let testRegId = '';

async function runTest() {
  console.log('--- STARTING INTEGRATION TEST ---');
  
  await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: process.env.DATABASE_NAME
  });
  console.log('MongoDB Atlas connection: PASS');

  console.log('\n--- ADMIN FLOW ---');
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
  console.log('Admin login:', adminToken ? 'PASS' : 'FAIL ' + JSON.stringify(loginBody));

  const dashRes = await fetch(`${API_BASE}/admin/dashboard`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const dashBody = await dashRes.json();
  console.log('Admin dashboard access:', dashBody.success ? 'PASS' : 'FAIL ' + JSON.stringify(dashBody));

  console.log('\n--- CREATE TEST COORDINATOR ---');
  const coordData = {
    name: 'Test Coord',
    email: `testcoord_${Date.now()}@test.com`,
    password: 'password123',
    department: 'Test Dept',
    role: 'Test Role',
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

  console.log('\n--- CREATE TEST EVENT ---');
  if (testCoordId) {
    const eventData = {
        title: 'Test Event ' + Date.now(),
        description: 'Integration test event',
        category: 'Test',
        date: '2026-10-10',
        time: '10:00 AM',
        venue: 'Test Venue',
        image: 'test.jpg',
        registrationDeadline: '2026-10-09',
        maxParticipants: 100,
        status: 'upcoming',
        coordinatorIds: [testCoordId]
    };
    const eventRes = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify(eventData)
    });
    const eventBody = await eventRes.json();
    if (eventBody.success) {
        testEventId = eventBody.data.id || eventBody.data._id;
        console.log('Event creation: PASS', testEventId);
    } else {
        console.log('Event creation: FAIL', JSON.stringify(eventBody));
    }
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

    const coordEventsRes = await fetch(`${API_BASE}/coordinator/events`, {
        headers: { 'Authorization': `Bearer ${coordToken}` }
    });
    const coordEvents = await coordEventsRes.json();
    if (coordEvents.success) {
        const hasEvent = coordEvents.data?.some((e: any) => (e.id || e._id) === testEventId);
        console.log('Assigned event visibility:', hasEvent ? 'PASS' : 'FAIL');
    } else {
        console.log('Assigned event visibility: FAIL', JSON.stringify(coordEvents));
    }
  }

  console.log('\n--- STUDENT & REGISTRATION FLOW ---');
  let studentToken = '';
  if (testEventId) {
    const studentData = {
        name: 'Test Student',
        email: `student_${Date.now()}@test.com`,
        enrollmentNumber: 'T' + Date.now(),
        department: 'Test',
        semester: '1',
        password: 'password123'
    };
    const regRes = await fetch(`${API_BASE}/auth/student/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
    });
    const regBody = await regRes.json();
    
    const studLoginRes = await fetch(`${API_BASE}/auth/student/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: studentData.email, password: 'password123' })
    });
    const studLoginBody = await studLoginRes.json();
    studentToken = studLoginBody.token || studLoginBody.data?.token;
    console.log('Student login:', studentToken ? 'PASS' : 'FAIL ' + JSON.stringify(studLoginBody));

    if (studentToken) {
        const eventRegRes = await fetch(`${API_BASE}/registrations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${studentToken}` },
            body: JSON.stringify({ 
                eventId: testEventId,
                studentName: studentData.name,
                enrollmentNumber: studentData.enrollmentNumber,
                email: studentData.email
            })
        });
        const eventRegBody = await eventRegRes.json();
        if (eventRegBody.success) {
            testRegId = eventRegBody.data.id || eventRegBody.data._id;
            console.log('Registration creation: PASS', testRegId);
        } else {
            console.log('Registration creation: FAIL', JSON.stringify(eventRegBody));
        }

        const myRegsRes = await fetch(`${API_BASE}/registrations/me`, {
            headers: { 'Authorization': `Bearer ${studentToken}` }
        });
        const myRegsBody = await myRegsRes.json();
        console.log('Fetch my registrations:', myRegsBody.success && myRegsBody.data.length > 0 ? 'PASS' : 'FAIL ' + JSON.stringify(myRegsBody));
    }
  }

  console.log('\n--- SECURITY TESTING (EXPECTED FAILURES) ---');
  // Student trying to access admin events
  if (studentToken) {
      const studAdminRes = await fetch(`${API_BASE}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${studentToken}` },
          body: JSON.stringify({ title: 'Hacked' })
      });
      const studAdminBody = await studAdminRes.json();
      console.log('Student trying to create event:', studAdminBody.success === false && studAdminRes.status === 403 ? 'PASS (Blocked)' : 'FAIL ' + JSON.stringify(studAdminBody));
  }

  // Unauthenticated user trying to register
  if (testEventId) {
      const unauthRegRes = await fetch(`${API_BASE}/registrations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId: testEventId })
      });
      const unauthRegBody = await unauthRegRes.json();
      console.log('Unauthenticated trying to register:', unauthRegBody.success === false && unauthRegRes.status === 401 ? 'PASS (Blocked)' : 'FAIL ' + JSON.stringify(unauthRegBody));
  }

  console.log('\n--- CLEANUP ---');
  if (testRegId) await mongoose.connection.db?.collection('registrations').deleteOne({ _id: new mongoose.Types.ObjectId(testRegId) });
  if (testEventId) await mongoose.connection.db?.collection('events').deleteOne({ _id: new mongoose.Types.ObjectId(testEventId) });
  if (testCoordId) await mongoose.connection.db?.collection('coordinators').deleteOne({ _id: new mongoose.Types.ObjectId(testCoordId) });
  // find the student using token decoding or just by regex email
  await mongoose.connection.db?.collection('students').deleteOne({ email: /student_.*@test\.com/ });

  console.log('Cleanup complete.');
  
  await mongoose.disconnect();
}

runTest().catch(console.error);
