import { Request, Response } from 'express';
import { RegistrationService } from '../services/RegistrationService';
import { EventService } from '../services/EventService';
import { StudentService } from '../services/StudentService';

const registrationService = new RegistrationService();
const eventService = new EventService();
const studentService = new StudentService();

export class RegistrationController {
  async getAllRegistrations(req: Request, res: Response) {
    try {
      const registrations = await registrationService.getAllRegistrations();
      res.json({ success: true, data: registrations });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch registrations' });
    }
  }

  async getMyRegistrations(req: Request, res: Response): Promise<any> {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const registrations = await registrationService.getRegistrationsByStudentId(req.user.id);
      return res.json({ success: true, data: registrations });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch registrations' });
    }
  }

  async getRegistrationById(req: Request, res: Response): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const registration = await registrationService.getRegistrationById(req.params.id as string);
      if (!registration) {
        return res.status(404).json({ success: false, message: 'Registration not found' });
      }

      if (req.user.role === 'student') {
        if (registration.studentId.toString() !== req.user.id) {
          return res.status(403).json({ success: false, message: 'Forbidden' });
        }
      } else if (req.user.role === 'coordinator') {
        const eventService = new EventService();
        const event = await eventService.getEventById(registration.eventId.toString());
        if (!event || !event.coordinatorIds || !event.coordinatorIds.includes(req.user.id)) {
          return res.status(403).json({ success: false, message: 'Forbidden' });
        }
      } else if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      return res.json({ success: true, data: registration });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch registration' });
    }
  }

  async getRegistrationsByEventId(req: Request, res: Response) {
    try {
      const registrations = await registrationService.getRegistrationsByEvent(req.params.eventId as string);
      res.json({ success: true, data: registrations });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch registrations for event' });
    }
  }

  async createRegistration(req: Request, res: Response): Promise<any> {
    try {
      if (!req.user || req.user.role !== 'student') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      // Enforce authenticated student ID
      const studentId = req.user.id;
      const { eventId, customData } = req.body;

      if (!eventId) {
        return res.status(400).json({ success: false, message: 'eventId is required' });
      }

      // Get student profile
      const student = await studentService.getStudentById(studentId);
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }

      // Get event
      const event = await eventService.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }

      if (event.status === 'cancelled' || event.status === 'completed') {
         return res.status(400).json({ success: false, message: 'Event is not accepting registrations' });
      }

      // Check registration deadline
      if (event.registrationDeadline) {
         const deadline = new Date(event.registrationDeadline);
         const now = new Date();
         if (now > deadline) {
             return res.status(400).json({ success: false, message: 'Registration deadline has passed' });
         }
      }

      // Validate custom fields
      if (event.customFields && event.customFields.length > 0) {
        const submittedData = customData || {};
        for (const field of event.customFields) {
          if (field.required && !submittedData[field.name]) {
            return res.status(400).json({ success: false, message: `Field ${field.name} is required` });
          }
        }
      }

      // Check duplicate registration
      const existingRegs = await registrationService.getRegistrationsByEvent(eventId);
      const hasRegistered = existingRegs.some(r => r.studentId.toString() === studentId.toString());
      if (hasRegistered) {
         return res.status(409).json({ success: false, message: 'Student is already registered for this event' });
      }

      // Check capacity
      if (event.maxParticipants && existingRegs.length >= event.maxParticipants) {
         return res.status(400).json({ success: false, message: 'Event capacity reached' });
      }

      const data = {
        eventId,
        studentId,
        studentName: student.name,
        enrollmentNumber: student.enrollmentNumber,
        email: student.email,
        customData: customData || {}
      };

      const newReg = await registrationService.createRegistration(data as any);
      
      // Update registration count
      await eventService.updateEvent(eventId, { registrationCount: existingRegs.length + 1 });

      return res.status(201).json({ success: true, data: newReg });
    } catch (error) {
      console.error('Registration Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to create registration' });
    }
  }

  async updateRegistration(req: Request, res: Response): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const existingReg = await registrationService.getRegistrationById(req.params.id as string);
      if (!existingReg) {
        return res.status(404).json({ success: false, message: 'Registration not found' });
      }

      if (req.user.role === 'student') {
        if (existingReg.studentId.toString() !== req.user.id) {
          return res.status(403).json({ success: false, message: 'Forbidden' });
        }
      } else if (req.user.role === 'coordinator') {
        const eventService = new EventService();
        const event = await eventService.getEventById(existingReg.eventId.toString());
        if (!event || !event.coordinatorIds || !event.coordinatorIds.includes(req.user.id)) {
          return res.status(403).json({ success: false, message: 'Forbidden' });
        }
      } else if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      const updateData = { ...req.body };
      // Prevent changing the studentId
      updateData.studentId = existingReg.studentId;

      const updatedReg = await registrationService.updateRegistration(req.params.id as string, updateData);
      return res.json({ success: true, data: updatedReg });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to update registration' });
    }
  }

  async deleteRegistration(req: Request, res: Response): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const existingReg = await registrationService.getRegistrationById(req.params.id as string);
      if (!existingReg) {
        return res.status(404).json({ success: false, message: 'Registration not found' });
      }

      if (req.user.role === 'student') {
        if (existingReg.studentId.toString() !== req.user.id) {
          return res.status(403).json({ success: false, message: 'Forbidden' });
        }
      } else if (req.user.role === 'coordinator') {
        const eventService = new EventService();
        const event = await eventService.getEventById(existingReg.eventId.toString());
        if (!event || !event.coordinatorIds || !event.coordinatorIds.includes(req.user.id)) {
          return res.status(403).json({ success: false, message: 'Forbidden' });
        }
      } else if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      await registrationService.deleteRegistration(req.params.id as string);
      
      // Update registration count
      const remainingRegs = await registrationService.getRegistrationsByEvent(existingReg.eventId.toString());
      const eventServiceRef = new EventService();
      await eventServiceRef.updateEvent(existingReg.eventId.toString(), { registrationCount: remainingRegs.length });

      return res.json({ success: true, message: 'Registration deleted successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to delete registration' });
    }
  }
}
