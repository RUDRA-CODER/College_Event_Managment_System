"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Clock, Users, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function AdminEventDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/events/${id}`);
        const data = await res.json();
        if (data.success) {
          setEvent(data.data);
        } else {
          router.push('/admin/events');
        }
      } catch (err) {
        console.error('Failed to fetch event details', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id, router]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await fetch(`http://localhost:5000/api/events/${id}`, { 
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          router.push('/admin/events');
        } else {
          alert('Failed to delete event');
        }
      } catch (err) {
        alert('An error occurred');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming': return <Badge variant="warning">Upcoming</Badge>;
      case 'ongoing': return <Badge variant="primary">Ongoing</Badge>;
      case 'completed': return <Badge variant="success">Completed</Badge>;
      case 'cancelled': return <Badge variant="danger">Cancelled</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
     return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  }

  if (!event) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/events">
            <Button variant="ghost" className="h-10 w-10 p-0 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-navy-900">Event Details</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/admin/events/${id}/edit`}>
            <Button variant="outline" className="gap-2 rounded-xl border-gray-200">
              <Edit className="h-4 w-4" /> Edit Event
            </Button>
          </Link>
          <Button variant="outline" onClick={handleDelete} className="gap-2 rounded-xl border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-100">
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Banner Image */}
        <div className="h-64 w-full relative">
          <img src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="primary">{event.category}</Badge>
              {getStatusBadge(event.status)}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{event.title}</h1>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <h3 className="text-lg font-bold text-navy-900 mb-3">About the Event</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </section>
          </div>

          {/* Sidebar Details */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-navy-900">Date</p>
                  <p className="text-sm text-gray-600">{event.date}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-navy-900">Time</p>
                  <p className="text-sm text-gray-600">{event.time}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-navy-900">Venue</p>
                  <p className="text-sm text-gray-600">{event.venue}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-navy-900">Registration</p>
                  <p className="text-sm text-gray-600">
                    {event.registrationCount} / {event.maxParticipants} Registered
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-primary-500 h-1.5 rounded-full" 
                      style={{ width: `${Math.min(100, (event.registrationCount / event.maxParticipants) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
               <p className="text-sm font-medium text-amber-800 mb-1">Registration Deadline</p>
               <p className="text-lg font-bold text-amber-900">{event.registrationDeadline}</p>
            </div>

            <Link href="/admin/registrations" className="block">
              <Button variant="primary" fullWidth className="shadow-md shadow-primary-500/20">
                View Registrations
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
