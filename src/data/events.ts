export type EventCategory = 'Inspire' | 'Cultural' | 'Dance' | 'Sports' | 'Technical' | 'Workshop' | 'Seminar' | 'Other';

export interface Event {
  id: string;
  title: string;
  category: EventCategory;
  description: string;
  image: string;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  registrationDeadline: string;
  availableSeats: number;
  rules: string[];
  eligibility: string;
}


