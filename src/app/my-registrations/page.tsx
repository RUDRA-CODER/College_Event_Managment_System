"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockEvents } from '@/data/events';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Calendar, MapPin, Search, ArrowRight, Ticket } from 'lucide-react';
import Link from 'next/link';

export default function MyRegistrationsPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    setIsClient(true);
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('/login');
    }

    const savedRegs = localStorage.getItem('mockRegistrations');
    if (savedRegs) {
      setRegisteredIds(JSON.parse(savedRegs));
    }
  }, [router]);

  if (!isClient) return null;

  const myEvents = mockEvents.filter(e => registeredIds.includes(e.id));
  
  const filteredEvents = myEvents.filter(e => {
    if (filter === 'All') return true;
    return e.status === filter;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Header */}
      <div className="bg-navy-900 pt-16 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-900 opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 animate-fade-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">My Registrations</h1>
              <p className="text-primary-200 text-lg max-w-2xl">Track and manage all the events you have registered for. Your tickets and certificates will appear here.</p>
            </div>
            <Link href="/events">
              <Button variant="primary" className="shadow-lg shadow-primary-600/20 gap-2 h-11 px-6">
                Browse More Events <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {/* Filter Tabs */}
        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100/50 inline-flex mb-8 overflow-x-auto w-full sm:w-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {['All', 'Upcoming', 'Completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shrink-0 ${
                filter === status 
                  ? 'bg-primary-50 text-primary-700 shadow-sm' 
                  : 'text-gray-500 hover:text-navy-900 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Registrations List */}
        <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
          {filteredEvents.length > 0 ? (
            <div className="space-y-6">
              {filteredEvents.map(event => (
                <div key={event.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-md hover:border-primary-200">
                  {/* Image */}
                  <div className="w-full md:w-64 h-56 md:h-auto shrink-0 relative overflow-hidden">
                    <img src={event.image} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4">
                      <Badge variant={event.status === 'Completed' ? 'secondary' : 'success'} className="shadow-sm backdrop-blur-md bg-white/90">
                        {event.status === 'Completed' ? 'Completed' : 'Confirmed'}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 md:p-8 flex-grow flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold bg-primary-50 text-primary-600 px-3 py-1 rounded-full uppercase tracking-wider">{event.category}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-navy-900 group-hover:text-primary-600 transition-colors">{event.name}</h3>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-gray-100 text-sm font-mono text-gray-500">
                          <Ticket className="h-4 w-4 text-gray-400" />
                          REG-{event.id.slice(-4).toUpperCase()}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-6 line-clamp-2">{event.shortDescription}</p>
                    
                    <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex flex-wrap gap-6 text-sm text-gray-600 font-medium">
                        <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gray-400" /> {event.date} • {event.time}</div>
                        <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" /> {event.venue}</div>
                      </div>
                      <div className="flex gap-3 w-full sm:w-auto">
                        {event.status === 'Completed' ? (
                          <Button variant="outline" className="w-full sm:w-auto flex-1">View Certificate</Button>
                        ) : (
                          <Button variant="outline" className="w-full sm:w-auto flex-1 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200">View Ticket</Button>
                        )}
                        <Link href={`/events/${event.id}`} className="flex-1 sm:flex-none">
                          <Button variant="primary" className="w-full">Event Page</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-16 text-center border border-gray-100/50 shadow-sm">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-3">No registrations found</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">You haven't registered for any {filter !== 'All' ? filter.toLowerCase() : ''} events yet. Find an event that matches your interests!</p>
              <Link href="/events">
                <Button variant="primary" size="lg" className="shadow-lg shadow-primary-600/20 px-8">Browse Events</Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
