import mongoose from 'mongoose';
import StudentModel, { IStudent } from '../models/Student';

export class StudentRepository {
  private mapToStudent(doc: any) {
    if (!doc) return undefined;
    const obj = doc.toObject ? doc.toObject() : doc;
    return {
      id: obj._id ? obj._id.toString() : obj.id,
      name: obj.name,
      enrollmentNumber: obj.enrollmentNumber,
      email: obj.email,
      department: obj.department,
      semester: obj.semester,
      phone: obj.phone,
      emailVerified: obj.emailVerified,
      address: obj.address,
      city: obj.city,
      state: obj.state,
      pincode: obj.pincode,
      dateOfBirth: obj.dateOfBirth,
      gender: obj.gender,
      profileImage: obj.profileImage
    };
  }

  async findAll() {
    const students = await StudentModel.find().lean();
    return students.map((doc: any) => ({
      id: doc._id.toString(),
      name: doc.name,
      enrollmentNumber: doc.enrollmentNumber,
      email: doc.email,
      department: doc.department,
      semester: doc.semester,
      phone: doc.phone,
      emailVerified: doc.emailVerified,
      address: doc.address,
      city: doc.city,
      state: doc.state,
      pincode: doc.pincode,
      dateOfBirth: doc.dateOfBirth,
      gender: doc.gender,
      profileImage: doc.profileImage
    }));
  }

  async findById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    const student = await StudentModel.findById(id);
    return this.mapToStudent(student);
  }

  async findByEnrollmentNumber(enrollmentNumber: string) {
    const student = await StudentModel.findOne({ enrollmentNumber });
    return this.mapToStudent(student);
  }

  async findByEmail(email: string) {
    const student = await StudentModel.findOne({ email });
    return this.mapToStudent(student);
  }

  async create(data: { name: string; enrollmentNumber: string; email: string }) {
    const student = new StudentModel(data);
    const saved = await student.save();
    return this.mapToStudent(saved);
  }

  async update(id: string, updates: Partial<{ name: string; enrollmentNumber: string; email: string; department: string; semester: string; phone: string; emailVerified: boolean; address: string; city: string; state: string; pincode: string; dateOfBirth: string; gender: string; profileImage: string }>) {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    const updated = await StudentModel.findByIdAndUpdate(id, updates, { returnDocument: 'after' });
    return this.mapToStudent(updated);
  }

  async delete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await StudentModel.findByIdAndDelete(id);
    return result !== null;
  }
}
