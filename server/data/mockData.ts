export interface Event {
  id: string;
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
  coordinatorIds: string[];
  registrationCount: number;
  customFields?: {
    name: string;
    type: 'text' | 'number' | 'textarea';
    required: boolean;
  }[];
}

export interface Registration {
  id: string;
  eventId: string;
  studentId: string;
  studentName: string;
  enrollmentNumber: string;
  email: string;
  registrationDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  attendance: boolean;
  customData?: any;
}

export interface Coordinator {
  id: string;
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

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
}

export let mockAdmins: Admin[] = [
  {
    id: 'admin-001',
    name: 'CKPCET Administrator',
    email: 'admin@ckpcet.ac.in',
    role: 'admin'
  }
];

export let mockCoordinators: Coordinator[] = [
  {
    id: 'coord-001',
    name: 'Dr. Jane Smith',
    email: 'jane.smith@ckpcet.ac.in',
    department: 'Computer Engineering',
    role: 'Event Coordinator',
    profileImage: 'https://ui-avatars.com/api/?name=Jane+Smith&background=0D8ABC&color=fff',
    coordinatorType: 'faculty'
  },
  {
    id: 'coord-002',
    name: 'Prof. Alan Turing',
    email: 'alan.turing@ckpcet.ac.in',
    department: 'Computer Engineering',
    role: 'Event Coordinator',
    profileImage: 'https://ui-avatars.com/api/?name=Alan+Turing&background=10B981&color=fff',
    coordinatorType: 'faculty'
  },
  {
    id: 'coord-003',
    name: 'Dr. Ada Lovelace',
    email: 'ada.lovelace@ckpcet.ac.in',
    department: 'Information Technology',
    role: 'Event Coordinator',
    profileImage: 'https://ui-avatars.com/api/?name=Ada+Lovelace&background=8B5CF6&color=fff',
    coordinatorType: 'faculty'
  }
];




