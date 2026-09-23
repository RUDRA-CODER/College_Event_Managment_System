import { RegistrationRepository } from '../repositories/RegistrationRepository';
import { Registration } from '../data/mockData';

export class RegistrationService {
  private registrationRepo = new RegistrationRepository();

  async getAllRegistrations(): Promise<Registration[]> {
    return this.registrationRepo.findAll();
  }

  async getRegistrationsByEventIds(eventIds: string[]): Promise<Registration[]> {
    const regs = await this.registrationRepo.findAll();
    return regs.filter(r => eventIds.includes(r.eventId));
  }

  async getRegistrationById(id: string): Promise<Registration | undefined> {
    return this.registrationRepo.findById(id);
  }

  async getRegistrationsByEvent(eventId: string): Promise<Registration[]> {
    return this.registrationRepo.findByEventId(eventId);
  }

  async createRegistration(data: Omit<Registration, 'id' | 'registrationDate' | 'status' | 'attendance'>): Promise<Registration> {
    const newReg: Registration = {
      ...data,
      id: `r${Date.now()}`,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      attendance: false,
    };
    return this.registrationRepo.create(newReg);
  }

  async updateRegistration(id: string, updates: Partial<Registration>): Promise<Registration | undefined> {
    return this.registrationRepo.update(id, updates);
  }

  async deleteRegistration(id: string): Promise<boolean> {
    return this.registrationRepo.delete(id);
  }
}
