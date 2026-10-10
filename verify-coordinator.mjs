import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ckpcet_events');
  
  const coordinatorSchema = new mongoose.Schema({ name: String, email: String, passwordHash: String, department: String, role: String, avatar: String });
  const Coordinator = mongoose.models.Coordinator || mongoose.model('Coordinator', coordinatorSchema);
  
  // Seed one coordinator if not exists
  let coord = await Coordinator.findOne({ email: 'coord@ckpcet.ac.in' });
  if (!coord) {
    const passwordHash = await bcrypt.hash('coordpassword', 10);
    coord = await Coordinator.create({
      name: 'Test Coordinator',
      email: 'coord@ckpcet.ac.in',
      passwordHash,
      department: 'Computer Engineering',
      role: 'coordinator',
      avatar: 'https://ui-avatars.com/api/?name=Test+Coordinator'
    });
    console.log('Seeded coordinator:', coord._id);
  } else {
    console.log('Coordinator already exists:', coord._id);
  }

  const BASE_URL = 'http://localhost:5000';

  console.log('\\n[1] Coordinator login...');
  const loginRes = await fetch(`${BASE_URL}/api/coordinator/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'coord@ckpcet.ac.in', password: 'coordpassword' })
  });
  const loginData = await loginRes.json();
  if (!loginData.success) {
    console.error('Login failed:', loginData);
    process.exit(1);
  }
  const token = loginData.data.token;
  console.log('Login successful! Token acquired.');

  console.log('\\n[2] Fetch Profile...');
  const profileRes = await fetch(`${BASE_URL}/api/coordinator/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const profileData = await profileRes.json();
  if (!profileData.success) {
    console.error('Profile fetch failed:', profileData);
    process.exit(1);
  }
  console.log('Profile fetched successfully:', profileData.data.email);

  console.log('\\n[3] Fetch Dashboard Stats...');
  const dashRes = await fetch(`${BASE_URL}/api/coordinator/dashboard`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const dashData = await dashRes.json();
  console.log('Dashboard stats:', dashData.data);

  console.log('\\n[4] Fetch Assigned Events...');
  const eventsRes = await fetch(`${BASE_URL}/api/coordinator/events`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const eventsData = await eventsRes.json();
  console.log('Assigned Events:', eventsData.data.length);
  
  console.log('\\nALL TESTS PASSED SUCCESSFULLY!');
  await mongoose.connection.close();
  process.exit(0);
}

run().catch(console.error);
