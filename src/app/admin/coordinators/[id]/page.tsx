"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Calendar, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CoordinatorDetail() {
  const params = useParams();
  const router = useRouter();
  const coordinatorId = params.id as string;

  const [coordinator, setCoordinator] = useState<any>(null);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      
      // Fetch coordinator details & assigned events
      const coordRes = await fetch(`http://localhost:5000/api/admin/coordinators/${coordinatorId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const coordData = await coordRes.json();
      
      // Fetch all events for the dropdown
      const eventsRes = await fetch(`http://localhost:5000/api/events`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const eventsData = await eventsRes.json();

      if (coordData.success) {
        setCoordinator(coordData.data);
      }
      if (eventsData.success) {
        setAllEvents(eventsData.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [coordinatorId]);

  const handleAssign = async () => {
    if (!selectedEventId) return;
    setAssigning(true);
    try {
      const token = localStorage.getItem('admin_token');
      const event = allEvents.find(e => e.id === selectedEventId);
      if (!event) return;

      const newCoordinatorIds = [...(event.coordinatorIds || []), coordinatorId];
      // Note: we're using the PUT /api/events/:id endpoint as Admin
      const res = await fetch(`http://localhost:5000/api/events/${selectedEventId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ coordinatorIds: newCoordinatorIds })
      });
      
      if (res.ok) {
        setSelectedEventId('');
        fetchData(); // Refresh UI
      } else {
        alert('Failed to assign event');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAssigning(false);
    }
  };

  const handleRemove = async (eventId: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      const event = coordinator.assignedEvents.find((e: any) => e.id === eventId);
      if (!event) return;

      const newCoordinatorIds = (event.coordinatorIds || []).filter((id: string) => id !== coordinatorId);
      
      const res = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ coordinatorIds: newCoordinatorIds })
      });
      
      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to remove event assignment');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;
  }

  if (!coordinator) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Coordinator not found</h2>
        <Button onClick={() => router.push('/admin/coordinators')} className="mt-4" variant="outline">
          Back to Coordinators
        </Button>
      </div>
    );
  }

  // Filter out events that are already assigned
  const unassignedEvents = allEvents.filter(e => !(e.coordinatorIds || []).includes(coordinatorId));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push('/admin/coordinators')} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Coordinator Details</h1>
          <p className="text-gray-500 mt-1">Manage events for {coordinator.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 col-span-1 h-fit">
          <div className="flex flex-col items-center text-center">
            <img 
              src={coordinator.avatar || 'https://via.placeholder.com/150'} 
              alt={coordinator.name} 
              className="h-24 w-24 rounded-full object-cover border-4 border-gray-50 mb-4"
            />
            <h2 className="text-xl font-bold text-navy-900">{coordinator.name}</h2>
            <p className="text-primary-600 font-medium mb-4">{coordinator.role}</p>
            
            <div className="w-full space-y-3 text-left border-t border-gray-100 pt-4">
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium">{coordinator.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Department</p>
                <p className="font-medium">{coordinator.department || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Assigned Events</p>
                <p className="font-medium">{coordinator.assignedEvents?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm col-span-1 md:col-span-2 flex flex-col">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-bold text-navy-900">Assigned Events</h3>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <select 
                className="flex-1 sm:w-64 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={selectedEventId}
                onChange={e => setSelectedEventId(e.target.value)}
              >
                <option value="">Select an event to assign</option>
                {unassignedEvents.map(event => (
                  <option key={event.id} value={event.id}>{event.title}</option>
                ))}
              </select>
              <Button onClick={handleAssign} disabled={!selectedEventId || assigning}>
                Assign
              </Button>
            </div>
          </div>

          <div className="p-0 flex-1">
            {coordinator.assignedEvents && coordinator.assignedEvents.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {coordinator.assignedEvents.map((event: any) => (
                  <li key={event.id} className="p-4 sm:px-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-navy-900">{event.title}</h4>
                        <p className="text-sm text-gray-500">{event.date} at {event.time}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => handleRemove(event.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3"
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Remove
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Shield className="h-12 w-12 text-gray-200 mb-3" />
                <p className="text-base font-medium text-navy-900">No events assigned</p>
                <p className="text-sm">Assign an event using the dropdown above.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
