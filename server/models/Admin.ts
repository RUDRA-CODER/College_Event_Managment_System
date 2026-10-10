import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  name: string;
  email: string;
  role: string;
  passwordHash?: string;
  resetPasswordTokenHash?: string;
  resetPasswordExpires?: Date;
}

const AdminSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'admin' },
    passwordHash: { type: String, select: false },
    resetPasswordTokenHash: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
