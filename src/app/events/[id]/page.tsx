"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockEvents } from '@/data/events';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Calendar, MapPin, Clock, Users, ArrowLeft, 
  Share2, Bookmark, CheckCircle, Info, CalendarPlus, ArrowRight 
} from 'lucide-react';
import Link from 'next/link';

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [isClient, setIsClient] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Find the event
  const event = mockEvents.find(e => e.id === id);

  useEffect(() => {
    setIsClient(true);
    if (!event) return;

    // Check registration status from local storage
    const savedRegs = localStorage.getItem('mockRegistrations');
    if (savedRegs) {
      const parsedRegs: string[] = JSON.parse(savedRegs);
      if (parsedRegs.includes(event.id)) {
        setIsRegistered(true);
      }
    }
  }, [event]);

  if (!isClient) return null;

  if (!event) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-navy-900 mb-2">Event Not Found</h2>
          <p className="text-gray-500 mb-8">The event you are looking for does not exist or has been removed.</p>
          <Link href="/events">
            <Button variant="primary" fullWidth>Browse All Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleRegister = () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    setIsRegistering(true);

    // Mock API call
    setTimeout(() => {
      const savedRegs = localStorage.getItem('mockRegistrations');
      let parsedRegs: string[] = [];
      if (savedRegs) {
        parsedRegs = JSON.parse(savedRegs);
      }
      
      if (!parsedRegs.includes(event.id)) {
        parsedRegs.push(event.id);
        localStorage.setItem('mockRegistrations', JSON.stringify(parsedRegs));
      }
      
      setIsRegistered(true);
      setIsRegistering(false);
    }, 1500);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Top Banner & Header */}
      <div className="bg-white border-b border-gray-100 relative">
        <div className="h-[30vh] md:h-[40vh] w-full relative overflow-hidden bg-navy-900">
          <img 
            src={event.image} 
            alt={event.name} 
            className="absolute inset-0 w-full h-full object-cover opacity-60 animate-image-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent"></div>
          
          <div className="absolute top-6 left-6 z-10">
            <Link href="/events" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-navy-900 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-24 sm:-mt-32 z-10 pb-8">
          <div className="bg-white rounded-2xl shadow-xl shadow-navy-900/5 p-6 sm:p-10 border border-gray-100 flex flex-col md:flex-row md:items-start justify-between gap-8 animate-fade-up">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="primary" className="px-3 py-1 text-sm">{event.category}</Badge>
                <Badge variant={event.status === 'Completed' ? 'secondary' : 'success'} className="px-3 py-1 text-sm">
                  {event.status}
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy-900 tracking-tight mb-4">
                {event.name}
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
                {event.shortDescription}
              </p>
            </div>
            
            <div className="flex md:flex-col gap-3 shrink-0">
              <Button 
                variant="outline" 
                className="w-12 h-12 p-0 rounded-full border-gray-200 text-gray-600 hover:text-primary-600 hover:border-primary-200 bg-gray-50 hover:bg-primary-50"
                onClick={() => setIsSaved(!isSaved)}
                title="Save Event"
              >
                <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-primary-600 text-primary-600' : ''}`} />
              </Button>
              <Button 
                variant="outline" 
                className="w-12 h-12 p-0 rounded-full border-gray-200 text-gray-600 hover:text-primary-600 hover:border-primary-200 bg-gray-50 hover:bg-primary-50"
                title="Share Event"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          
          {/* Left Column - Details */}
          <div className="flex-1 space-y-12 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            
            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
                <Calendar className="h-6 w-6 text-primary-600 mb-3" />
                <p className="text-sm text-gray-500 font-medium mb-1">Date</p>
                <p className="font-bold text-navy-900">{event.date}</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
                <Clock className="h-6 w-6 text-primary-600 mb-3" />
                <p className="text-sm text-gray-500 font-medium mb-1">Time</p>
                <p className="font-bold text-navy-900">{event.time}</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
                <MapPin className="h-6 w-6 text-primary-600 mb-3" />
                <p className="text-sm text-gray-500 font-medium mb-1">Venue</p>
                <p className="font-bold text-navy-900 line-clamp-1" title={event.venue}>{event.venue}</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
                <Users className="h-6 w-6 text-primary-600 mb-3" />
                <p className="text-sm text-gray-500 font-medium mb-1">Capacity</p>
                <p className="font-bold text-navy-900">{event.availableSeats} seats</p>
              </div>
            </div>

            {/* About */}
            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-6 flex items-center gap-2">
                <Info className="h-6 w-6 text-primary-600" /> About this Event
              </h2>
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm prose prose-slate max-w-none prose-p:text-gray-600 prose-headings:text-navy-900">
                <p className="text-lg leading-relaxed text-gray-600">
                  Join us for an incredible experience at the upcoming {event.name}. This {event.category.toLowerCase()} event is designed to bring together students, faculty, and industry experts for a day of learning, networking, and fun.
                </p>
                <p className="text-lg leading-relaxed text-gray-600 mt-4">
                  Whether you're looking to enhance your skills, meet like-minded peers, or simply enjoy the vibrant campus life at CKPCET, this event has something for everyone. Make sure to register early as seats are limited and highly sought after.
                </p>
                <h3 className="text-xl font-bold text-navy-900 mt-8 mb-4">What to expect:</h3>
                <ul className="space-y-3 mt-4 text-gray-600">
                  <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" /> Interactive sessions and hands-on activities</li>
                  <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" /> Networking opportunities with peers and experts</li>
                  <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" /> Certificate of participation for all attendees</li>
                  <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" /> Refreshments and exciting giveaways</li>
                </ul>
              </div>
            </section>

          </div>

          {/* Right Column - Sticky Registration Sidebar */}
          <div className="lg:w-[400px] shrink-0 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-navy-900/5 overflow-hidden">
                
                {/* Card Header */}
                <div className="bg-slate-50 border-b border-gray-100 px-8 py-6 text-center">
                  <p className="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-1">Registration</p>
                  <div className="text-4xl font-extrabold text-navy-900">Free</div>
                  <p className="text-sm text-gray-500 mt-1">For CKPCET Students</p>
                </div>

                {/* Card Body */}
                <div className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Status</span>
                      <Badge variant={event.status === 'Completed' ? 'secondary' : 'success'}>
                        {event.status === 'Completed' ? 'Closed' : 'Open'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Spots Left</span>
                      <span className="font-bold text-navy-900">{Math.floor(event.availableSeats * 0.3)} / {event.availableSeats}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Registration Ends</span>
                      <span className="font-bold text-navy-900">{event.date}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    {event.status === 'Completed' ? (
                      <Button fullWidth size="lg" variant="secondary" disabled className="h-14 text-base font-bold">
                        Event Completed
                      </Button>
                    ) : isRegistered ? (
                      <div className="space-y-3">
                        <Button fullWidth size="lg" className="h-14 text-base font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20 gap-2">
                          <CheckCircle className="h-5 w-5" /> Registered
                        </Button>
                        <p className="text-center text-sm text-gray-500 font-medium">Check 'My Registrations' for your ticket.</p>
                      </div>
                    ) : (
                      <Button 
                        fullWidth 
                        size="lg" 
                        variant="primary" 
                        className="h-14 text-base font-bold shadow-xl shadow-primary-600/20 gap-2"
                        onClick={handleRegister}
                        disabled={isRegistering}
                      >
                        {isRegistering ? (
                          'Processing...'
                        ) : (
                          <>Register Now <ArrowRight className="h-5 w-5" /></>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="bg-slate-50 px-8 py-4 text-center border-t border-gray-100">
                  <button className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center justify-center gap-1.5 w-full">
                    <CalendarPlus className="h-4 w-4" /> Add to Google Calendar
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
