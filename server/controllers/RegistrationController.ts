import { Request, Response } from 'express';
import { RegistrationService } from '../services/RegistrationService';

const registrationService = new RegistrationService();

export class RegistrationController {
  async getAllRegistrations(req: Request, res: Response) {
    try {
      const registrations = await registrationService.getAllRegistrations();
      res.json({ success: true, data: registrations });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch registrations' });
    }
  }

  async getRegistrationById(req: Request, res: Response) {
    try {
      const registration = await registrationService.getRegistrationById(req.params.id as string);
      if (!registration) {
        return res.status(404).json({ success: false, message: 'Registration not found' });
      }
      res.json({ success: true, data: registration });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch registration' });
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

  async createRegistration(req: Request, res: Response) {
    try {
      const newReg = await registrationService.createRegistration(req.body);
      res.status(201).json({ success: true, data: newReg });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create registration' });
    }
  }

  async updateRegistration(req: Request, res: Response) {
    try {
      const updatedReg = await registrationService.updateRegistration(req.params.id as string, req.body);
      if (!updatedReg) {
        return res.status(404).json({ success: false, message: 'Registration not found' });
      }
      res.json({ success: true, data: updatedReg });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update registration' });
    }
  }

  async deleteRegistration(req: Request, res: Response) {
    try {
      const success = await registrationService.deleteRegistration(req.params.id as string);
      if (!success) {
        return res.status(404).json({ success: false, message: 'Registration not found' });
      }
      res.json({ success: true, message: 'Registration deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete registration' });
    }
  }
}
