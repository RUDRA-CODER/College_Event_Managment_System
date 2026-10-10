import mongoose from 'mongoose';
import EventModel from '../models/Event';
import { Event } from '../data/mockData';

export class EventRepository {
  private encodeCoordinatorId(id: string): mongoose.Types.ObjectId {
    if (mongoose.Types.ObjectId.isValid(id) && String(id).length === 24) {
      return new mongoose.Types.ObjectId(id);
    }
    const hex = Buffer.from(id, 'utf8').toString('hex');
    if (hex.length > 24) {
      throw new Error('invalid coordinator ObjectIds');
    }
    return new mongoose.Types.ObjectId(hex.padEnd(24, '0'));
  }

  private decodeCoordinatorId(objId: any): string {
    const hex = objId.toString();
    const unpadded = hex.replace(/0+$/, '');
    if (unpadded.length % 2 === 0) {
      const decoded = Buffer.from(unpadded, 'hex').toString('utf8');
      if (decoded.startsWith('coord-')) {
        return decoded;
      }
    }
    return hex;
  }

  private calculateStatus(dateStr: string, timeStr: string, currentStatus: string): 'upcoming' | 'ongoing' | 'completed' | 'cancelled' {
    if (currentStatus === 'cancelled') return 'cancelled';
    if (!dateStr) return (currentStatus as any) || 'upcoming';

    try {
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      const nowISTStr = formatter.format(new Date());

      let eventDateISTStr = '';
      if (dateStr.includes('T')) {
        eventDateISTStr = formatter.format(new Date(dateStr));
      } else {
        eventDateISTStr = dateStr.slice(0, 10);
      }

      if (eventDateISTStr > nowISTStr) {
        return 'upcoming';
      } else if (eventDateISTStr === nowISTStr) {
        return 'ongoing';
      } else {
        return 'completed';
      }
    } catch (e) {
      return (currentStatus as any) || 'upcoming';
    }
  }

  private mapToEvent = (doc: any): Event => {
    return {
      id: doc.id || doc._id.toString(),
      title: doc.title,
      description: doc.description,
      category: doc.category,
      date: doc.date,
      time: doc.time,
      venue: doc.venue,
      image: doc.image,
      registrationDeadline: doc.registrationDeadline,
      maxParticipants: doc.maxParticipants,
      status: this.calculateStatus(doc.date, doc.time, doc.status),
      coordinatorIds: (doc.coordinatorIds || []).map((id: any) => this.decodeCoordinatorId(id)),
      registrationCount: doc.registrationCount || 0,
      customFields: doc.customFields
    };
  }

  async findAll(): Promise<Event[]> {
    try {
      const events = await EventModel.aggregate([
        {
          $lookup: {
            from: 'registrations',
            localField: '_id',
            foreignField: 'eventId',
            as: 'registrations'
          }
        },
        {
          $addFields: {
            registrationCount: { $size: '$registrations' }
          }
        },
        {
          $project: {
            registrations: 0
          }
        }
      ]);
      return events.map(this.mapToEvent);
    } catch (error: any) {
      throw new Error(`MongoDB error: ${error.message}`);
    }
  }

  async findById(id: string): Promise<Event | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    try {
      const events = await EventModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: 'registrations',
            localField: '_id',
            foreignField: 'eventId',
            as: 'registrations'
          }
        },
        {
          $addFields: {
            registrationCount: { $size: '$registrations' }
          }
        },
        {
          $project: {
            registrations: 0
          }
        }
      ]);
      return events.length > 0 ? this.mapToEvent(events[0]) : undefined;
    } catch (error: any) {
      throw new Error(`MongoDB error: ${error.message}`);
    }
  }

  async create(event: Event): Promise<Event> {
    try {
      const { id, ...dataToSave } = event as any;
      if (dataToSave.coordinatorIds) {
        dataToSave.coordinatorIds = dataToSave.coordinatorIds.map((cid: string) => this.encodeCoordinatorId(cid));
      }
      const newEvent = await EventModel.create(dataToSave);
      return this.mapToEvent(newEvent);
    } catch (error: any) {
      if (error.message === 'invalid coordinator ObjectIds') {
        throw error;
      }
      throw new Error(`MongoDB error: ${error.message}`);
    }
  }

  async update(id: string, updates: Partial<Event>): Promise<Event | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    try {
      const dataToUpdate: any = { ...updates };
      delete dataToUpdate.id;
      delete dataToUpdate._id;
      delete dataToUpdate.createdAt;
      delete dataToUpdate.updatedAt;
      delete dataToUpdate.__v;
      
      if (dataToUpdate.coordinatorIds) {
        dataToUpdate.coordinatorIds = dataToUpdate.coordinatorIds.map((cid: string) => this.encodeCoordinatorId(cid));
      }

      const updatedEvent = await EventModel.findByIdAndUpdate(
        id,
        { $set: dataToUpdate },
        { new: true, returnDocument: 'after' }
      );
      return updatedEvent ? this.mapToEvent(updatedEvent) : undefined;
    } catch (error: any) {
      if (error.message === 'invalid coordinator ObjectIds') {
        throw error;
      }
      throw new Error(`MongoDB error: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    try {
      const result = await EventModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error: any) {
      throw new Error(`MongoDB error: ${error.message}`);
    }
  }

  async removeCoordinatorFromEvents(coordinatorId: string): Promise<void> {
    try {
      let encodedId: any = coordinatorId;
      try {
        encodedId = this.encodeCoordinatorId(coordinatorId);
      } catch (e) {
        // If encoding fails, fallback to passing the raw ID (though unlikely for valid ObjectIds)
      }
      await EventModel.updateMany(
        { coordinatorIds: encodedId },
        { $pull: { coordinatorIds: encodedId } }
      );
    } catch (error: any) {
      throw new Error(`MongoDB error: ${error.message}`);
    }
  }
}
