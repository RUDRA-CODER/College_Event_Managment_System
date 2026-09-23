"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function CoordinatorRegistrations() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('coordinator_token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const [regsRes, eventsRes] = await Promise.all([
        fetch('http://localhost:5000/api/coordinator/registrations', { headers }),
        fetch('http://localhost:5000/api/coordinator/events', { headers })
      ]);
      const regsData = await regsRes.json();
      const eventsData = await eventsRes.json();
      
      if (regsData.success) setRegistrations(regsData.data);
      if (eventsData.success) setEvents(eventsData.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('coordinator_token');
      const res = await fetch(`http://localhost:5000/api/registrations/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleUpdateAttendance = async (id: string, attendance: boolean) => {
    try {
      const token = localStorage.getItem('coordinator_token');
      const res = await fetch(`http://localhost:5000/api/registrations/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ attendance })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      alert('Failed to update attendance');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to cancel and delete this registration?')) {
      try {
        const token = localStorage.getItem('coordinator_token');
        const res = await fetch(`http://localhost:5000/api/registrations/${id}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          fetchData();
        }
      } catch (err) {
        alert('Failed to delete registration');
      }
    }
  };

  const filteredRegistrations = registrations.filter(r => {
    const matchesSearch = 
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.enrollmentNumber.includes(searchTerm);
    const matchesEvent = filterEvent === 'All' || r.eventId === filterEvent;
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
    
    return matchesSearch && matchesEvent && matchesStatus;
  });

  const getEventName = (eventId: string) => {
    const ev = events.find(e => e.id === eventId);
    return ev ? ev.title : eventId;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Registration Management</h1>
        <p className="text-gray-500 mt-1">Manage student registrations and attendance.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search student or enrollment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
          
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={filterEvent}
              onChange={(e) => setFilterEvent(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm appearance-none bg-white"
            >
              <option value="All">All Events</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>{ev.title}</option>
              ))}
            </select>
          </div>

          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm appearance-none bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
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
                  <th className="px-6 py-4 font-medium">Student Details</th>
                  <th className="px-6 py-4 font-medium">Event</th>
                  <th className="px-6 py-4 font-medium">Registration Date</th>
                  <th className="px-6 py-4 font-medium">Status & Attendance</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-navy-900">{reg.studentName}</div>
                      <div className="text-gray-500 text-xs mt-1">{reg.enrollmentNumber}</div>
                      <div className="text-gray-400 text-xs">{reg.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium">{getEventName(reg.eventId)}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {reg.registrationDate}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2 items-start">
                        {reg.status === 'confirmed' ? (
                          <Badge variant="success">Confirmed</Badge>
                        ) : reg.status === 'pending' ? (
                          <Badge variant="warning">Pending</Badge>
                        ) : (
                          <Badge variant="danger">Cancelled</Badge>
                        )}
                        
                        <div className="flex items-center gap-2">
                           <label className="text-xs text-gray-500 flex items-center gap-1 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={reg.attendance}
                                onChange={(e) => handleUpdateAttendance(reg.id, e.target.checked)}
                                className="rounded text-primary-600 focus:ring-primary-500"
                              />
                              Present
                           </label>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {reg.status !== 'confirmed' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleUpdateStatus(reg.id, 'confirmed')}
                            className="h-8 w-8 p-0 rounded-lg text-green-600 hover:bg-green-50"
                            title="Confirm Registration"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {reg.status !== 'cancelled' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleUpdateStatus(reg.id, 'cancelled')}
                            className="h-8 w-8 p-0 rounded-lg text-amber-600 hover:bg-amber-50"
                            title="Cancel Registration"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(reg.id)}
                          className="h-8 w-8 p-0 rounded-lg text-red-600 hover:bg-red-50"
                          title="Delete Registration"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRegistrations.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="h-12 w-12 text-gray-200 mb-3" />
                        <p className="text-base font-medium text-navy-900">No registrations found</p>
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
