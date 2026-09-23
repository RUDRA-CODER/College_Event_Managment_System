import { Request, Response } from 'express';
import { EventService } from '../services/EventService';

const eventService = new EventService();

export class EventController {
  async getAllEvents(req: Request, res: Response) {
    try {
      const events = await eventService.getAllEvents();
      res.json({ success: true, data: events });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch events' });
    }
  }

  async getEventById(req: Request, res: Response) {
    try {
      const event = await eventService.getEventById(req.params.id as string);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
      res.json({ success: true, data: event });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch event' });
    }
  }

  async createEvent(req: Request, res: Response) {
    try {
      const newEvent = await eventService.createEvent(req.body);
      res.status(201).json({ success: true, data: newEvent });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create event' });
    }
  }

  async updateEvent(req: Request, res: Response) {
    try {
      const updates = { ...req.body };
      // Prevent non-admins from modifying coordinator assignments
      if (req.user && req.user.role !== 'admin') {
        delete updates.coordinatorIds;
      }
      
      const updatedEvent = await eventService.updateEvent(req.params.id as string, updates);
      if (!updatedEvent) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
      res.json({ success: true, data: updatedEvent });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update event' });
    }
  }

  async deleteEvent(req: Request, res: Response) {
    try {
      const success = await eventService.deleteEvent(req.params.id as string);
      if (!success) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
      res.json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete event' });
    }
  }
}
