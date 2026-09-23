import { CoordinatorRepository } from '../repositories/CoordinatorRepository';
import { Coordinator } from '../data/mockData';

export class CoordinatorService {
  private coordinatorRepo = new CoordinatorRepository();

  async getCoordinatorProfile(id: string): Promise<Coordinator | undefined> {
    return this.coordinatorRepo.findById(id);
  }

  async authenticate(email: string): Promise<Coordinator | undefined> {
    // For mock auth, we just check if the email exists. 
    // In real app, we'd check passwords.
    return this.coordinatorRepo.findByEmail(email);
  }

  async createCoordinator(data: { name: string, email: string }): Promise<Coordinator | null> {
    const existing = await this.coordinatorRepo.findByEmail(data.email);
    if (existing) {
      return null;
    }
    const newCoordinator: Coordinator = {
      id: `coord-00${Math.floor(Math.random() * 1000)}`, // Simple mock id generation
      name: data.name,
      email: data.email,
      department: 'Unassigned',
      role: 'Event Coordinator',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random&color=fff`
    };
    return this.coordinatorRepo.create(newCoordinator);
  }
}
