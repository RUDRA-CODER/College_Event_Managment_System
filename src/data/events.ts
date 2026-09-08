export type EventCategory = 'Inspire' | 'Cultural' | 'Dance' | 'Sports' | 'Technical' | 'Workshop' | 'Seminar' | 'Other';

export interface Event {
  id: string;
  name: string;
  category: EventCategory;
  shortDescription: string;
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

export const mockEvents: Event[] = [
  {
    id: "EVT-2026-001",
    name: "Inspire 2026",
    category: "Inspire",
    shortDescription: "The biggest annual cultural and technical fest of CKPCET.",
    description: "Inspire is the annual flagship event of CK Pithawala College of Engineering and Technology. It brings together technical innovations, cultural performances, and sports competitions over an action-packed weekend. Don't miss out on the biggest event of the year!",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    date: "20 September 2026",
    time: "09:00 AM - 08:00 PM",
    venue: "CKPCET Campus Ground",
    organizer: "CKPCET Student Council",
    status: "Upcoming",
    registrationDeadline: "15 September 2026",
    availableSeats: 500,
    rules: [
      "Carry your college ID card at all times.",
      "Outside food is not allowed.",
      "Maintain discipline and decorum during the events."
    ],
    eligibility: "Open to all students of CKPCET"
  },
  {
    id: "EVT-2026-002",
    name: "AI & Future Technology Seminar",
    category: "Seminar",
    shortDescription: "Learn about emerging technologies, AI and the future of engineering.",
    description: "Join us for an insightful seminar on Artificial Intelligence and its applications in the future of engineering. Industry experts will discuss machine learning, neural networks, and how students can prepare for an AI-driven job market.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
    date: "05 October 2026",
    time: "10:00 AM - 01:00 PM",
    venue: "CKPCET Main Auditorium",
    organizer: "Computer Engineering Department",
    status: "Upcoming",
    registrationDeadline: "02 October 2026",
    availableSeats: 150,
    rules: [
      "Please arrive 15 minutes before the start time.",
      "Keep mobile phones on silent mode."
    ],
    eligibility: "All engineering students"
  },
  {
    id: "EVT-2026-003",
    name: "Annual Sports Meet",
    category: "Sports",
    shortDescription: "Inter-departmental sports tournament featuring cricket, volleyball, and more.",
    description: "The Annual Sports Meet is here! Represent your department in various sports including Cricket, Volleyball, Table Tennis, Chess, and Athletics. May the best department win the overall championship trophy.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop",
    date: "10 November 2026",
    time: "08:00 AM - 05:00 PM",
    venue: "CKPCET Sports Ground",
    organizer: "Sports Committee",
    status: "Upcoming",
    registrationDeadline: "01 November 2026",
    availableSeats: 300,
    rules: [
      "Proper sports attire is mandatory.",
      "Referee's decision will be final and binding.",
      "Players must report 30 minutes before their scheduled match."
    ],
    eligibility: "Enrolled students of CKPCET"
  },
  {
    id: "EVT-2026-004",
    name: "Web Development Workshop",
    category: "Workshop",
    shortDescription: "A hands-on workshop on modern web development with React and Next.js.",
    description: "Enhance your frontend development skills in this intensive 2-day workshop. Learn how to build scalable and performant web applications using React, Next.js, and Tailwind CSS. Participants will build a live project during the workshop.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
    date: "25 August 2026",
    time: "09:00 AM - 04:00 PM",
    venue: "Computer Lab 1",
    organizer: "IT Department",
    status: "Completed",
    registrationDeadline: "20 August 2026",
    availableSeats: 60,
    rules: [
      "Bring your own laptop.",
      "Basic knowledge of HTML/CSS and JavaScript is required."
    ],
    eligibility: "CE & IT Students (Sem 3 and above)"
  },
  {
    id: "EVT-2026-005",
    name: "Dance Fest - 'Rhythm'",
    category: "Dance",
    shortDescription: "Showcase your dance moves in solo and group performances.",
    description: "Get ready to groove at Rhythm, the ultimate dance competition of CKPCET. Whether you are a classical dancer or a hip-hop enthusiast, the stage is yours. Register for solo, duet, or group performances and win exciting prizes.",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2069&auto=format&fit=crop",
    date: "12 December 2026",
    time: "06:00 PM - 10:00 PM",
    venue: "Open Air Theatre (OAT)",
    organizer: "Cultural Committee",
    status: "Upcoming",
    registrationDeadline: "05 December 2026",
    availableSeats: 200,
    rules: [
      "Time limit for solo: 3 minutes, Group: 5 minutes.",
      "Audio tracks must be submitted in MP3 format 2 days prior.",
      "Use of props like fire or water is strictly prohibited."
    ],
    eligibility: "All students"
  },
  {
    id: "EVT-2026-006",
    name: "Hackathon - TechNova",
    category: "Technical",
    shortDescription: "24-hour coding marathon to solve real-world problems.",
    description: "TechNova is a 24-hour hackathon where students form teams to build innovative software or hardware solutions for real-world challenges. Themes include Smart City, Healthcare, EdTech, and FinTech.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop",
    date: "15 October 2026",
    time: "10:00 AM (Starts) - 24 hours",
    venue: "Innovation Hub",
    organizer: "Tech Club",
    status: "Upcoming",
    registrationDeadline: "10 October 2026",
    availableSeats: 100,
    rules: [
      "Team size: 2 to 4 members.",
      "All code must be written during the hackathon.",
      "Participants must stay on campus for the entire 24 hours."
    ],
    eligibility: "All engineering students"
  }
];
