"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockUser } from '@/data/user';
import { mockEvents } from '@/data/events';
import { mockRegistrations } from '@/data/registrations';
import { EventCard } from '@/components/events/EventCard';
import { Button } from '@/components/ui/Button';
import { Calendar, CheckCircle, Clock, Trophy, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  // Local state for registrations
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);

  useEffect(() => {
    setIsClient(true);
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('/login');
    }

    // Load mock registrations from local storage or fallback to default
    const savedRegs = localStorage.getItem('mockRegistrations');
    if (savedRegs) {
      setRegisteredEventIds(JSON.parse(savedRegs));
    } else {
      // Initialize with default
      const defaultIds = mockRegistrations.map(r => r.eventId);
      localStorage.setItem('mockRegistrations', JSON.stringify(defaultIds));
      setRegisteredEventIds(defaultIds);
    }
  }, [router]);

  if (!isClient) return null;

  // Get user's registered events
  const userEvents = mockEvents.filter(e => registeredEventIds.includes(e.id));
  const upcomingUserEvents = userEvents.filter(e => e.status === 'Upcoming');
  const completedUserEvents = userEvents.filter(e => e.status === 'Completed');

  // Recommended events (not registered, upcoming)
  const recommendedEvents = mockEvents
    .filter(e => !registeredEventIds.includes(e.id) && e.status === 'Upcoming')
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="relative bg-navy-900 pt-16 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-primary-900 opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 animate-fade-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="inline-block px-3 py-1 bg-white/10 text-white text-xs font-semibold rounded-full backdrop-blur-sm border border-white/20 mb-4">
                Student Portal
              </span>
              <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Welcome back, {mockUser.name.split(' ')[0]}!</h1>
              <p className="text-primary-200 text-lg">Here's an overview of your campus activities.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/events">
                <Button variant="primary" className="shadow-lg shadow-primary-600/20 gap-2 h-11 px-6">
                  Explore Events <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content (overlapping header) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50 flex items-center gap-5 hover:shadow-md transition-shadow group">
            <div className="bg-blue-50 text-blue-600 p-4 rounded-xl group-hover:scale-110 transition-transform"><Calendar className="h-6 w-6" /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Total Registered</p>
              <p className="text-3xl font-extrabold text-navy-900">{registeredEventIds.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50 flex items-center gap-5 hover:shadow-md transition-shadow group">
            <div className="bg-orange-50 text-orange-600 p-4 rounded-xl group-hover:scale-110 transition-transform"><Clock className="h-6 w-6" /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Upcoming</p>
              <p className="text-3xl font-extrabold text-navy-900">{upcomingUserEvents.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50 flex items-center gap-5 hover:shadow-md transition-shadow group">
            <div className="bg-green-50 text-green-600 p-4 rounded-xl group-hover:scale-110 transition-transform"><CheckCircle className="h-6 w-6" /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Completed</p>
              <p className="text-3xl font-extrabold text-navy-900">{completedUserEvents.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50 flex items-center gap-5 hover:shadow-md transition-shadow group">
            <div className="bg-purple-50 text-purple-600 p-4 rounded-xl group-hover:scale-110 transition-transform"><Trophy className="h-6 w-6" /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Certificates</p>
              <p className="text-3xl font-extrabold text-navy-900">{completedUserEvents.length}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Wider) */}
          <div className="lg:col-span-2 space-y-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            
            {/* Upcoming Registered Events */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-bold text-navy-900">Your Upcoming Events</h2>
                <Link href="/my-registrations" className="text-sm text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1 transition-colors">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="p-8">
                {upcomingUserEvents.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingUserEvents.map(event => (
                      <div key={event.id} className="group flex flex-col sm:flex-row gap-6 p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all bg-white hover:bg-slate-50/50">
                        <div className="relative w-full sm:w-40 h-28 shrink-0 overflow-hidden rounded-lg">
                          <img src={event.image} alt={event.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex-grow flex flex-col justify-center">
                          <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                            <h3 className="font-bold text-lg text-navy-900 group-hover:text-primary-600 transition-colors">{event.name}</h3>
                            <span className="text-xs font-bold bg-primary-50 text-primary-600 px-3 py-1 rounded-full">{event.category}</span>
                          </div>
                          <p className="text-sm text-gray-500 mb-3 line-clamp-1">{event.shortDescription}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-medium">
                            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-gray-400" /> {event.date}</span>
                            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-gray-400" /> {event.time}</span>
                          </div>
                        </div>
                        <div className="flex flex-col justify-center shrink-0">
                          <Link href={`/events/${event.id}`}>
                            <Button variant="outline" className="w-full sm:w-auto hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200">View Details</Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 px-4 border-2 border-dashed border-gray-100 rounded-xl bg-slate-50/50">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-4">
                      <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-navy-900 mb-2">No upcoming events</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">You haven't registered for any upcoming events yet. Discover what's happening on campus!</p>
                    <Link href="/events">
                      <Button variant="primary" className="shadow-md shadow-primary-600/20">Discover Events</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Events */}
            <div>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-bold text-navy-900 tracking-tight">Recommended for You</h2>
                <Link href="/events" className="text-sm font-semibold text-primary-600 hover:text-primary-700 hidden sm:block">Browse all catalog</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendedEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-8 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            
            {/* Mini Profile */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-primary-600 via-primary-500 to-blue-400 relative">
                <div className="absolute inset-0 bg-primary-900 opacity-10 mix-blend-overlay"></div>
              </div>
              <div className="px-8 pb-8 relative text-center">
                <div className="w-24 h-24 bg-white rounded-2xl p-1.5 absolute -top-12 left-1/2 -translate-x-1/2 shadow-lg shadow-black/5 rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="w-full h-full bg-slate-50 rounded-xl flex items-center justify-center text-primary-600 border border-gray-100">
                    <User className="h-10 w-10" />
                  </div>
                </div>
                <div className="pt-16">
                  <h3 className="text-2xl font-extrabold text-navy-900 tracking-tight">{mockUser.name}</h3>
                  <div className="mt-2 space-y-1 mb-6">
                    <p className="text-sm font-medium text-gray-500">{mockUser.department} • Semester {mockUser.semester}</p>
                    <p className="text-sm font-medium text-gray-400">{mockUser.enrollmentNumber}</p>
                  </div>
                  <Link href="/profile">
                    <Button variant="outline" fullWidth className="h-11 rounded-xl">Manage Profile</Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100 bg-slate-50/50">
                <h2 className="font-bold text-lg text-navy-900">Recent Activity</h2>
              </div>
              <div className="p-8">
                {registeredEventIds.length > 0 ? (
                  <div className="relative border-l-2 border-gray-100 ml-4 space-y-8">
                    {registeredEventIds.slice(0, 3).map((id, index) => {
                      const evt = mockEvents.find(e => e.id === id);
                      if(!evt) return null;
                      return (
                        <div key={id} className="relative pl-6">
                          <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-primary-100 border-2 border-white flex items-center justify-center shadow-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary-600"></span>
                          </span>
                          <p className="text-sm font-semibold text-navy-900 mb-0.5">Registered for event</p>
                          <p className="text-sm text-gray-600 mb-1">{evt.name}</p>
                          <p className="text-xs font-medium text-gray-400">{index === 0 ? 'Today' : index === 1 ? 'Yesterday' : 'A few days ago'}</p>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No recent activity.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
