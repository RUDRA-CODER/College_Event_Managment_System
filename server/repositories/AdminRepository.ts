import { Admin, mockAdmins } from '../data/mockData';

export class AdminRepository {
  async findAll(): Promise<Admin[]> {
    return mockAdmins;
  }

  async findById(id: string): Promise<Admin | undefined> {
    return mockAdmins.find(a => a.id === id);
  }

  async findByEmail(email: string): Promise<Admin | undefined> {
    return mockAdmins.find(a => a.email === email);
  }
}
