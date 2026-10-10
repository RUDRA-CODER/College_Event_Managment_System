import { Request, Response } from 'express';
import { EventService } from '../services/EventService';
import { RegistrationService } from '../services/RegistrationService';
import { sendEmail } from '../services/emailService';

const eventService = new EventService();
const registrationService = new RegistrationService();

export class EventController {
  async getAllEvents(req: Request, res: Response) {
    try {
      const events = await eventService.getAllEvents();
      res.json({ success: true, data: events });
    } catch (error: any) {
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
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to fetch event' });
    }
  }

  async createEvent(req: Request, res: Response) {
    try {
      const newEvent = await eventService.createEvent(req.body);
      res.status(201).json({ success: true, data: newEvent });
    } catch (error: any) {
      if (error.message === 'invalid coordinator ObjectIds') {
        return res.status(400).json({ success: false, message: error.message });
      }
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
    } catch (error: any) {
      if (error.message === 'invalid coordinator ObjectIds') {
        return res.status(400).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: error.message || 'Failed to update event' });
    }
  }

  async deleteEvent(req: Request, res: Response) {
    try {
      const success = await eventService.deleteEvent(req.params.id as string);
      if (!success) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
      res.json({ success: true, message: 'Event deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to delete event' });
    }
  }

  async notifyRegisteredStudents(req: Request, res: Response) {
    try {
      const eventId = req.params.id as string;
      const { subject, message } = req.body;

      if (!subject || !message) {
        return res.status(400).json({ success: false, message: 'Subject and message are required' });
      }

      const event = await eventService.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }

      const registrations = await registrationService.getRegistrationsByEvent(eventId);
      if (registrations.length === 0) {
        return res.status(400).json({ success: false, message: 'No registered students found for this event' });
      }

      // Extract unique, valid emails
      const emailSet = new Set<string>();
      registrations.forEach(r => {
        if (r.email && r.email.includes('@')) {
          emailSet.add(r.email);
        }
      });
      
      const recipientEmails = Array.from(emailSet);
      if (recipientEmails.length === 0) {
        return res.status(400).json({ success: false, message: 'No valid email addresses found among registered students' });
      }

      const emailResult = await sendEmail({
        to: recipientEmails,
        subject: subject,
        html: `<p>${message.replace(/\n/g, '<br/>')}</p>`
      });

      if (!emailResult.success) {
        return res.status(500).json({ success: false, message: 'Failed to send emails' });
      }

      res.json({ success: true, message: `Notifications sent to ${recipientEmails.length} students.` });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'An error occurred while notifying students' });
    }
  }
}
