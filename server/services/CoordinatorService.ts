import { CoordinatorRepository } from '../repositories/CoordinatorRepository';
import { EventRepository } from '../repositories/EventRepository';
import { Coordinator } from '../data/mockData';
import CoordinatorModel from '../models/Coordinator';
import { comparePassword, generateToken, hashPassword } from '../utils/auth';
import crypto from 'crypto';
import { sendEmail } from './emailService';

export class CoordinatorService {
  private coordinatorRepo = new CoordinatorRepository();
  private eventRepo = new EventRepository();

  async deleteCoordinator(id: string): Promise<boolean> {
    const coordinator = await this.coordinatorRepo.findById(id);
    if (!coordinator) {
      return false;
    }
    
    // Remove coordinator from all assigned events
    await this.eventRepo.removeCoordinatorFromEvents(id);
    
    // Delete the coordinator
    return await this.coordinatorRepo.delete(id);
  }

  async getCoordinatorProfile(id: string): Promise<Coordinator | undefined> {
    return this.coordinatorRepo.findById(id);
  }

  async updateCoordinatorProfile(id: string, updates: Partial<Coordinator>): Promise<Coordinator | undefined> {
    return this.coordinatorRepo.update(id, updates);
  }

  async login(data: any): Promise<{ token: string; user: any }> {
    const { email, password } = data;

    const coordinator = await CoordinatorModel.findOne({ email }).select('+passwordHash');
    if (!coordinator || !coordinator.passwordHash) {
      throw new Error('Invalid credentials');
    }

    const isValid = await comparePassword(password, coordinator.passwordHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(coordinator._id.toString(), 'coordinator');

    return {
      token,
      user: {
        id: coordinator._id,
        name: coordinator.name,
        email: coordinator.email,
        department: coordinator.department,
        role: coordinator.role,
        profileImage: coordinator.profileImage
      }
    };
  }

  async createCoordinator(data: { name: string, email: string, password?: string, department?: string, phone?: string, coordinatorType: 'student' | 'faculty', enrollmentNumber?: string, semester?: string, employeeId?: string, designation?: string, gender?: string, dateOfBirth?: string, address?: string, city?: string, state?: string, pincode?: string }): Promise<Coordinator | null> {
    const existing = await this.coordinatorRepo.findByEmail(data.email);
    if (existing) {
      return null;
    }
    
    // Generate a temporary password if one wasn't explicitly provided
    const tempPassword = data.password || crypto.randomBytes(8).toString('hex');
    const passwordHash = await hashPassword(tempPassword);
    
    const newCoordinator = {
      name: data.name,
      email: data.email,
      department: data.department || 'Unassigned',
      role: 'coordinator',
      coordinatorType: data.coordinatorType,
      passwordHash,
      phone: data.phone,
      enrollmentNumber: data.enrollmentNumber,
      semester: data.semester,
      employeeId: data.employeeId,
      designation: data.designation,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode
    };

    // Remove empty string fields to prevent MongoDB duplicate key errors on sparse indexes (like employeeId: "")
    Object.keys(newCoordinator).forEach(key => {
      if ((newCoordinator as any)[key] === '') {
        delete (newCoordinator as any)[key];
      }
    });

    const createdCoordinator = await this.coordinatorRepo.create(newCoordinator);

    // Send invitation email
    try {
      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a;">Welcome to CKPCET Events Portal</h2>
          <p>Hi ${data.name},</p>
          <p>An admin has created a Coordinator account for you on the CKPCET Events Portal.</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Email:</strong> ${data.email}</p>
            <p style="margin: 10px 0 0 0;"><strong>Temporary Password:</strong> ${tempPassword}</p>
          </div>
          <p>Please log in using these credentials and update your password from your profile settings as soon as possible.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" style="display: inline-block; background-color: #0284c7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin-top: 10px;">Login Now</a>
        </div>
      `;
      await sendEmail({
        to: data.email,
        subject: 'Your Coordinator Account - CKPCET Events',
        html: emailHtml
      });
    } catch (error) {
      console.error('Failed to send coordinator invitation email:', error);
    }

    return createdCoordinator;
  }
}
