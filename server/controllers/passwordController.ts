import { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import Student from '../models/Student';
import Coordinator from '../models/Coordinator';
import Admin from '../models/Admin';
import { OTPService } from '../services/otpService';
import { sendEmail } from '../services/emailService';
import { getPasswordResetEmail } from '../templates/passwordReset';

export class PasswordController {
  
  async forgotPassword(req: Request, res: Response) {
    try {
      const { email, role } = req.body;
      if (!email || !role) {
        return res.status(400).json({ success: false, message: 'Email and role are required' });
      }

      let userModel: any;
      if (role === 'student') userModel = Student;
      else if (role === 'coordinator') userModel = Coordinator;
      else if (role === 'admin') userModel = Admin;
      else return res.status(400).json({ success: false, message: 'Invalid role' });

      const user = await userModel.findOne({ email });
      if (!user) {
        // DO NOT reveal whether an email exists. Just return a success message.
        return res.json({ success: true, message: 'If the email is registered, a password reset link has been sent.' });
      }

      // Generate OTP instead of token
      const otp = OTPService.generateOTP();
      const otpHash = OTPService.hashOTP(otp);
      
      user.resetPasswordTokenHash = otpHash;
      user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await user.save();

      // Send email
      const emailContent = getPasswordResetEmail(user.name || 'User', otp);
      const emailResult = await sendEmail({
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      });

      if (!emailResult.success) {
        user.resetPasswordTokenHash = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        return res.status(503).json({ success: false, message: 'Unable to send verification email. Please try again later.' });
      }

      return res.json({ success: true, message: 'If the email is registered, a password reset OTP has been sent.' });

    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ success: false, message: 'An error occurred during password reset request.' });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, email, role, newPassword } = req.body;

      if (!token || !email || !role || !newPassword) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      let userModel: any;
      if (role === 'student') userModel = Student;
      else if (role === 'coordinator') userModel = Coordinator;
      else if (role === 'admin') userModel = Admin;
      else return res.status(400).json({ success: false, message: 'Invalid role' });

      // Find user and explicitly select hidden fields
      const user = await userModel.findOne({ 
        email, 
        resetPasswordExpires: { $gt: Date.now() } 
      }).select('+resetPasswordTokenHash');

      if (!user || !user.resetPasswordTokenHash) {
        return res.status(400).json({ success: false, message: 'Invalid or expired password reset token' });
      }

      // Verify the OTP matches the hash
      const isMatch = OTPService.verifyOTP(token, user.resetPasswordTokenHash);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      }

      // Hash the new password
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      user.passwordHash = newPasswordHash;
      user.resetPasswordTokenHash = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      return res.json({ success: true, message: 'Password has been successfully reset' });

    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ success: false, message: 'An error occurred while resetting the password.' });
    }
  }
}
