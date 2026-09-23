import { EventRepository } from '../repositories/EventRepository';
import { Event } from '../data/mockData';

export class EventService {
  private eventRepo = new EventRepository();

  async getAllEvents(): Promise<Event[]> {
    return this.eventRepo.findAll();
  }

  async getEventsByCoordinatorId(coordinatorId: string): Promise<Event[]> {
    const events = await this.eventRepo.findAll();
    return events.filter(e => e.coordinatorIds && e.coordinatorIds.includes(coordinatorId));
  }

  async getEventById(id: string): Promise<Event | undefined> {
    return this.eventRepo.findById(id);
  }

  async createEvent(eventData: Omit<Event, 'id' | 'registrationCount'>): Promise<Event> {
    const newEvent: Event = {
      ...eventData,
      id: `e${Date.now()}`,
      registrationCount: 0,
    };
    return this.eventRepo.create(newEvent);
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | undefined> {
    return this.eventRepo.update(id, updates);
  }

  async deleteEvent(id: string): Promise<boolean> {
    return this.eventRepo.delete(id);
  }
}
