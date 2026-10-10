const mongoose = require('mongoose');
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const EventSchema = new mongoose.Schema({ title: String, coordinatorIds: [mongoose.Schema.Types.ObjectId] });
const RegistrationSchema = new mongoose.Schema({ eventId: mongoose.Schema.Types.ObjectId, studentId: mongoose.Schema.Types.ObjectId, email: String, studentName: String, enrollmentNumber: String });
const StudentSchema = new mongoose.Schema({ email: String, name: String, enrollmentNumber: String });
const CoordinatorSchema = new mongoose.Schema({ email: String, name: String });

const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);
const Registration = mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);
const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);
const Coordinator = mongoose.models.Coordinator || mongoose.model('Coordinator', CoordinatorSchema);

async function run() {
  let createdIds = {};
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: process.env.DATABASE_NAME });
    
    // 1. Create Coordinator
    const coord = await Coordinator.create({ name: 'Test Coord', email: 'coord@example.com' });
    createdIds.coord = coord._id;

    // 2. Create Event
    const event = await Event.create({ title: 'Test Final Event', coordinatorIds: [coord._id] });
    createdIds.event = event._id;

    // 3. Create Students
    const timestamp = Date.now();
    const student1 = await Student.create({ name: 'Student 1', email: `test1_${timestamp}@example.com`, enrollmentNumber: `T1_${timestamp}` });
    const student2 = await Student.create({ name: 'Student 2', email: `test2_${timestamp}@example.com`, enrollmentNumber: `T2_${timestamp}` });
    createdIds.students = [student1._id, student2._id];

    // 4. Register Students
    const reg1 = await Registration.create({ eventId: event._id, studentId: student1._id, email: student1.email, studentName: student1.name, enrollmentNumber: student1.enrollmentNumber });
    const reg2 = await Registration.create({ eventId: event._id, studentId: student2._id, email: student2.email, studentName: student2.name, enrollmentNumber: student2.enrollmentNumber });
    createdIds.regs = [reg1._id, reg2._id];

    console.log(`Registered students: 2`);
    console.log(`Unique recipients: 2`);

    // 5. Generate Token
    const token = jwt.sign({ userId: coord._id.toString(), role: 'coordinator' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // 6. API Call
    console.log('Sending message via API for eventId:', event._id);
    const dbEvent = await Event.findById(event._id);
    console.log('Is event in DB?', !!dbEvent);
    const response = await axios.post(`http://localhost:5000/api/events/${event._id}/notify`, {
      subject: 'CKPCET Events - Final Email Test',
      message: 'This is the final real email delivery test for the CKPCET College Event Management System.'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('API Response:', response.data);

    if (response.data.success) {
       console.log('sendMail: PASS');
    } else {
       console.log('sendMail: FAIL');
    }

  } catch(e) {
    console.error('API Error:', e.response ? e.response.data : e.message);
    console.log('sendMail: FAIL');
  } finally {
    // Cleanup
    if (createdIds.coord) await Coordinator.findByIdAndDelete(createdIds.coord);
    if (createdIds.event) await Event.findByIdAndDelete(createdIds.event);
    if (createdIds.students) {
       for (const id of createdIds.students) await Student.findByIdAndDelete(id);
    }
    if (createdIds.regs) {
       for (const id of createdIds.regs) await Registration.findByIdAndDelete(id);
    }
    mongoose.disconnect();
  }
}

run();
