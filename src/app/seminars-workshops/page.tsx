"use client";

import React from 'react';
import { EventCard } from '@/components/events/EventCard';
import { mockEvents } from '@/data/events';
import { BookOpen, Presentation, ChevronRight } from 'lucide-react';

export default function SeminarsWorkshopsPage() {
  const sessions = mockEvents.filter(e => e.category === 'Seminar' || e.category === 'Workshop');
  
  const upcomingSessions = sessions.filter(e => e.status === 'Upcoming');
  const pastSessions = sessions.filter(e => e.status === 'Completed');

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Header */}
      <div className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary-400" />
              Seminars & Workshops
            </h1>
            <p className="text-lg text-gray-300">
              Enhance your skills and gain industry insights through our specialized technical sessions, guest lectures, and hands-on training programs.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Upcoming Section */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-8 border-b border-gray-200 pb-4">
            <Presentation className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-navy-900">Upcoming Sessions</h2>
          </div>
          
          {upcomingSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingSessions.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-100 shadow-sm">
              <p className="text-gray-500">There are currently no upcoming seminars or workshops scheduled. Check back later!</p>
            </div>
          )}
        </div>

        {/* Past Section */}
        <div>
          <div className="flex items-center gap-2 mb-8 border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-gray-600">Past Sessions</h2>
          </div>
          
          {pastSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-80 hover:opacity-100 transition-opacity">
              {pastSessions.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No past sessions to display.</p>
          )}
        </div>

      </div>
    </div>
  );
}
