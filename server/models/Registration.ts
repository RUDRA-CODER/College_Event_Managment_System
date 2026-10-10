import mongoose, { Schema, Document } from 'mongoose';

export interface IRegistration extends Document {
  eventId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  enrollmentNumber: string;
  email: string;
  registrationDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  attendance: boolean;
  customData?: Map<string, string>;
}

const RegistrationSchema: Schema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    studentName: { type: String, required: true },
    enrollmentNumber: { type: String, required: true },
    email: { type: String, required: true },
    registrationDate: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    },
    attendance: { type: Boolean, default: false },
    customData: {
      type: Map,
      of: String
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.models.Registration || mongoose.model<IRegistration>('Registration', RegistrationSchema);
