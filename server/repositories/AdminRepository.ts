import mongoose from 'mongoose';
import AdminModel, { IAdmin } from '../models/Admin';

export class AdminRepository {
  private mapToAdmin(doc: any) {
    if (!doc) return undefined;
    const obj = doc.toObject ? doc.toObject() : doc;
    return {
      id: obj._id ? obj._id.toString() : obj.id,
      name: obj.name,
      email: obj.email,
      role: obj.role,
    };
  }

  async findAll() {
    const admins = await AdminModel.find().lean();
    return admins.map((doc: any) => ({
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      role: doc.role,
    }));
  }

  async findById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    const admin = await AdminModel.findById(id);
    return this.mapToAdmin(admin);
  }

  async findByEmail(email: string) {
    const admin = await AdminModel.findOne({ email });
    return this.mapToAdmin(admin);
  }

  async create(data: { name: string; email: string; role?: string }) {
    const admin = new AdminModel(data);
    const saved = await admin.save();
    return this.mapToAdmin(saved);
  }

  async update(id: string, updates: Partial<{ name: string; email: string; role: string }>) {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    const updated = await AdminModel.findByIdAndUpdate(id, updates, { returnDocument: 'after' });
    return this.mapToAdmin(updated);
  }

  async delete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await AdminModel.findByIdAndDelete(id);
    return result !== null;
  }
}
