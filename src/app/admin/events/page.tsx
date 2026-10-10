"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { API_BASE } from '@/services/api';
import { useToast } from '@/contexts/ToastContext';
import { useConfirm } from '@/contexts/ConfirmContext';

export default function AdminEvents() {
  const { showSuccess, showError } = useToast();
  const { confirm } = useConfirm();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_BASE}/events`);
      const data = await res.json();
      if (data.success) setEvents(data.data);
    } catch (err) {
      console.error('Failed to fetch events', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Delete Event',
      message: 'Are you sure you want to delete this event? This action cannot be undone.',
      confirmText: 'Delete',
      isDestructive: true
    });
    if (!confirmed) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setEvents(events.filter(e => e.id !== id));
        showSuccess('Event deleted successfully');
      } else {
        showError(data.message || 'Failed to delete event');
      }
    } catch (err: any) {
      showError(err.message || 'Error connecting to server');
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

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || e.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Event Management</h1>
          <p className="text-gray-500 mt-1">Manage and track all events across the college.</p>
        </div>
        <Link href="/admin/events/create">
          <Button variant="primary" className="gap-2 rounded-xl">
            <Plus className="h-5 w-5" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="relative sm:w-64">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm appearance-none bg-white"
            >
              <option value="All">All Categories</option>
              <option value="Technical">Technical</option>
              <option value="Cultural">Cultural</option>
              <option value="Sports">Sports</option>
              <option value="Workshop">Workshop</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium">Event Name</th>
                  <th className="px-6 py-4 font-medium">Date & Venue</th>
                  <th className="px-6 py-4 font-medium">Registrations</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} alt={event.title} className="h-10 w-10 rounded-lg object-cover border border-gray-200" />
                        <div>
                          <div className="font-medium text-navy-900">{event.title}</div>
                          <div className="text-gray-500 text-xs mt-1">{event.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{event.date} at {event.time}</div>
                      <div className="text-gray-500 text-xs mt-1 truncate max-w-[150px]">{event.venue}</div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{event.registrationCount}</span>
                        <span className="text-gray-400 text-xs">/ {event.maxParticipants}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(event.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/events/${event.id}`}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-10 w-10 p-0 rounded-xl text-gray-500 hover:text-primary-600 hover:bg-primary-50 flex items-center justify-center transition-colors" 
                            title="View Details"
                            aria-label="View Details"
                          >
                            <Eye className="h-5 w-5" />
                          </Button>
                        </Link>
                        <Link href={`/admin/events/${event.id}/edit`}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-10 w-10 p-0 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors" 
                            title="Edit Event"
                            aria-label="Edit Event"
                          >
                            <Edit className="h-5 w-5" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(event.id)}
                          className="h-10 w-10 p-0 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors" 
                          title="Delete Event"
                          aria-label="Delete Event"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredEvents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="h-12 w-12 text-gray-200 mb-3" />
                        <p className="text-base font-medium text-navy-900">No events found</p>
                        <p className="text-sm">Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
