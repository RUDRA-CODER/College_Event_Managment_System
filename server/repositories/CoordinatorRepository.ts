import mongoose from 'mongoose';
import CoordinatorModel from '../models/Coordinator';
import { Coordinator } from '../data/mockData';

export class CoordinatorRepository {
  private mapToCoordinator = (doc: any): Coordinator => {
    return {
      id: doc.id || doc._id.toString(),
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      gender: doc.gender,
      dateOfBirth: doc.dateOfBirth,
      address: doc.address,
      city: doc.city,
      state: doc.state,
      pincode: doc.pincode,
      profileImage: doc.profileImage,
      department: doc.department,
      role: doc.role,
      coordinatorType: doc.coordinatorType,
      emailVerified: doc.emailVerified,
      enrollmentNumber: doc.enrollmentNumber,
      semester: doc.semester,
      employeeId: doc.employeeId,
      designation: doc.designation,
      facultyType: doc.facultyType,
      joiningDate: doc.joiningDate,
      experience: doc.experience,
      alternatePhone: doc.alternatePhone
    };
  }

  async findAll(): Promise<Coordinator[]> {
    try {
      const coordinators = await CoordinatorModel.find();
      return coordinators.map(this.mapToCoordinator);
    } catch (error: any) {
      throw new Error(`MongoDB error: ${error.message}`);
    }
  }

  async findById(id: string): Promise<Coordinator | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      // Compatibility for mock IDs
      if (id.startsWith('coord-')) {
        // Return undefined or try to handle? In MongoDB, it won't be found unless we query differently.
        // Actually, since mock data is no longer the source of truth, it shouldn't exist in DB.
      }
      return undefined;
    }
    try {
      const coordinator = await CoordinatorModel.findById(id);
      return coordinator ? this.mapToCoordinator(coordinator) : undefined;
    } catch (error: any) {
      throw new Error(`MongoDB error: ${error.message}`);
    }
  }

  async findByEmail(email: string): Promise<Coordinator | undefined> {
    try {
      const coordinator = await CoordinatorModel.findOne({ email });
      return coordinator ? this.mapToCoordinator(coordinator) : undefined;
    } catch (error: any) {
      throw new Error(`MongoDB error: ${error.message}`);
    }
  }

  async create(coordinator: any): Promise<Coordinator> {
    try {
      const { id, ...dataToSave } = coordinator;
      const newCoordinator = await CoordinatorModel.create(dataToSave);
      return this.mapToCoordinator(newCoordinator);
    } catch (error: any) {
      throw new Error(`MongoDB error: ${error.message}`);
    }
  }

  async update(id: string, updates: Partial<Coordinator>): Promise<Coordinator | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    try {
      const dataToUpdate = { ...updates };
      delete dataToUpdate.id;
      const updatedCoordinator = await CoordinatorModel.findByIdAndUpdate(
        id,
        { $set: dataToUpdate },
        { returnDocument: 'after' }
      );
      return updatedCoordinator ? this.mapToCoordinator(updatedCoordinator) : undefined;
    } catch (error: any) {
      throw new Error(`MongoDB error: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    try {
      const result = await CoordinatorModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error: any) {
      throw new Error(`MongoDB error: ${error.message}`);
    }
  }
}
