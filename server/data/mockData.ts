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
}

export interface Coordinator {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  avatar: string;
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
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=0D8ABC&color=fff'
  },
  {
    id: 'coord-002',
    name: 'Prof. Alan Turing',
    email: 'alan.turing@ckpcet.ac.in',
    department: 'Computer Engineering',
    role: 'Event Coordinator',
    avatar: 'https://ui-avatars.com/api/?name=Alan+Turing&background=10B981&color=fff'
  },
  {
    id: 'coord-003',
    name: 'Dr. Ada Lovelace',
    email: 'ada.lovelace@ckpcet.ac.in',
    department: 'Information Technology',
    role: 'Event Coordinator',
    avatar: 'https://ui-avatars.com/api/?name=Ada+Lovelace&background=8B5CF6&color=fff'
  }
];

export let mockEvents: Event[] = [
  {
    id: 'e1',
    title: 'AI Workshop',
    description: 'Hands-on workshop on generative AI and modern machine learning tools.',
    category: 'Workshop',
    date: '2026-11-05',
    time: '10:00 AM',
    venue: 'Computer Lab 1',
    image: 'https://images.unsplash.com/photo-1591453006520-1a136208945f?q=80&w=2070&auto=format&fit=crop',
    registrationDeadline: '2026-11-01',
    maxParticipants: 60,
    status: 'upcoming',
    coordinatorIds: ['coord-001', 'coord-002'], // Managed by Coord 1 and Coord 2
    registrationCount: 50
  },
  {
    id: 'e2',
    title: 'Tech Quiz',
    description: 'Test your technical knowledge in our annual quiz competition.',
    category: 'Technical',
    date: '2026-10-20',
    time: '02:00 PM',
    venue: 'Seminar Hall',
    image: 'https://images.unsplash.com/photo-1543269664-56d569502eb8?q=80&w=2070&auto=format&fit=crop',
    registrationDeadline: '2026-10-18',
    maxParticipants: 100,
    status: 'upcoming',
    coordinatorIds: ['coord-001'], // Managed by Coord 1
    registrationCount: 70
  },
  {
    id: 'e3',
    title: 'Sports Day',
    description: 'Annual college sports event featuring various games and athletics.',
    category: 'Sports',
    date: '2026-12-01',
    time: '08:00 AM',
    venue: 'College Ground',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop',
    registrationDeadline: '2026-11-25',
    maxParticipants: 300,
    status: 'upcoming',
    coordinatorIds: ['coord-003'], // Managed by Coord 3
    registrationCount: 150
  },
  {
    id: 'e4',
    title: 'Hackathon',
    description: '24-hour coding marathon to solve real-world problems.',
    category: 'Technical',
    date: '2026-10-15',
    time: '10:00 AM',
    venue: 'Innovation Hub',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop',
    registrationDeadline: '2026-10-10',
    maxParticipants: 100,
    status: 'upcoming',
    coordinatorIds: ['coord-003'], // Managed by Coord 3
    registrationCount: 30
  },
  {
    id: 'e5',
    title: 'Seminar on Cybersecurity',
    description: 'Expert talks on the latest trends and threats in cybersecurity.',
    category: 'Seminar',
    date: '2026-11-10',
    time: '11:00 AM',
    venue: 'Main Auditorium',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
    registrationDeadline: '2026-11-05',
    maxParticipants: 200,
    status: 'upcoming',
    coordinatorIds: ['coord-003'], // Managed by Coord 3
    registrationCount: 85
  }
];

export let mockRegistrations: Registration[] = [
  {
    id: 'r1',
    eventId: 'e1',
    studentId: 's1',
    studentName: 'Rahul Patel',
    enrollmentNumber: '22001011001',
    email: 'rahul@student.ckpcet.ac.in',
    registrationDate: '2026-09-20',
    status: 'confirmed',
    attendance: false
  },
  {
    id: 'r2',
    eventId: 'e2',
    studentId: 's2',
    studentName: 'Priya Sharma',
    enrollmentNumber: '22001011002',
    email: 'priya@student.ckpcet.ac.in',
    registrationDate: '2026-09-21',
    status: 'pending',
    attendance: false
  },
  {
    id: 'r3',
    eventId: 'e3',
    studentId: 's3',
    studentName: 'Amit Kumar',
    enrollmentNumber: '22001011003',
    email: 'amit@student.ckpcet.ac.in',
    registrationDate: '2026-09-22',
    status: 'confirmed',
    attendance: false
  }
];
