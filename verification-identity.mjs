

async function runTest() {
  console.log("=== Student Identity Verification Test ===");

  // Create Student A
  console.log("\n[1] Creating Student A...");
  let resA = await fetch('http://localhost:5000/api/auth/student/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Student A',
      email: 'studenta_test@ckpcet.ac.in',
      password: 'password123',
      enrollmentNumber: '22CE00A_TEST',
      phone: '1234567890',
      department: 'CE',
      semester: 1
    })
  });
  let dataA = await resA.json();
  if (dataA.message === 'Student already exists' || dataA.message === 'Email is already registered') {
    console.log("Student A already exists, logging in instead...");
  } else if (!dataA.success) {
    throw new Error('Failed to create Student A: ' + dataA.message);
  } else {
    console.log("Student A created successfully.");
  }

  // Create Student B
  console.log("\n[2] Creating Student B...");
  let resB = await fetch('http://localhost:5000/api/auth/student/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Student B',
      email: 'studentb_test@ckpcet.ac.in',
      password: 'password123',
      enrollmentNumber: '22CE00B_TEST',
      phone: '0987654321',
      department: 'IT',
      semester: 2
    })
  });
  let dataB = await resB.json();
  if (dataB.message === 'Student already exists' || dataB.message === 'Email is already registered') {
    console.log("Student B already exists, logging in instead...");
  } else if (!dataB.success) {
    throw new Error('Failed to create Student B: ' + dataB.message);
  } else {
    console.log("Student B created successfully.");
  }

  // Login as Student A
  console.log("\n[3] Logging in as Student A...");
  let loginResA = await fetch('http://localhost:5000/api/auth/student/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'studenta_test@ckpcet.ac.in',
      password: 'password123'
    })
  });
  let loginDataA = await loginResA.json();
  if (!loginDataA.success) throw new Error('Failed to login Student A');
  console.log("Login successful. Received Token for Student A.");
  const tokenA = loginDataA.token;

  // Login as Student B
  console.log("\n[4] Logging in as Student B...");
  let loginResB = await fetch('http://localhost:5000/api/auth/student/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'studentb_test@ckpcet.ac.in',
      password: 'password123'
    })
  });
  let loginDataB = await loginResB.json();
  if (!loginDataB.success) throw new Error('Failed to login Student B');
  console.log("Login successful. Received Token for Student B.");
  const tokenB = loginDataB.token;

  // Fetch Student A Profile
  console.log("\n[5] Fetching Profile using Student A's Token (GET /api/auth/student/profile)...");
  let meResA = await fetch('http://localhost:5000/api/auth/student/profile', {
    headers: { 'Authorization': `Bearer ${tokenA}` }
  });
  let meDataA = await meResA.json();
  console.log("Profile Result:", meDataA);
  if (meDataA.data.email !== 'studenta_test@ckpcet.ac.in') {
    throw new Error('Identity mismatch! Expected Student A.');
  }
  console.log("-> Verification PASS: Identity matches Student A.");

  // Fetch Student B Profile
  console.log("\n[6] Fetching Profile using Student B's Token (GET /api/auth/student/profile)...");
  let meResB = await fetch('http://localhost:5000/api/auth/student/profile', {
    headers: { 'Authorization': `Bearer ${tokenB}` }
  });
  let meDataB = await meResB.json();
  console.log("Profile Result:", meDataB);
  if (meDataB.data.email !== 'studentb_test@ckpcet.ac.in') {
    throw new Error('Identity mismatch! Expected Student B.');
  }
  console.log("-> Verification PASS: Identity matches Student B.");

  // Update Student A Profile
  console.log("\n[7] Updating Profile using Student A's Token (PUT /api/auth/student/profile)...");
  let updateResA = await fetch('http://localhost:5000/api/auth/student/profile', {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenA}` 
    },
    body: JSON.stringify({ phone: '9999999999' })
  });
  let updateDataA = await updateResA.json();
  if (updateDataA.data.phone !== '9999999999') {
    throw new Error('Identity update failed! Expected phone to be updated.');
  }
  console.log("-> Verification PASS: Profile update matches Student A.");

  console.log("\n=== Identity Verification Completed Successfully! ===");
}

runTest().catch(console.error);
