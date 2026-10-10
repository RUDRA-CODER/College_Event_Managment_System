import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const API_BASE = 'http://localhost:5000/api';
let adminToken = 'Bearer mock-jwt-token-admin-001';

async function fetchAPI(endpoint: string, method = 'GET', body: any = null, token: string = '') {
  const headers: any = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = token;
  const opts: any = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE}${endpoint}`, opts);
  const text = await res.text();
  try { return JSON.parse(text); } catch(e) { return text; }
}

async function run() {
  console.log('--- STARTING E2E API INTEGRATION TEST ---');
  let coordId = '';
  let eventId = '';
  let studentId = ''; // Wait, student creation happens where? Let's check if there is an endpoint.
  
  try {
    const uri = process.env.MONGO_URI;
    if (uri) {
      await mongoose.connect(uri, { dbName: process.env.DATABASE_NAME || 'ckpcet_events' });
      console.log('Connected to MongoDB via script.');
    }

    // 1. Admin login/dashboard
    console.log('\\n1. Admin Dashboard');
    const dbStats = await fetchAPI('/admin/dashboard', 'GET', null, adminToken);
    console.log('Admin Dashboard success:', !!dbStats?.data);

    // 2. Create temporary coordinator
    console.log('\\n2. Create Coordinator');
    const newCoordRes = await fetchAPI('/admin/coordinators', 'POST', {
      name: 'API Coordinator', email: 'api-coord@test.com', department: 'CS', phone: '123'
    }, adminToken);
    if (!newCoordRes.success) throw new Error('Failed to create coordinator: ' + JSON.stringify(newCoordRes));
    coordId = newCoordRes.data.id;
    console.log('Created Coordinator ID:', coordId);
    
    // 3. Create temporary event
    console.log('\\n3. Create Event');
    const newEventRes = await fetchAPI('/events', 'POST', {
      title: 'API Event', description: 'Testing API', date: '2026-11-01', time: '10AM', venue: 'Lab',
      category: 'Workshop', maxParticipants: 50, registrationCount: 0, status: 'upcoming', 
      coordinatorIds: [coordId], registrationDeadline: '2026-10-25'
    }, adminToken);
    if (!newEventRes.success) throw new Error('Failed to create event: ' + JSON.stringify(newEventRes));
    eventId = newEventRes.data.id;
    console.log('Created Event ID:', eventId);

    // 4. Coordinator Portal
    console.log('\\n4. Coordinator Portal');
    const coordToken = `Bearer mock-jwt-token-${coordId}`;
    const coordEventsRes = await fetchAPI('/coordinator/events', 'GET', null, coordToken);
    const hasEvent = coordEventsRes.data?.some((e: any) => e.id === eventId);
    console.log('Coordinator sees assigned event:', hasEvent);
    if (!hasEvent) throw new Error('Coordinator did not see the event');

    // 5. Create temporary student directly via repository since there's no API
    console.log('\\n5. Create temporary student (via DB)');
    const { StudentRepository } = require('./server/repositories/StudentRepository');
    const studentRepo = new StudentRepository();
    const newStudent = await studentRepo.create({
      name: 'API Student',
      enrollmentNumber: 'API12345',
      email: 'apistudent@example.com'
    });
    studentId = newStudent.id;
    console.log('Created Student ID:', studentId);

    // 6. Create Registration
    console.log('\\n6. Create Registration (API)');
    const newRegRes = await fetchAPI('/registrations', 'POST', {
      eventId: eventId,
      studentId: studentId,
      studentName: newStudent.name,
      enrollmentNumber: newStudent.enrollmentNumber,
      email: newStudent.email
    });
    if (!newRegRes.success) throw new Error('Failed to create registration: ' + JSON.stringify(newRegRes));
    const regId = newRegRes.data.id;
    console.log('Created Registration ID:', regId);

    // 7. Verify Registration Count / Event API
    console.log('\\n7. Verify Event Registration Count (API)');
    const eventAfterRes = await fetchAPI('/events/' + eventId, 'GET');
    console.log('Event Registration Count:', eventAfterRes.data?.registrationCount);

    // 8. Verify Visibility
    console.log('\\n8. Verify Registration Visibility');
    const adminRegs = await fetchAPI('/admin/registrations', 'GET', null, adminToken);
    const hasAdminReg = adminRegs.data?.some((r: any) => r.id === regId);
    console.log('Admin sees registration:', hasAdminReg);

    const coordRegs = await fetchAPI('/coordinator/events/' + eventId + '/registrations', 'GET', null, coordToken);
    console.log('Coordinator regs response:', coordRegs);
    const hasCoordReg = coordRegs.data?.some((r: any) => r.id === regId);
    console.log('Coordinator sees registration:', hasCoordReg);

    // Cleanup via Mongoose repositories because APIs for delete don't exist for everything
    console.log('\\n--- CLEANUP ---');
    const { EventRepository } = require('./server/repositories/EventRepository');
    const { CoordinatorRepository } = require('./server/repositories/CoordinatorRepository');
    const { RegistrationRepository } = require('./server/repositories/RegistrationRepository');
    await (new RegistrationRepository()).delete(regId);
    await (new EventRepository()).delete(eventId);
    await (new CoordinatorRepository()).delete(coordId);
    await studentRepo.delete(studentId);
    console.log('Cleanup completed.');

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}
run();
