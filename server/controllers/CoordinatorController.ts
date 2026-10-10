import { Request, Response } from 'express';
import { CoordinatorService } from '../services/CoordinatorService';
import { EventService } from '../services/EventService';
import { RegistrationService } from '../services/RegistrationService';

const coordinatorService = new CoordinatorService();
const eventService = new EventService();
const registrationService = new RegistrationService();

export class CoordinatorController {
  async getProfile(req: Request, res: Response): Promise<any> {
    try {
      const id = req.user?.id;
      if (!id) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const profile = await coordinatorService.getCoordinatorProfile(id);
      
      if (!profile) {
        return res.status(404).json({ success: false, message: 'Coordinator not found' });
      }
      return res.status(200).json({ success: true, data: profile });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch profile' });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<any> {
    try {
      const id = req.user?.id;
      if (!id) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const dataToUpdate = { ...req.body };
      delete dataToUpdate.email; // Do not allow changing email this way
      delete dataToUpdate.password;
      delete dataToUpdate.role;
      delete dataToUpdate.id;
      delete dataToUpdate._id;

      const profile = await coordinatorService.updateCoordinatorProfile(id, dataToUpdate);
      
      if (!profile) {
        return res.status(404).json({ success: false, message: 'Coordinator not found' });
      }
      return res.status(200).json({ success: true, data: profile });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
  }

  async login(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
      }

      const result = await coordinatorService.login({ email, password });
      
      return res.status(200).json({ 
        success: true, 
        message: 'Login successful', 
        data: {
          token: result.token,
          coordinator: result.user
        } 
      });
    } catch (error: any) {
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Login failed' });
    }
  }
  
  async getDashboardStats(req: Request, res: Response) {
    try {
        if (!req.user) {
          return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const events = await eventService.getEventsByCoordinatorId(req.user.id);
        const eventIds = events.map(e => e.id);
        const registrations = await registrationService.getRegistrationsByEventIds(eventIds);

        const totalEvents = events.length;
        const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
        const activeEvents = events.filter(e => e.status === 'ongoing').length;
        const totalRegistrations = registrations.length;

        res.json({
            success: true,
            data: {
                totalEvents,
                upcomingEvents,
                totalRegistrations,
                activeEvents
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
    }
  }

  async getAssignedEvents(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const events = await eventService.getEventsByCoordinatorId(req.user.id);
      res.json({ success: true, data: events });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch assigned events' });
    }
  }

  async getAssignedRegistrations(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const events = await eventService.getEventsByCoordinatorId(req.user.id);
      const eventIds = events.map(e => e.id);
      const registrations = await registrationService.getRegistrationsByEventIds(eventIds);
      res.json({ success: true, data: registrations });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch assigned registrations' });
    }
  }
}

