import Student, { IStudent } from '../models/Student';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { OTPService } from './otpService';
import { sendEmail } from './emailService';
import { getStudentVerificationEmail } from '../templates/studentVerification';

export class StudentService {
  public async getStudentById(id: string): Promise<IStudent | null> {
    return Student.findById(id);
  }

  public async getStudentByEmail(email: string): Promise<IStudent | null> {
    return Student.findOne({ email }).select('+passwordHash');
  }

  public async getStudentByEnrollment(enrollmentNumber: string): Promise<IStudent | null> {
    return Student.findOne({ enrollmentNumber });
  }

  public async createStudent(data: any): Promise<{ requiresVerification: boolean; email: string }> {
    const { 
      name, enrollmentNumber, email, password, department, semester, phone,
      gender, dateOfBirth, address, city, state, pincode 
    } = data;

    const existingEmail = await Student.findOne({ email });
    if (existingEmail) {
      if (existingEmail.emailVerified) {
        throw new Error('Email is already registered');
      }
      // If unverified, we could resend OTP, but let's delete or update the old one
      await Student.deleteOne({ email });
    }

    const existingEnrollment = await Student.findOne({ enrollmentNumber });
    if (existingEnrollment) {
      if (existingEnrollment.emailVerified) {
        throw new Error('Enrollment number is already registered');
      }
      await Student.deleteOne({ enrollmentNumber });
    }

    const passwordHash = await hashPassword(password);
    const otp = OTPService.generateOTP();
    const otpHash = OTPService.hashOTP(otp);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    const student = new Student({
      name,
      enrollmentNumber,
      email,
      passwordHash,
      department,
      semester,
      phone,
      gender,
      dateOfBirth,
      address,
      city,
      state,
      pincode,
      emailVerified: false,
      otpHash,
      otpExpires
    });

    await student.save();

    // Send email
    const emailContent = getStudentVerificationEmail(name, otp);
    const emailResult = await sendEmail({
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    });

    if (!emailResult.success) {
      await Student.deleteOne({ _id: student._id });
      throw new Error('Unable to send verification email. Please try again later.');
    }

    return {
      requiresVerification: true,
      email: student.email
    };
  }

  public async resendOTP(email: string): Promise<{ success: boolean; message?: string }> {
    const student = await Student.findOne({ email });
    if (!student) {
      throw new Error('Student not found');
    }
    if (student.emailVerified) {
      throw new Error('Email is already verified');
    }

    const otp = OTPService.generateOTP();
    const otpHash = OTPService.hashOTP(otp);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    student.otpHash = otpHash;
    student.otpExpires = otpExpires;
    await student.save();

    const emailContent = getStudentVerificationEmail(student.name, otp);
    const emailResult = await sendEmail({
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    });

    if (!emailResult.success) {
      student.otpHash = undefined;
      student.otpExpires = undefined;
      await student.save();
      throw new Error('Unable to send verification email. Please try again later.');
    }

    return { success: true, message: 'OTP resent successfully' };
  }

  public async verifyEmail(email: string, otp: string): Promise<{ token: string; user: any }> {
    const student = await Student.findOne({ email }).select('+otpHash +otpExpires +passwordHash');
    if (!student) {
      throw new Error('Student not found');
    }

    if (student.emailVerified) {
      throw new Error('Email is already verified');
    }

    if (!student.otpHash || !student.otpExpires || student.otpExpires < new Date()) {
      throw new Error('OTP expired or invalid');
    }

    const isValid = OTPService.verifyOTP(otp, student.otpHash);
    if (!isValid) {
      throw new Error('Invalid OTP');
    }

    student.emailVerified = true;
    student.otpHash = undefined;
    student.otpExpires = undefined;
    await student.save();

    const token = generateToken(student._id.toString(), 'student');
    
    return {
      token,
      user: {
        id: student._id,
        name: student.name,
        enrollmentNumber: student.enrollmentNumber,
        email: student.email,
        role: 'student'
      }
    };
  }

  public async loginStudent(data: any): Promise<{ token: string; user: any }> {
    const { email, password } = data;

    const student = await this.getStudentByEmail(email);
    if (!student || !student.passwordHash) {
      throw new Error('Invalid credentials');
    }

    if (!student.emailVerified) {
      throw new Error('Please verify your email before logging in');
    }

    const isValid = await comparePassword(password, student.passwordHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(student._id.toString(), 'student');

    return {
      token,
      user: {
        id: student._id,
        name: student.name,
        enrollmentNumber: student.enrollmentNumber,
        email: student.email,
        role: 'student'
      }
    };
  }

  public async updateStudentProfile(id: string, data: any): Promise<IStudent | null> {
    const student = await Student.findById(id);
    if (!student) {
      throw new Error('Student not found');
    }

    if (data.email && data.email !== student.email) {
      const existingEmail = await Student.findOne({ email: data.email });
      if (existingEmail) {
        throw new Error('Email is already in use by another student');
      }
      student.email = data.email;
    }

    if (data.name) student.name = data.name;
    if (data.department) student.department = data.department;
    if (data.semester) student.semester = data.semester;
    if (data.phone !== undefined) student.phone = data.phone;
    if (data.address !== undefined) student.address = data.address;
    if (data.city !== undefined) student.city = data.city;
    if (data.state !== undefined) student.state = data.state;
    if (data.pincode !== undefined) student.pincode = data.pincode;
    if (data.dateOfBirth !== undefined) student.dateOfBirth = data.dateOfBirth;
    if (data.gender !== undefined) student.gender = data.gender;
    if (data.profileImage !== undefined) student.profileImage = data.profileImage;
    
    // Note: enrollmentNumber, passwordHash, and role are explicitly ignored

    await student.save();
    return student;
  }

  public async changePassword(id: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const student = await Student.findById(id).select('+passwordHash');
    if (!student || !student.passwordHash) {
      throw new Error('Student not found');
    }
    const isValid = await comparePassword(currentPassword, student.passwordHash);
    if (!isValid) {
      throw new Error('Current password incorrect');
    }
    student.passwordHash = await hashPassword(newPassword);
    await student.save();
    return true;
  }
}
