import { AdminRepository } from '../repositories/AdminRepository';
import { Admin } from '../data/mockData';

export class AdminService {
  private adminRepo = new AdminRepository();

  async getAdminProfile(id: string): Promise<Admin | undefined> {
    return this.adminRepo.findById(id);
  }

  async authenticate(email: string): Promise<Admin | undefined> {
    // For mock auth, we just check if the email exists.
    return this.adminRepo.findByEmail(email);
  }
}
