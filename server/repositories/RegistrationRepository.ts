import mongoose from 'mongoose';
import RegistrationModel, { IRegistration } from '../models/Registration';
import { Registration } from '../data/mockData';

export class RegistrationRepository {
  private mapToRegistration(doc: any): Registration | undefined {
    if (!doc) return undefined;
    const obj = doc.toObject ? doc.toObject() : doc;
    return {
      id: obj._id ? obj._id.toString() : obj.id,
      eventId: obj.eventId ? obj.eventId.toString() : obj.eventId,
      studentId: obj.studentId ? obj.studentId.toString() : obj.studentId,
      studentName: obj.studentName,
      enrollmentNumber: obj.enrollmentNumber,
      email: obj.email,
      registrationDate: obj.registrationDate,
      status: obj.status,
      attendance: obj.attendance,
      customData: obj.customData,
    };
  }

  async findAll(): Promise<Registration[]> {
    const regs = await RegistrationModel.find().lean();
    return regs.map(doc => this.mapToRegistration(doc)!);
  }

  async findById(id: string): Promise<Registration | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    const reg = await RegistrationModel.findById(id);
    return this.mapToRegistration(reg);
  }

  async findByEventId(eventId: string): Promise<Registration[]> {
    if (!mongoose.Types.ObjectId.isValid(eventId)) return [];
    const regs = await RegistrationModel.find({ eventId }).lean();
    return regs.map(doc => this.mapToRegistration(doc)!);
  }

  async findByStudentId(studentId: string): Promise<Registration[]> {
    if (!mongoose.Types.ObjectId.isValid(studentId)) return [];
    const regs = await RegistrationModel.find({ studentId }).lean();
    return regs.map(doc => this.mapToRegistration(doc)!);
  }

  async create(registration: Omit<Registration, 'id'>): Promise<Registration> {
    // legacy compatibility for non-object id strings
    const eventId = mongoose.Types.ObjectId.isValid(registration.eventId)
      ? new mongoose.Types.ObjectId(registration.eventId)
      : new mongoose.Types.ObjectId(); // Create a valid objectId for fallback
      
    const studentId = mongoose.Types.ObjectId.isValid(registration.studentId)
      ? new mongoose.Types.ObjectId(registration.studentId)
      : new mongoose.Types.ObjectId();

    const data = {
      ...registration,
      eventId: mongoose.Types.ObjectId.isValid(registration.eventId) ? registration.eventId : eventId,
      studentId: mongoose.Types.ObjectId.isValid(registration.studentId) ? registration.studentId : studentId
    };

    const newReg = new RegistrationModel(data);
    const saved = await newReg.save();
    return this.mapToRegistration(saved)!;
  }

  async update(id: string, updates: Partial<Registration>): Promise<Registration | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    const updated = await RegistrationModel.findByIdAndUpdate(id, updates, { returnDocument: 'after' });
    return this.mapToRegistration(updated);
  }

  async delete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await RegistrationModel.findByIdAndDelete(id);
    return result !== null;
  }
}
