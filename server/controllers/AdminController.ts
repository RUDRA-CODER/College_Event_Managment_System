import { Request, Response } from 'express';
import { AdminService } from '../services/AdminService';
import { EventService } from '../services/EventService';
import { RegistrationService } from '../services/RegistrationService';
import { CoordinatorService } from '../services/CoordinatorService';

const adminService = new AdminService();
const eventService = new EventService();
const registrationService = new RegistrationService();
const coordinatorService = new CoordinatorService();
import { CoordinatorRepository } from '../repositories/CoordinatorRepository';
const coordinatorRepo = new CoordinatorRepository(); // Need this to fetch all coordinators for admin

export class AdminController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const admin = await adminService.authenticate(email);
      
      if (!admin) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      
      res.json({ 
        success: true, 
        message: 'Login successful', 
        data: {
          token: `mock-jwt-token-${admin.id}`,
          admin
        } 
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Login failed' });
    }
  }

  async getDashboardStats(req: Request, res: Response) {
    try {
        const events = await eventService.getAllEvents();
        const registrations = await registrationService.getAllRegistrations();
        const coordinators = await coordinatorRepo.findAll();

        const totalEvents = events.length;
        const activeEvents = events.filter(e => e.status === 'ongoing' || e.status === 'upcoming').length;
        const totalRegistrations = registrations.length;
        const totalCoordinators = coordinators.length;

        res.json({
            success: true,
            data: {
                totalEvents,
                activeEvents,
                totalRegistrations,
                totalCoordinators,
                recentEvents: events.slice(0, 5),
                recentRegistrations: registrations.slice(0, 5)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
    }
  }

  async getCoordinators(req: Request, res: Response) {
    try {
      const coordinators = await coordinatorRepo.findAll();
      const events = await eventService.getAllEvents();
      
      // Calculate how many events each coordinator is assigned to
      const coordinatorsWithStats = coordinators.map(c => {
        const assignedEvents = events.filter(e => e.coordinatorIds && e.coordinatorIds.includes(c.id));
        return {
          ...c,
          assignedEventsCount: assignedEvents.length
        };
      });

      res.json({ success: true, data: coordinatorsWithStats });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch coordinators' });
    }
  }

  async getCoordinatorById(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      if (!idParam || typeof idParam !== 'string') {
        return res.status(400).json({ success: false, message: 'Invalid ID parameter' });
      }
      const id: string = idParam;
      const coordinator = await coordinatorService.getCoordinatorProfile(id);
      if (!coordinator) {
        return res.status(404).json({ success: false, message: 'Coordinator not found' });
      }
      
      const events = await eventService.getAllEvents();
      const assignedEvents = events.filter(e => e.coordinatorIds && e.coordinatorIds.includes(coordinator.id));
      
      res.json({ 
        success: true, 
        data: {
          ...coordinator,
          assignedEvents
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch coordinator' });
    }
  }

  async getAllRegistrations(req: Request, res: Response) {
    try {
      const registrations = await registrationService.getAllRegistrations();
      res.json({ success: true, data: registrations });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch registrations' });
    }
  }

  async createCoordinator(req: Request, res: Response) {
    try {
      const { name, email } = req.body;
      if (!name || !email) {
        return res.status(400).json({ success: false, message: 'Name and email are required' });
      }

      const newCoordinator = await coordinatorService.createCoordinator({ name, email });
      if (!newCoordinator) {
        return res.status(409).json({ success: false, message: 'Coordinator with this email already exists' });
      }

      res.status(201).json({ success: true, message: 'Coordinator created successfully', data: newCoordinator });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create coordinator' });
    }
  }
}
