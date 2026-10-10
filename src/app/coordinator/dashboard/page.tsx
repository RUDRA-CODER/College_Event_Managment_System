"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Users, TrendingUp, Activity, ArrowRight, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getToken } from '@/services/auth';
import { Badge } from '@/components/ui/Badge';
import { API_BASE } from '@/services/api';

export default function CoordinatorDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const [statsRes, eventsRes, regsRes] = await Promise.all([
          fetch(`${API_BASE}/coordinator/dashboard`, { headers }),
          fetch(`${API_BASE}/coordinator/events`, { headers }),
          fetch(`${API_BASE}/coordinator/registrations`, { headers })
        ]);
        
        const statsData = await statsRes.json();
        const eventsData = await eventsRes.json();
        const regsData = await regsRes.json();

        if (statsData.success) setStats(statsData.data);
        if (eventsData.success) setEvents(eventsData.data.slice(0, 5)); // Get top 5 events
        if (regsData.success) setRegistrations(regsData.data.slice(0, 5)); // Get top 5 registrations
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming': return <Badge variant="warning">Upcoming</Badge>;
      case 'ongoing': return <Badge variant="primary">Ongoing</Badge>;
      case 'completed': return <Badge variant="success">Completed</Badge>;
      case 'cancelled': return <Badge variant="danger">Cancelled</Badge>;
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      case 'confirmed': return <Badge variant="success">Confirmed</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Good Morning, Coordinator</h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your events today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'My Events', value: stats?.totalEvents || 0, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'My Upcoming Events', value: stats?.upcomingEvents || 0, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Total Registrations', value: stats?.totalRegistrations || 0, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Active Events', value: stats?.activeEvents || 0, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-navy-900 mt-2">{stat.value}</p>
              </div>
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upcoming Events */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy-900">My Upcoming Events</h2>
            <Link href="/coordinator/events" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Event</th>
                  <th className="px-6 py-4 font-medium">Date & Time</th>
                  <th className="px-6 py-4 font-medium">Registrations</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-navy-900">{event.title}</div>
                      <div className="text-gray-500 text-xs mt-1">{event.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{event.date}</div>
                      <div className="text-gray-500 text-xs">{event.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{event.registrationCount}</span>
                        <span className="text-gray-400 text-xs">/ {event.maxParticipants}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                        <div 
                          className="bg-primary-500 h-1.5 rounded-full" 
                          style={{ width: `${Math.min(100, (event.registrationCount / event.maxParticipants) * 100)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(event.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/coordinator/events/${event.id}`}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-10 w-10 p-0 rounded-xl text-gray-500 hover:text-primary-600 hover:bg-primary-50 flex items-center justify-center transition-colors"
                            title="View Event Details"
                            aria-label="View Event Details"
                          >
                            <Eye className="h-5 w-5" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No events found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy-900">Recent Registrations</h2>
          </div>
          <div className="p-2 flex-1 overflow-y-auto">
            <div className="space-y-1">
              {registrations.map((reg) => (
                <div key={reg.id} className="p-4 hover:bg-gray-50 rounded-xl transition-colors flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold shrink-0">
                    {reg.studentName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-900 truncate">{reg.studentName}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{events.find(e => e.id === reg.eventId)?.title || 'Event ID: ' + reg.eventId}</p>
                  </div>
                  <div className="shrink-0">
                     {getStatusBadge(reg.status)}
                  </div>
                </div>
              ))}
              {registrations.length === 0 && (
                <div className="p-6 text-center text-gray-500 text-sm">
                  No recent registrations.
                </div>
              )}
            </div>
          </div>
          <div className="p-4 border-t border-gray-100">
            <Link href="/coordinator/registrations">
              <Button variant="outline" fullWidth className="rounded-xl border-gray-200">
                View All
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
