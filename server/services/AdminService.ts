import { AdminRepository } from '../repositories/AdminRepository';
import AdminModel from '../models/Admin';
import { comparePassword, generateToken } from '../utils/auth';

export class AdminService {
  private adminRepo = new AdminRepository();

  async getAdminProfile(id: string): Promise<any> {
    return this.adminRepo.findById(id);
  }

  async updateAdminProfile(id: string, dataToUpdate: any): Promise<any> {
    return this.adminRepo.update(id, dataToUpdate);
  }

  async login(data: any): Promise<{ token: string; user: any }> {
    const { email, password } = data;

    const admin = await AdminModel.findOne({ email }).select('+passwordHash');
    if (!admin || !admin.passwordHash) {
      throw new Error('Invalid credentials');
    }

    const isValid = await comparePassword(password, admin.passwordHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(admin._id.toString(), 'admin');

    return {
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    };
  }
}
