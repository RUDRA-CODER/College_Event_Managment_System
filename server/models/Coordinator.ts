import mongoose, { Schema, Document } from 'mongoose';

export interface ICoordinator extends Document {
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  profileImage?: string;
  department: string;
  role: string;
  coordinatorType: 'student' | 'faculty';
  passwordHash?: string;
  resetPasswordTokenHash?: string;
  resetPasswordExpires?: Date;
  emailVerified?: boolean;
  
  // Student Coordinator specific
  enrollmentNumber?: string;
  semester?: string;
  
  // Faculty Coordinator specific
  employeeId?: string;
  designation?: string;
  facultyType?: string;
  joiningDate?: string;
  experience?: string;
  alternatePhone?: string;
}

const CoordinatorSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    gender: { type: String },
    dateOfBirth: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    profileImage: { type: String, default: '' },
    department: { type: String, default: 'Unassigned' },
    role: { type: String, default: 'coordinator' },
    coordinatorType: { type: String, enum: ['student', 'faculty'], required: true },
    passwordHash: { type: String, select: false },
    resetPasswordTokenHash: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    emailVerified: { type: Boolean, default: false },
    
    // Student Coordinator specific
    enrollmentNumber: { type: String },
    semester: { type: String },
    
    // Faculty Coordinator specific
    employeeId: { type: String },
    designation: { type: String },
    facultyType: { type: String },
    joiningDate: { type: String },
    experience: { type: String },
    alternatePhone: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.models.Coordinator || mongoose.model<ICoordinator>('Coordinator', CoordinatorSchema);
