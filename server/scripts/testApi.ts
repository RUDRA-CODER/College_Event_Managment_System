const API_BASE = 'http://127.0.0.1:5000/api';

async function runTests() {
  console.log('--- STARTING TESTS ---');

  // 1. Admin Login
  console.log('Logging in as Admin...');
  const adminLoginRes = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ckpcet.ac.in', password: 'pass123' })
  });
  const adminLoginData = await adminLoginRes.json();
  if (!adminLoginData.success) {
    console.error('Admin login failed:', adminLoginData);
    return;
  }
  const adminToken = adminLoginData.data.token;
  console.log('Admin login successful.');

  // 2. Create Student Coordinator
  console.log('Creating Student Coordinator...');
  const stuCoordRes = await fetch(`${API_BASE}/admin/coordinators`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      name: 'Test Student Coord',
      email: 'test.stu.coord@example.com',
      password: 'pass123',
      coordinatorType: 'student',
      department: 'Computer Engineering',
      phone: '1234567890',
      enrollmentNumber: 'EN123456',
      semester: '6th Semester',
      // Fields not applicable to student
      designation: '',
      employeeId: '',
      facultyType: '',
      joiningDate: '',
      experience: ''
    })
  });
  const stuCoordData = await stuCoordRes.json();
  console.log('Student Coordinator Creation:', stuCoordData);

  // 3. Create Faculty Coordinator
  console.log('Creating Faculty Coordinator...');
  const facCoordRes = await fetch(`${API_BASE}/admin/coordinators`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      name: 'Test Faculty Coord',
      email: 'test.fac.coord@example.com',
      password: 'pass123',
      coordinatorType: 'faculty',
      department: 'Mechanical Engineering',
      phone: '0987654321',
      designation: 'Professor',
      employeeId: 'EMP456',
      facultyType: 'Teaching',
      joiningDate: '2015-06-01',
      experience: '9'
    })
  });
  const facCoordData = await facCoordRes.json();
  console.log('Faculty Coordinator Creation:', facCoordData);

  // 4. Register Student
  console.log('Creating new Student account...');
  const studentRegisterRes = await fetch(`${API_BASE}/auth/student/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'New Test Student',
      email: 'new.test.student@example.com',
      password: 'pass123',
      department: 'Computer Engineering',
      semester: '4th Semester',
      phone: '5551234567',
      enrollmentNumber: 'EN999999',
      gender: 'Male',
      dateOfBirth: '2000-01-01',
      address: '123 College Road',
      city: 'Surat',
      state: 'Gujarat',
      pincode: '395001',
      profileImage: ''
    })
  });
  const studentData = await studentRegisterRes.json();
  console.log('Student Registration:', studentData);

}

runTests();
