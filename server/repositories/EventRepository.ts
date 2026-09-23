import { Event, mockEvents } from '../data/mockData';

export class EventRepository {
  async findAll(): Promise<Event[]> {
    return mockEvents;
  }

  async findById(id: string): Promise<Event | undefined> {
    return mockEvents.find(e => e.id === id);
  }

  async create(event: Event): Promise<Event> {
    mockEvents.push(event);
    return event;
  }

  async update(id: string, updates: Partial<Event>): Promise<Event | undefined> {
    const index = mockEvents.findIndex(e => e.id === id);
    if (index === -1) return undefined;
    mockEvents[index] = { ...mockEvents[index], ...updates };
    return mockEvents[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = mockEvents.findIndex(e => e.id === id);
    if (index === -1) return false;
    mockEvents.splice(index, 1);
    return true;
  }
}
