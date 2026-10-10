import mongoose from 'mongoose';
import dotenv from 'dotenv';
import EventModel from '../server/models/Event';
import RegistrationModel from '../server/models/Registration';
import CoordinatorModel from '../server/models/Coordinator';

import path from 'path';
// Load environment variables
dotenv.config({ path: '.env' });

const DB_URI = process.env.MONGO_URI;

if (!DB_URI) {
  console.error('Error: MONGO_URI is not defined in the .env file.');
  process.exit(1);
}

// Ensure the connection is established properly
async function resetAndSeed() {
  try {
    await mongoose.connect(DB_URI as string, { dbName: 'ckpcet_events' });
    console.log('Connected to MongoDB.');

    // Count before cleanup
    const preEventCount = await EventModel.countDocuments();
    const preRegCount = await RegistrationModel.countDocuments();
    console.log('\\n--- Before cleanup ---');
    console.log(`Events: ${preEventCount}`);
    console.log(`Registrations: ${preRegCount}`);

    // Clean up
    console.log('\\nCleaning up events and their registrations...');
    
    // First, find all events
    const allEvents = await EventModel.find({}, '_id');
    const eventIds = allEvents.map(e => e._id);
    
    // Delete registrations associated with those events
    const delRegRes = await RegistrationModel.deleteMany({ eventId: { $in: eventIds } });
    
    // Then delete all events
    const delEventRes = await EventModel.deleteMany({});
    
    console.log(`Deleted ${delRegRes.deletedCount} orphaned registrations.`);
    console.log(`Deleted ${delEventRes.deletedCount} old events.`);

    // Check after cleanup
    const midEventCount = await EventModel.countDocuments();
    // Count orphaned registrations (registrations that point to an event that doesn't exist)
    // Since we just deleted all events, ANY remaining registration pointing to a non-existent event is orphaned,
    // but we just deleted registrations for all events that existed. Wait, let's just count registrations where eventId not in current events.
    const currentEvents = await EventModel.find({}, '_id');
    const currentEventIds = currentEvents.map(e => e._id);
    const orphanRegCount = await RegistrationModel.countDocuments({ eventId: { $nin: currentEventIds } });

    console.log('\\n--- After cleanup ---');
    console.log(`Events: ${midEventCount}`);
    console.log(`Orphan registrations: ${orphanRegCount}`);

    // If there are any stray orphans (maybe event was deleted manually in Compass before without deleting reg),
    // let's just wipe them out now to be completely clean.
    if (orphanRegCount > 0) {
      console.log('Found pre-existing orphaned registrations. Cleaning them up...');
      await RegistrationModel.deleteMany({ eventId: { $nin: currentEventIds } });
      console.log('Orphaned registrations cleaned.');
    }

    // Now, fetch a coordinator to assign if possible
    const coordinator = await CoordinatorModel.findOne({});
    const coordinatorIds = coordinator ? [coordinator._id] : [];

    console.log('\\nSeeding verified CKPCET events...');

    // Verified events
    const eventsToSeed = [
      {
        title: 'CKPCET Internal Hackathon',
        description: 'A college-level innovation and coding event where student teams develop solutions around a defined problem statement and present their prototype to the evaluation panel. A prime opportunity for developers to showcase their skills.',
        category: 'Technical',
        date: '2026-10-15',
        time: '09:00 AM',
        venue: 'Computer Engineering Department, Lab 1',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
        registrationDeadline: '2026-10-10',
        maxParticipants: 100,
        status: 'upcoming',
        coordinatorIds,
        customFields: [
          { name: 'teamName', type: 'text', required: true },
          { name: 'githubRepository', type: 'text', required: false }
        ]
      },
      {
        title: 'Alumni Meet and Award Ceremony',
        description: 'An evening dedicated to welcoming back our proud CKPCET alumni. Reconnect with old friends, network with professionals, and celebrate the achievements of our outstanding graduates.',
        category: 'Other',
        date: '2026-11-20',
        time: '05:30 PM',
        venue: 'College Auditorium',
        image: 'https://images.unsplash.com/photo-1523580494112-071d4574024e?w=800&q=80',
        registrationDeadline: '2026-11-15',
        maxParticipants: 500,
        status: 'upcoming',
        coordinatorIds,
        customFields: [
          { name: 'graduationYear', type: 'number', required: true },
          { name: 'currentCompany', type: 'text', required: false }
        ]
      },
      {
        title: 'Code-a-thon 2026',
        description: 'A rigorous competitive programming contest testing algorithmic problem-solving skills. Organized in collaboration with the CSI Student Branch.',
        category: 'Technical',
        date: '2026-08-10',
        time: '10:00 AM',
        venue: 'Lab 3, IT Department',
        image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80',
        registrationDeadline: '2026-08-05',
        maxParticipants: 60,
        status: 'completed',
        coordinatorIds,
        customFields: [
          { name: 'hackerrankUsername', type: 'text', required: true }
        ]
      },
      {
        title: 'LAN Gaming: CS:GO & Valorant Tournament',
        description: 'The ultimate e-sports showdown at CKPCET. Gather your team and compete in popular multiplayer tactical shooter games to win exciting cash prizes.',
        category: 'Sports',
        date: '2026-09-30',
        time: '11:00 AM',
        venue: 'Computer Center',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
        registrationDeadline: '2026-09-29',
        maxParticipants: 120,
        status: 'ongoing',
        coordinatorIds,
        customFields: [
          { name: 'teamName', type: 'text', required: true },
          { name: 'gameChoice', type: 'dropdown', options: ['CS:GO', 'Valorant'], required: true }
        ]
      },
      {
        title: 'Robo Maze & Line Follower',
        description: 'A robotics competition where participants build and program autonomous robots to navigate complex mazes and follow complex line patterns in the shortest time possible.',
        category: 'Technical',
        date: '2026-10-25',
        time: '09:30 AM',
        venue: 'Mechanical Engineering Workshop',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
        registrationDeadline: '2026-10-20',
        maxParticipants: 50,
        status: 'upcoming',
        coordinatorIds,
        customFields: [
          { name: 'robotName', type: 'text', required: true }
        ]
      },
      {
        title: 'Box Cricket League',
        description: 'An exciting intramural box cricket tournament featuring teams from all departments. Fast-paced matches with modified rules for a smaller playing area.',
        category: 'Sports',
        date: '2026-02-15',
        time: '04:00 PM',
        venue: 'College Ground',
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
        registrationDeadline: '2026-02-10',
        maxParticipants: 160,
        status: 'completed',
        coordinatorIds,
        customFields: []
      },
      {
        title: 'Idea-Giri: Startup Pitch',
        description: 'Inspire event feature: Pitch your innovative startup ideas to a panel of industry experts and angel investors. A great platform for budding entrepreneurs.',
        category: 'Inspire',
        date: '2026-12-05',
        time: '10:00 AM',
        venue: 'Seminar Hall 1',
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?w=800&q=80',
        registrationDeadline: '2026-12-01',
        maxParticipants: 40,
        status: 'upcoming',
        coordinatorIds,
        customFields: [
          { name: 'startupName', type: 'text', required: true },
          { name: 'pitchDeckLink', type: 'text', required: false }
        ]
      },
      {
        title: 'Introduction to Machine Learning Workshop',
        description: 'A comprehensive hands-on workshop covering the fundamentals of Machine Learning using Python, Scikit-Learn, and TensorFlow.',
        category: 'Workshop',
        date: '2026-10-05',
        time: '09:00 AM',
        venue: 'Lab 2',
        image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80',
        registrationDeadline: '2026-10-01',
        maxParticipants: 60,
        status: 'upcoming',
        coordinatorIds,
        customFields: [
          { name: 'department', type: 'text', required: true }
        ]
      },
      {
        title: 'Expert Seminar on Cyber Security',
        description: 'An industry expert talks about the latest trends, threats, and career opportunities in the rapidly evolving field of Cyber Security.',
        category: 'Seminar',
        date: '2026-09-10',
        time: '02:00 PM',
        venue: 'Main Auditorium',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
        registrationDeadline: '2026-09-08',
        maxParticipants: 200,
        status: 'completed',
        coordinatorIds,
        customFields: []
      },
      {
        title: 'Cultural Evening: Rhythm & Beats',
        description: 'A vibrant showcase of dance, music, and dramatic performances by the students of CKPCET to celebrate our rich cultural diversity.',
        category: 'Cultural',
        date: '2026-08-25',
        time: '06:00 PM',
        venue: 'Open Air Theatre',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
        registrationDeadline: '2026-08-20',
        maxParticipants: 400,
        status: 'cancelled', // Testing cancelled status
        coordinatorIds,
        customFields: [
          { name: 'performanceCategory', type: 'dropdown', options: ['Dance', 'Singing', 'Drama', 'Other'], required: true }
        ]
      },
      {
        title: '[DEMO] Photography Contest',
        description: 'Demo event created for portal testing. A contest for photography enthusiasts to capture the best campus moments.',
        category: 'Cultural',
        date: '2026-11-10',
        time: '10:00 AM',
        venue: 'Campus Grounds',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
        registrationDeadline: '2026-11-05',
        maxParticipants: 100,
        status: 'upcoming',
        coordinatorIds,
        customFields: []
      }
    ];

    const insertedEvents = await EventModel.insertMany(eventsToSeed);
    
    console.log('\\n--- After seed ---');
    console.log(`Events: ${insertedEvents.length}`);

    console.log('\\nData cleanup and seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup and seed:', error);
    process.exit(1);
  }
}

resetAndSeed();
