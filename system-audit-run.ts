import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const API_BASE = 'http://localhost:5000/api';

async function runAudit() {
  console.log('--- STARTING SYSTEM WIDE AUDIT ---');

  // Connect to DB directly for cleanup
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (uri) {
    await mongoose.connect(uri);
    console.log('MongoDB connection: PASS');
  } else {
    console.log('MongoDB connection: FAIL (Missing URI)');
    return;
  }

  try {
    // Cleanup old test data
    await mongoose.connection.collection('admins').deleteMany({ email: /audit_/ });
    await mongoose.connection.collection('coordinators').deleteMany({ email: /audit_/ });
    await mongoose.connection.collection('students').deleteMany({ email: /audit_/ });
    await mongoose.connection.collection('events').deleteMany({ title: /Audit Event/ });
    await mongoose.connection.collection('registrations').deleteMany({ email: /audit_/ });
    console.log('Test data cleanup: PASS');

    // 1. ADMIN LOGIN
    console.log('\n--- ADMIN FLOW ---');
    const adminRes = await axios.post(`${API_BASE}/auth/admin/login`, {
      email: 'admin@ckpcet.ac.in',
      password: 'password123'
    });
    const adminToken = adminRes.data.data.token;
    console.log('Admin login: PASS');
    
    // Create Admin Profile via PUT for testing consistency
    const updateAdmin = await axios.put(`${API_BASE}/admin/profile`, { name: 'Audit Admin', department: 'SuperAdmin' }, {
       headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (updateAdmin.data.data.name !== 'Audit Admin') throw new Error('Admin profile update failed');
    console.log('Admin profile update: PASS');

    const timestamp = Date.now();

    // 2. CREATE COORDINATOR A & B
    console.log('\n--- CREATE COORDINATORS ---');
    const coordAEmail = `audit_coordA_${timestamp}@test.com`;
    const coordBEmail = `audit_coordB_${timestamp}@test.com`;
    const coordA = await axios.post(`${API_BASE}/admin/coordinators`, {
      name: 'Audit Coord A',
      email: coordAEmail
    }, { headers: { Authorization: `Bearer ${adminToken}` } });
    const coordB = await axios.post(`${API_BASE}/admin/coordinators`, {
      name: 'Audit Coord B',
      email: coordBEmail
    }, { headers: { Authorization: `Bearer ${adminToken}` } });
    
    const coordAId = coordA.data.data.id;
    const coordBId = coordB.data.data.id;
    console.log(`Coordinator A created: PASS ${coordAId}`);
    console.log(`Coordinator B created: PASS ${coordBId}`);

    // 3. CREATE EVENTS
    console.log('\n--- CREATE EVENTS ---');
    const eventA = await axios.post(`${API_BASE}/events`, {
      title: 'Audit Event A',
      description: 'Audit Desc',
      category: 'Workshop',
      date: new Date(Date.now() + 86400000).toISOString(),
      time: '10:00 AM',
      venue: 'Room 1',
      maxParticipants: 100,
      registrationDeadline: new Date(Date.now() + 43200000).toISOString(),
      status: 'upcoming',
      coordinatorIds: [coordAId]
    }, { headers: { Authorization: `Bearer ${adminToken}` } });

    const eventB = await axios.post(`${API_BASE}/events`, {
      title: 'Audit Event B',
      description: 'Audit Desc',
      category: 'Workshop',
      date: new Date(Date.now() + 86400000).toISOString(),
      time: '11:00 AM',
      venue: 'Room 2',
      maxParticipants: 100,
      registrationDeadline: new Date(Date.now() + 43200000).toISOString(),
      status: 'upcoming',
      coordinatorIds: [coordBId]
    }, { headers: { Authorization: `Bearer ${adminToken}` } });

    const eventShared = await axios.post(`${API_BASE}/events`, {
      title: 'Audit Event Shared',
      description: 'Audit Desc',
      category: 'Workshop',
      date: new Date(Date.now() + 86400000).toISOString(),
      time: '12:00 PM',
      venue: 'Room 3',
      maxParticipants: 100,
      registrationDeadline: new Date(Date.now() + 43200000).toISOString(),
      status: 'upcoming',
      coordinatorIds: [coordAId, coordBId]
    }, { headers: { Authorization: `Bearer ${adminToken}` } });

    const eventAId = eventA.data.data.id;
    const eventBId = eventB.data.data.id;
    const eventSharedId = eventShared.data.data.id;
    console.log(`Events created: PASS ${eventAId}, ${eventBId}, ${eventSharedId}`);

    // 4. STUDENT WORKFLOW
    console.log('\n--- STUDENT FLOW ---');
    const studAEmail = `audit_studentA_${timestamp}@test.com`;
    const studBEmail = `audit_studentB_${timestamp}@test.com`;
    const studCEmail = `audit_studentC_${timestamp}@test.com`;
    await axios.post(`${API_BASE}/auth/student/signup`, {
      name: 'Audit Student A', email: studAEmail, enrollmentNumber: `A1_${timestamp}`, password: 'password123', department: 'CSE', semester: '1'
    });
    await axios.post(`${API_BASE}/auth/student/signup`, {
      name: 'Audit Student B', email: studBEmail, enrollmentNumber: `B1_${timestamp}`, password: 'password123', department: 'CSE', semester: '1'
    });
    await axios.post(`${API_BASE}/auth/student/signup`, {
      name: 'Audit Student C', email: studCEmail, enrollmentNumber: `C1_${timestamp}`, password: 'password123', department: 'CSE', semester: '1'
    });

    const studALogin = await axios.post(`${API_BASE}/auth/student/login`, { email: studAEmail, password: 'password123' });
    const studBLogin = await axios.post(`${API_BASE}/auth/student/login`, { email: studBEmail, password: 'password123' });
    const studCLogin = await axios.post(`${API_BASE}/auth/student/login`, { email: studCEmail, password: 'password123' });

    const studAToken = studALogin.data.token;
    const studBToken = studBLogin.data.token;
    const studCToken = studCLogin.data.token;
    console.log('Students signed up and logged in: PASS');

    // Registrations
    await axios.post(`${API_BASE}/registrations`, { eventId: eventAId }, { headers: { Authorization: `Bearer ${studAToken}` } });
    await axios.post(`${API_BASE}/registrations`, { eventId: eventBId }, { headers: { Authorization: `Bearer ${studBToken}` } });
    await axios.post(`${API_BASE}/registrations`, { eventId: eventSharedId }, { headers: { Authorization: `Bearer ${studCToken}` } });
    console.log('Students registered for events: PASS');

    // 5. COORDINATOR VERIFICATION
    console.log('\n--- COORDINATOR VERIFICATION ---');
    const coordALogin = await axios.post(`${API_BASE}/auth/coordinator/login`, { email: coordAEmail, password: 'defaultPassword123' });
    const coordBLogin = await axios.post(`${API_BASE}/auth/coordinator/login`, { email: coordBEmail, password: 'defaultPassword123' });
    const coordAToken = coordALogin.data.data.token;
    const coordBToken = coordBLogin.data.data.token;
    console.log('Coordinators logged in: PASS');
    
    // Coordinator Profile update
    const coordProfileRes = await axios.put(`${API_BASE}/coordinator/profile`, { name: 'Audit Coord A Updated', department: 'Science' }, { headers: { Authorization: `Bearer ${coordAToken}` } });
    if (coordProfileRes.data.data.name !== 'Audit Coord A Updated') throw new Error('Coordinator profile update failed');
    console.log('Coordinator profile update: PASS');

    const coordAEvents = await axios.get(`${API_BASE}/coordinator/events`, { headers: { Authorization: `Bearer ${coordAToken}` } });
    const coordBEvents = await axios.get(`${API_BASE}/coordinator/events`, { headers: { Authorization: `Bearer ${coordBToken}` } });

    const aEventIds = coordAEvents.data.data.map((e: any) => e.id);
    const bEventIds = coordBEvents.data.data.map((e: any) => e.id);

    if (!aEventIds.includes(eventAId) || !aEventIds.includes(eventSharedId) || aEventIds.includes(eventBId)) {
      throw new Error('Coordinator A event visibility rules failed');
    }
    if (!bEventIds.includes(eventBId) || !bEventIds.includes(eventSharedId) || bEventIds.includes(eventAId)) {
      throw new Error('Coordinator B event visibility rules failed');
    }
    console.log('Coordinator Event isolation: PASS');

    const coordARegs = await axios.get(`${API_BASE}/coordinator/registrations`, { headers: { Authorization: `Bearer ${coordAToken}` } });
    const coordBRegs = await axios.get(`${API_BASE}/coordinator/registrations`, { headers: { Authorization: `Bearer ${coordBToken}` } });

    const aRegEventIds = coordARegs.data.data.map((r: any) => r.eventId);
    const bRegEventIds = coordBRegs.data.data.map((r: any) => r.eventId);

    if (aRegEventIds.includes(eventBId)) throw new Error('Coordinator A can see Event B registrations');
    if (bRegEventIds.includes(eventAId)) throw new Error('Coordinator B can see Event A registrations');
    console.log('Coordinator Registration isolation: PASS');

    // 6. ADMIN VERIFICATION
    console.log('\n--- ADMIN VERIFICATION ---');
    const adminRegs = await axios.get(`${API_BASE}/admin/registrations`, { headers: { Authorization: `Bearer ${adminToken}` } });
    const adminRegEventIds = adminRegs.data.data.map((r: any) => r.eventId);
    if (!adminRegEventIds.includes(eventAId) || !adminRegEventIds.includes(eventBId) || !adminRegEventIds.includes(eventSharedId)) {
      throw new Error('Admin global registration visibility failed');
    }
    console.log('Admin global visibility: PASS');

    // 7. SECURITY ATTACK TESTS
    console.log('\n--- SECURITY ATTACK TESTS ---');
    try {
      await axios.post(`${API_BASE}/admin/coordinators`, {}, { headers: { Authorization: `Bearer ${studAToken}` } });
      throw new Error('Student accessed admin endpoint');
    } catch (e: any) {
      if (e.response && e.response.status === 403) console.log('Student -> Admin blocked: PASS');
      else throw e;
    }

    try {
      await axios.get(`${API_BASE}/coordinator/events`, { headers: { Authorization: `Bearer ${studAToken}` } });
      throw new Error('Student accessed coordinator endpoint');
    } catch (e: any) {
      if (e.response && e.response.status === 403) console.log('Student -> Coordinator blocked: PASS');
      else throw e;
    }

    try {
      await axios.post(`${API_BASE}/events`, {}, { headers: { Authorization: `Bearer ${coordAToken}` } });
      throw new Error('Coordinator accessed admin endpoint');
    } catch (e: any) {
      if (e.response && e.response.status === 403) console.log('Coordinator -> Admin blocked: PASS');
      else throw e;
    }

    try {
      await axios.put(`${API_BASE}/events/${eventBId}`, { title: 'Hacked' }, { headers: { Authorization: `Bearer ${coordAToken}` } });
      throw new Error('Coordinator modified unrelated event');
    } catch (e: any) {
      if (e.response && e.response.status === 403) console.log('Coordinator -> Unrelated event blocked: PASS');
      else throw e;
    }

    console.log('\n--- OVERALL RESULT ---');
    console.log('SYSTEM WIDE AUDIT: ALL TESTS PASSED SUCCESSFULLY');

  } catch (error: any) {
    console.error('Test Failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  } finally {
    // Teardown
    await mongoose.connection.collection('admins').deleteMany({ email: /audit_/ });
    await mongoose.connection.collection('coordinators').deleteMany({ email: /audit_/ });
    await mongoose.connection.collection('students').deleteMany({ email: /audit_/ });
    await mongoose.connection.collection('events').deleteMany({ title: /Audit Event/ });
    await mongoose.connection.collection('registrations').deleteMany({ email: /audit_/ });
    await mongoose.connection.close();
  }
}

runAudit();
