import { Coordinator, mockCoordinators } from '../data/mockData';

export class CoordinatorRepository {
  async findAll(): Promise<Coordinator[]> {
    return mockCoordinators;
  }

  async findById(id: string): Promise<Coordinator | undefined> {
    return mockCoordinators.find(c => c.id === id);
  }

  async findByEmail(email: string): Promise<Coordinator | undefined> {
    return mockCoordinators.find(c => c.email === email);
  }

  async create(coordinator: Coordinator): Promise<Coordinator> {
    mockCoordinators.push(coordinator);
    return coordinator;
  }
}
