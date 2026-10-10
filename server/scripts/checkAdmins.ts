import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const AdminSchema = new mongoose.Schema({
  email: String,
  passwordHash: String
});

const AdminModel = mongoose.model('Admin', AdminSchema);

async function checkAdmins() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ckpcet_events', {
      dbName: 'ckpcet_events'
  });
  const admins = await AdminModel.find({});
  console.log('Admins found:', admins);
  mongoose.disconnect();
}
checkAdmins();
