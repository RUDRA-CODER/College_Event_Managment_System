"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Calendar, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { API_BASE } from '@/services/api';
import { useToast } from '@/contexts/ToastContext';

export default function CoordinatorDetail() {
  const params = useParams();
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const coordinatorId = params.id as string;

  const [coordinator, setCoordinator] = useState<any>(null);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      
      // Fetch coordinator details & assigned events
      const coordRes = await fetch(`${API_BASE}/admin/coordinators/${coordinatorId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const coordData = await coordRes.json();
      
      // Fetch all events for the dropdown
      const eventsRes = await fetch(`${API_BASE}/events`, {
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
      const res = await fetch(`${API_BASE}/events/${selectedEventId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ coordinatorIds: newCoordinatorIds })
      });
      
      if (res.ok) {
        showSuccess('Event assigned successfully');
        setSelectedEventId('');
        fetchData(); // Refresh UI
      } else {
        showError('Failed to assign event');
      }
    } catch (err: any) {
      console.error(err);
      showError(err.message || 'Failed to assign event');
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
      
      const res = await fetch(`${API_BASE}/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ coordinatorIds: newCoordinatorIds })
      });
      
      if (res.ok) {
        showSuccess('Event removed successfully');
        fetchData();
      } else {
        showError('Failed to remove event assignment');
      }
    } catch (err: any) {
      console.error(err);
      showError(err.message || 'Failed to remove event assignment');
    }
  };

  const handleDeleteCoordinator = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/admin/coordinators/${coordinatorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showSuccess('Coordinator removed successfully');
        router.push('/admin/coordinators');
      } else {
        showError(data.message || 'Failed to delete coordinator');
        setIsDeleting(false);
        setDeleteModalOpen(false);
      }
    } catch (err: any) {
      console.error(err);
      showError(err.message || 'An error occurred while deleting the coordinator.');
      setIsDeleting(false);
      setDeleteModalOpen(false);
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
            {coordinator.profileImage ? (
              <img 
                src={coordinator.profileImage}
                alt={coordinator.name} 
                className="h-24 w-24 rounded-full object-cover border-4 border-gray-50 mb-4"
              />
            ) : (
              <div className="h-24 w-24 rounded-full border-4 border-gray-50 mb-4 bg-primary-100 text-primary-700 flex items-center justify-center text-2xl font-bold">
                {coordinator.name?.charAt(0) || 'C'}
              </div>
            )}
            <h2 className="text-xl font-bold text-navy-900">{coordinator.name}</h2>
            <div className="mt-1 mb-4">
              {coordinator.coordinatorType === 'student' ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  Student Coordinator
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  Faculty Coordinator
                </span>
              )}
            </div>
            
            <div className="w-full space-y-3 text-left border-t border-gray-100 pt-4">
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium">{coordinator.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Department</p>
                <p className="font-medium">{coordinator.department || 'Unassigned'}</p>
              </div>
              {coordinator.coordinatorType === 'student' ? (
                <>
                  <div>
                    <p className="text-xs text-gray-500">Enrollment Number</p>
                    <p className="font-medium">{coordinator.enrollmentNumber || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Semester</p>
                    <p className="font-medium">{coordinator.semester ? `Semester ${coordinator.semester}` : 'Not specified'}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-xs text-gray-500">Employee ID</p>
                    <p className="font-medium">{coordinator.employeeId || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Designation</p>
                    <p className="font-medium">{coordinator.designation || 'Not specified'}</p>
                  </div>
                </>
              )}
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-medium">{coordinator.phone || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Assigned Events</p>
                <p className="font-medium">{coordinator.assignedEvents?.length || 0}</p>
              </div>
            </div>

            <div className="w-full mt-6 pt-4 border-t border-gray-100">
              <Button 
                variant="outline" 
                className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                onClick={() => setDeleteModalOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Coordinator
              </Button>
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
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-10 px-4 rounded-xl flex items-center justify-center transition-colors min-w-[40px] min-h-[40px]"
                      title="Remove Event Assignment"
                      aria-label="Remove Event Assignment"
                    >
                      <Trash2 className="h-5 w-5 mr-2" /> Remove
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

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Remove Coordinator</h2>
              <p className="text-gray-500 mb-6">
                Are you sure you want to remove <strong>{coordinator.name}</strong>? This will also unassign them from any events they are currently coordinating. This action cannot be undone.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={handleDeleteCoordinator} 
                  disabled={isDeleting}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white border-transparent"
                >
                  {isDeleting ? 'Removing...' : 'Remove Coordinator'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
