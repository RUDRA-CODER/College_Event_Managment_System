import { Registration, mockRegistrations } from '../data/mockData';

export class RegistrationRepository {
  async findAll(): Promise<Registration[]> {
    return mockRegistrations;
  }

  async findById(id: string): Promise<Registration | undefined> {
    return mockRegistrations.find(r => r.id === id);
  }

  async findByEventId(eventId: string): Promise<Registration[]> {
    return mockRegistrations.filter(r => r.eventId === eventId);
  }

  async create(registration: Registration): Promise<Registration> {
    mockRegistrations.push(registration);
    return registration;
  }

  async update(id: string, updates: Partial<Registration>): Promise<Registration | undefined> {
    const index = mockRegistrations.findIndex(r => r.id === id);
    if (index === -1) return undefined;
    mockRegistrations[index] = { ...mockRegistrations[index], ...updates };
    return mockRegistrations[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = mockRegistrations.findIndex(r => r.id === id);
    if (index === -1) return false;
    mockRegistrations.splice(index, 1);
    return true;
  }
}
