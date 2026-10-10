import { Request, Response } from 'express';
import { StudentService } from '../services/StudentService';

export class StudentController {
  private studentService = new StudentService();

  public async signup(req: Request, res: Response): Promise<any> {
    try {
      const { 
        name, enrollmentNumber, email, password, department, semester, phone,
        gender, dateOfBirth, address, city, state, pincode 
      } = req.body;
      
      if (!name || !enrollmentNumber || !email || !password) {
        return res.status(400).json({ success: false, message: 'Required fields are missing' });
      }

      if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      }

      const result = await this.studentService.createStudent({ 
        name, enrollmentNumber, email, password, department, semester, phone,
        gender, dateOfBirth, address, city, state, pincode 
      });
      return res.status(201).json({ success: true, ...result });
    } catch (error: any) {
      if (error.message.includes('already registered')) {
        return res.status(409).json({ success: false, message: error.message });
      }
      if (error.message === 'Unable to send verification email. Please try again later.') {
        return res.status(503).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async resendOTP(req: Request, res: Response): Promise<any> {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
      }

      const result = await this.studentService.resendOTP(email);
      return res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Student not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      if (error.message === 'Email is already verified') {
        return res.status(400).json({ success: false, message: error.message });
      }
      if (error.message === 'Unable to send verification email. Please try again later.') {
        return res.status(503).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async verifyEmail(req: Request, res: Response): Promise<any> {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required' });
      }

      const result = await this.studentService.verifyEmail(email, otp);
      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      if (error.message === 'Student not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      if (['Invalid OTP', 'OTP expired or invalid', 'Email is already verified'].includes(error.message)) {
        return res.status(400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async login(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
      }

      const result = await this.studentService.loginStudent({ email, password });
      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      if (error.message === 'Invalid credentials' || error.message === 'Please verify your email before logging in') {
        return res.status(401).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getProfile(req: Request, res: Response): Promise<any> {
    try {
      if (!req.user || req.user.role !== 'student') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      const student = await this.studentService.getStudentById(req.user.id);
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: student._id,
          name: student.name,
          email: student.email,
          enrollmentNumber: student.enrollmentNumber,
          department: student.department,
          semester: student.semester,
          phone: student.phone,
          address: student.address,
          city: student.city,
          state: student.state,
          pincode: student.pincode,
          dateOfBirth: student.dateOfBirth,
          gender: student.gender,
          profileImage: student.profileImage
        }
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async updateProfile(req: Request, res: Response): Promise<any> {
    try {
      if (!req.user || req.user.role !== 'student') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      const { name, email, department, semester, phone, address, city, state, pincode, dateOfBirth, gender, profileImage } = req.body;
      const dataToUpdate = { name, email, department, semester, phone, address, city, state, pincode, dateOfBirth, gender, profileImage };

      const updatedStudent = await this.studentService.updateStudentProfile(req.user.id, dataToUpdate);
      
      if (!updatedStudent) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: updatedStudent._id,
          name: updatedStudent.name,
          email: updatedStudent.email,
          enrollmentNumber: updatedStudent.enrollmentNumber,
          department: updatedStudent.department,
          semester: updatedStudent.semester,
          phone: updatedStudent.phone,
          address: updatedStudent.address,
          city: updatedStudent.city,
          state: updatedStudent.state,
          pincode: updatedStudent.pincode,
          dateOfBirth: updatedStudent.dateOfBirth,
          gender: updatedStudent.gender,
          profileImage: updatedStudent.profileImage
        }
      });
    } catch (error: any) {
      if (error.message.includes('Email is already in use')) {
        return res.status(409).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async changePassword(req: Request, res: Response): Promise<any> {
    try {
      if (!req.user || req.user.role !== 'student') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
      }
      await this.studentService.changePassword(req.user.id, currentPassword, newPassword);
      return res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error: any) {
      if (error.message === 'Student not found' || error.message === 'Current password incorrect') {
        return res.status(400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
