const mongoose = require('mongoose');
require('dotenv').config();

const EventSchema = new mongoose.Schema({ title: String });
const RegistrationSchema = new mongoose.Schema({ eventId: mongoose.Schema.Types.ObjectId, studentId: mongoose.Schema.Types.ObjectId });
const StudentSchema = new mongoose.Schema({ email: String });

const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);
const Registration = mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);
const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const events = await Event.find();
    for (const event of events) {
      const registrations = await Registration.find({ eventId: event._id });
      if (registrations.length > 0) {
        console.log(`Event: ${event.title}`);
        console.log(`Registered students: ${registrations.length}`);
        
        let uniqueEmails = new Set();
        for (const reg of registrations) {
          const student = await Student.findById(reg.studentId);
          if (student && student.email) {
            uniqueEmails.add(student.email);
          }
        }
        console.log(`Unique email recipients: ${uniqueEmails.size}`);
        process.exit(0);
      }
    }
    console.log("No events with registrations found.");
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
run();
