"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchMyRegistrations, fetchEvents } from '@/services/api';
import { getToken } from '@/services/auth';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Calendar, MapPin, Clock, ArrowLeft, Download, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function TicketPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registration, setRegistration] = useState<any>(null);
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    const isLoggedIn = !!getToken();
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    const loadTicket = async () => {
      try {
        const [regs, allEvents] = await Promise.all([
          fetchMyRegistrations(),
          fetchEvents()
        ]);
        
        const reg = regs.find((r: any) => r.id === id || r._id === id);
        if (reg) {
          setRegistration(reg);
          const ev = allEvents.find((e: any) => (e._id || e.id) === reg.eventId);
          setEvent(ev);
        }
      } catch (err) {
        console.error('Failed to load ticket:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadTicket();
  }, [id, router]);

  if (!isClient) return null;

  if (loading) {
    return <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50">Loading ticket...</div>;
  }

  if (!registration || !event) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md">
          <h2 className="text-2xl font-bold text-navy-900 mb-2">Ticket Not Found</h2>
          <p className="text-gray-500 mb-8">This ticket does not exist or you do not have permission to view it.</p>
          <Link href="/my-registrations">
            <Button variant="primary" fullWidth>Back to Registrations</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-2xl mb-6">
        <Link href="/my-registrations" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-navy-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Registrations
        </Link>
      </div>
      
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">
        {/* Ticket Header (Event Details) */}
        <div className="bg-navy-900 text-white p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary-900/20 mix-blend-overlay"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <h4 className="text-primary-300 font-bold tracking-widest uppercase text-xs mb-3">CKPCET Events • Event Ticket</h4>
            <h1 className="text-3xl font-extrabold mb-4">{event.title}</h1>
            <Badge variant="success" className="mb-6">{registration.status === 'confirmed' ? 'Confirmed' : 'Registered'}</Badge>
            
            <div className="flex flex-wrap justify-center gap-6 mt-2 text-sm text-gray-200">
              <div className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> {event.date}</div>
              <div className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> {event.time}</div>
              <div className="flex items-center"><MapPin className="w-4 h-4 mr-1.5" /> {event.venue}</div>
            </div>
          </div>
          
          {/* Ticket perforations */}
          <div className="absolute -bottom-2 left-0 w-full flex justify-between overflow-hidden px-2">
             {Array.from({length: 20}).map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-white shrink-0"></div>
             ))}
          </div>
        </div>

        {/* Ticket Body (Student Details) */}
        <div className="p-8 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Student Name</p>
              <p className="text-lg font-medium text-navy-900">{registration.studentName}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Enrollment Number</p>
              <p className="text-lg font-medium text-navy-900 font-mono">{registration.enrollmentNumber}</p>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Registration ID / Ticket No</p>
              <p className="text-lg font-medium text-navy-900 font-mono">REG-{(registration.id || registration._id || '00000000').slice(-8).toUpperCase()}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-6 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-green-600 bg-green-50 px-3 py-1.5 rounded-lg text-sm font-medium">
              <CheckCircle className="w-4 h-4 mr-2" /> Valid for Entry
            </div>
            <Button variant="outline" className="gap-2 h-11 px-5 rounded-xl w-full sm:w-auto" onClick={() => window.print()}>
              <Download className="w-4 h-4" /> Download Ticket
            </Button>
          </div>
        </div>
        
        {/* Side cutouts to look like a ticket */}
        <div className="absolute top-[250px] -left-4 w-8 h-8 rounded-full bg-slate-50 border-r border-gray-100"></div>
        <div className="absolute top-[250px] -right-4 w-8 h-8 rounded-full bg-slate-50 border-l border-gray-100"></div>
      </div>
    </div>
  );
}
