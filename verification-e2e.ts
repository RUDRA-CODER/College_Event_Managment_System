import axios from 'axios';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const API = 'http://localhost:5000/api';
// Need to connect to Mongoose to seed admin
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/event_management';

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'admin' },
});
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

async function run() {
  console.log("🚀 Starting Final E2E API Verification...");
  try {
    const timestamp = Date.now();
    const adminEmail = `admin_${timestamp}@ckpcet.ac.in`;
    const coordEmail = `coord_${timestamp}@ckpcet.ac.in`;
    const studentEmail = `student_${timestamp}@ckpcet.ac.in`;
    const password = "Password123!";

    // 1. Create Admin (manually simulate seed)
    console.log("1️⃣ Seeding Admin...");
    await mongoose.connect(MONGO_URI, { dbName: process.env.DATABASE_NAME || 'ckpcet_events' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name: 'Admin Test', email: adminEmail, passwordHash: hashedPassword });
    await newAdmin.save();
    
    const { data: adminAuth } = await axios.post(`${API}/auth/admin/login`, { email: adminEmail, password });
    const adminToken = adminAuth.data.token;
    console.log("✅ Admin Logged In.");

    // 2. Create Coordinator (by Admin)
    console.log("2️⃣ Admin creating Coordinator...");
    await axios.post(`${API}/admin/coordinators`, {
      name: `Coord ${timestamp}`,
      email: coordEmail,
      department: "Computer",
      phone: "1234567890",
      password
    }, { headers: { Authorization: `Bearer ${adminToken}` } });

    const { data: coordAuth } = await axios.post(`${API}/auth/coordinator/login`, { email: coordEmail, password });
    const coordToken = coordAuth.data.token;
    console.log("✅ Coordinator created and Logged In.");

    // 3. Admin creates Event
    console.log("3️⃣ Admin creating Event...");
    const { data: eventRes } = await axios.post(`${API}/events`, {
      title: `Event ${timestamp}`,
      description: "Desc",
      category: "Technical",
      date: "2027-12-12",
      time: "10:00",
      venue: "Main Hall",
      maxParticipants: 10,
      registrationDeadline: "2027-12-10",
      coordinatorIds: [coordAuth.data.coordinator.id]
    }, { headers: { Authorization: `Bearer ${adminToken}` } });
    const eventId = eventRes.data?.id || eventRes.data?.data?.id || eventRes.data?._id;
    if (!eventId) throw new Error("Event ID missing from response: " + JSON.stringify(eventRes.data));
    console.log(`✅ Event Created. ID: ${eventId}`);

    // 4. Create Student
    console.log("4️⃣ Registering Student...");
    await axios.post(`${API}/auth/student/signup`, { email: studentEmail, password, name: 'Student Test', enrollmentNumber: `EN${timestamp}` });
    const { data: studentAuth } = await axios.post(`${API}/auth/student/login`, { email: studentEmail, password });
    const studentToken = studentAuth.token;
    console.log("✅ Student Logged In.");

    // 5. Student Registers for Event
    console.log("5️⃣ Student registering for Event...");
    await axios.post(`${API}/registrations`, { eventId }, { headers: { Authorization: `Bearer ${studentToken}` } });
    console.log("✅ Student Registered.");

    // 6. Check Registration Count (Admin)
    console.log("6️⃣ Checking Event Registration Count...");
    const { data: fetchEventRes } = await axios.get(`${API}/events/${eventId}`);
    const count = fetchEventRes.data.registrationCount;
    if (count !== 1) {
      throw new Error(`Registration count is ${count}, expected 1`);
    }
    console.log("✅ Registration Count updated correctly.");

    // 7. Password Reset Flow
    console.log("7️⃣ Testing Password Reset (Forgot)...");
    const { data: forgotRes } = await axios.post(`${API}/auth/password/forgot`, { email: studentEmail, role: 'student' });
    console.log("✅ Forgot Password initiated.");

    console.log("🎉 ALL E2E VERIFICATIONS PASSED!");

  } catch (error: any) {
    console.error("❌ E2E VERIFICATION FAILED:", error.response?.data || error.message);
    process.exit(1);
  } finally {
      await mongoose.disconnect();
  }
}

run();
