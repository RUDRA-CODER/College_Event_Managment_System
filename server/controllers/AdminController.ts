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
  async login(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
      }

      const result = await adminService.login({ email, password });
      
      return res.status(200).json({ 
        success: true, 
        message: 'Login successful', 
        data: {
          token: result.token,
          admin: result.user
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
      const { name, email, password, department, phone, coordinatorType, enrollmentNumber, semester, employeeId, designation, gender, dateOfBirth, address, city, state, pincode } = req.body;
      if (!name || !email || !password || !coordinatorType) {
        return res.status(400).json({ success: false, message: 'Name, email, password, and coordinator type are required' });
      }

      const newCoordinator = await coordinatorService.createCoordinator({ 
        name, 
        email, 
        password,
        department, 
        phone,
        coordinatorType,
        enrollmentNumber,
        semester,
        employeeId, 
        designation,
        gender,
        dateOfBirth,
        address,
        city,
        state,
        pincode
      });
      if (!newCoordinator) {
        return res.status(409).json({ success: false, message: 'Coordinator with this email already exists' });
      }

      res.status(201).json({ success: true, message: 'Coordinator created successfully', data: newCoordinator });
    } catch (error: any) {
      console.error('Coordinator creation error:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to create coordinator' });
    }
  }
  async deleteCoordinator(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
      
      const id = req.params.id as string;
      const success = await coordinatorService.deleteCoordinator(id);
      
      if (!success) {
        return res.status(404).json({ success: false, message: 'Coordinator not found or could not be deleted' });
      }

      res.status(200).json({ success: true, message: 'Coordinator removed successfully' });
    } catch (error: any) {
      console.error('Coordinator deletion error:', error);
      if (error.name === 'CastError' || error.message === 'Invalid coordinator ID') {
        return res.status(400).json({ success: false, message: 'Invalid coordinator ID' });
      }
      res.status(500).json({ success: false, message: error.message || 'Failed to delete coordinator' });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
      const admin = await adminService.getAdminProfile(req.user.id);
      if (!admin) {
        return res.status(404).json({ success: false, message: 'Admin not found' });
      }
      res.json({ success: true, data: admin });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch admin profile' });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
      
      const { name, email } = req.body;
      const dataToUpdate = { name, email };
      
      // Update in repository directly or via service
      // We will create updateAdminProfile in adminService or use repo directly
      // Better to use service. Since AdminService doesn't have updateProfile yet, we'll implement it there too.
      // But for now let's just write this and then implement it in service
      const updated = await adminService.updateAdminProfile(req.user.id, dataToUpdate);
      
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Admin not found' });
      }

      res.json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update admin profile' });
    }
  }
}
