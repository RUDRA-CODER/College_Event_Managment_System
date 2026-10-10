import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  enrollmentNumber: string;
  email: string;
  passwordHash?: string;
  department?: string;
  semester?: string;
  phone?: string;
  resetPasswordTokenHash?: string;
  resetPasswordExpires?: Date;
  emailVerified?: boolean;
  otpHash?: string;
  otpExpires?: Date;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  dateOfBirth?: string;
  gender?: string;
  profileImage?: string;
}

const StudentSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    enrollmentNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, select: false },
    department: { type: String },
    semester: { type: String },
    phone: { type: String },
    resetPasswordTokenHash: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    emailVerified: { type: Boolean, default: false },
    otpHash: { type: String, select: false },
    otpExpires: { type: Date, select: false },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    dateOfBirth: { type: String },
    gender: { type: String },
    profileImage: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
