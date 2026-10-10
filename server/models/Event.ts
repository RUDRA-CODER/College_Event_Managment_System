import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomField {
  name: string;
  type: 'text' | 'number' | 'boolean' | 'dropdown' | 'textarea';
  options?: string[];
  required: boolean;
}

export interface IEvent extends Document {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  image: string;
  registrationDeadline: string;
  maxParticipants: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  coordinatorIds: mongoose.Types.ObjectId[];
  registrationCount: number;
  customFields?: ICustomField[];
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    image: { type: String, default: '' },
    registrationDeadline: { type: String, required: true },
    maxParticipants: { type: Number, required: true },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming'
    },
    coordinatorIds: [{ type: Schema.Types.ObjectId, ref: 'Coordinator' }],
    registrationCount: { type: Number, default: 0 },
    customFields: [{
      name: { type: String, required: true },
      type: { type: String, enum: ['text', 'number', 'boolean', 'dropdown', 'textarea'], required: true },
      options: [{ type: String }],
      required: { type: Boolean, default: false }
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
