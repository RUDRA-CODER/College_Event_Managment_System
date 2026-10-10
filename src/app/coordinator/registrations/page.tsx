"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle, Trash2, ChevronLeft, Mail, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getToken } from '@/services/auth';
import { API_BASE } from '@/services/api';
import { useToast } from '@/contexts/ToastContext';
import { useConfirm } from '@/contexts/ConfirmContext';

export default function CoordinatorRegistrations() {
  const { showSuccess, showError, showWarning } = useToast();
  const { confirm } = useConfirm();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modal states for sending message
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const res = await fetch(`${API_BASE}/coordinator/events`, { 
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch events', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    if (!selectedEventId) return;
    try {
      setLoadingRegs(true);
      const token = getToken();
      const res = await fetch(`${API_BASE}/coordinator/registrations?eventId=${selectedEventId}`, { 
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        // If API doesn't filter by eventId yet, filter here
        const filtered = data.data.filter((r: any) => r.eventId === selectedEventId);
        setRegistrations(filtered);
      }
    } catch (err) {
      console.error('Failed to fetch registrations', err);
    } finally {
      setLoadingRegs(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchRegistrations();
    }
  }, [selectedEventId]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/registrations/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        showSuccess('Status updated successfully');
        fetchRegistrations();
      } else {
        showError(data.message || 'Failed to update status');
      }
    } catch (err: any) {
      showError(err.message || 'Failed to update status');
    }
  };

  const handleUpdateAttendance = async (id: string, attendance: boolean) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/registrations/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ attendance })
      });
      const data = await res.json();
      if (data.success) {
        showSuccess('Attendance updated');
        fetchRegistrations();
      } else {
        showError(data.message || 'Failed to update attendance');
      }
    } catch (err: any) {
      showError(err.message || 'Failed to update attendance');
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: 'Delete Registration',
      message: 'Are you sure you want to cancel and delete this registration?',
      confirmText: 'Delete',
      isDestructive: true
    });
    
    if (isConfirmed) {
      try {
        const token = getToken();
        const res = await fetch(`${API_BASE}/registrations/${id}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          showSuccess('Registration deleted');
          fetchRegistrations();
        } else {
          showError(data.message || 'Failed to delete registration');
        }
      } catch (err: any) {
        showError(err.message || 'Failed to delete registration');
      }
    }
  };

  const handleSendMessage = async () => {
    if (!messageSubject || !messageBody) {
      showWarning("Please provide both subject and body");
      return;
    }
    
    setSendingMessage(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/events/${selectedEventId}/notify`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: messageSubject,
          message: messageBody
        })
      });
      
      const data = await res.json();
      if (data.success) {
        showSuccess('Message sent successfully!');
        setShowMessageModal(false);
        setMessageSubject('');
        setMessageBody('');
      } else {
        showError(data.message || 'Failed to send message');
      }
    } catch (err: any) {
      showError(err.message || 'An error occurred while sending the message');
    } finally {
      setSendingMessage(false);
    }
  };

  const filteredRegistrations = registrations.filter(r => {
    const matchesSearch = 
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.enrollmentNumber.includes(searchTerm) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const selectedEvent = events.find(e => e.id === selectedEventId);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;
  }

  // EVENT SELECTION VIEW
  if (!selectedEventId) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Select Event</h1>
          <p className="text-gray-500 mt-1">Choose an event to manage its registrations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
              No events found.
            </div>
          ) : (
            events.map((ev) => (
              <div 
                key={ev.id} 
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between h-full"
                onClick={() => setSelectedEventId(ev.id)}
              >
                <div>
                  <h3 className="text-lg font-bold text-navy-900 mb-2">{ev.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{ev.description}</p>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                  <span className="text-xs font-medium text-gray-500 flex items-center">
                     <Users className="w-4 h-4 mr-1 text-primary-500" /> Manage Registrations
                  </span>
                  <Badge variant={ev.status === 'published' ? 'success' : 'secondary'}>
                    {ev.status || 'Draft'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // REGISTRATIONS VIEW
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <button 
            onClick={() => { setSelectedEventId(null); setRegistrations([]); }}
            className="flex items-center text-sm text-gray-500 hover:text-primary-600 mb-2 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Events
          </button>
          <h1 className="text-2xl font-bold text-navy-900">Registrations: {selectedEvent?.title}</h1>
          <p className="text-gray-500 mt-1">Manage student registrations and attendance for this event.</p>
        </div>
        
        <Button 
          onClick={() => setShowMessageModal(true)}
          className="flex items-center shadow-sm"
        >
          <Mail className="w-4 h-4 mr-2" />
          Send Message
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
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
          {loadingRegs ? (
             <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium">Student Details</th>
                  <th className="px-6 py-4 font-medium">Custom Data</th>
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
                      {reg.customData && Object.keys(reg.customData).length > 0 ? (
                        <div className="grid grid-cols-1 gap-2 bg-gray-50/80 p-3 rounded-lg border border-gray-100 min-w-[200px]">
                          {Object.entries(reg.customData).map(([k, v]) => (
                            <div key={k} className="flex flex-col">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{k}</span>
                              <span className="text-sm font-medium text-gray-700 truncate" title={v as string}>{v as string}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-sm">No custom fields</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs">
                      {new Date(reg.registrationDate).toLocaleDateString()}
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
                      <div className="flex items-center justify-end gap-2">
                        {reg.status !== 'confirmed' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleUpdateStatus(reg.id, 'confirmed')}
                            className="h-10 w-10 p-0 rounded-xl text-green-600 hover:bg-green-50 flex items-center justify-center transition-colors"
                            title="Confirm Registration"
                            aria-label="Confirm Registration"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </Button>
                        )}
                        {reg.status !== 'cancelled' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleUpdateStatus(reg.id, 'cancelled')}
                            className="h-10 w-10 p-0 rounded-xl text-amber-600 hover:bg-amber-50 flex items-center justify-center transition-colors"
                            title="Cancel Registration"
                            aria-label="Cancel Registration"
                          >
                            <XCircle className="h-5 w-5" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(reg.id)}
                          className="h-10 w-10 p-0 rounded-xl text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                          title="Delete Registration"
                          aria-label="Delete Registration"
                        >
                          <Trash2 className="h-5 w-5" />
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

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-navy-900 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-primary-600" />
                Message Registered Students
              </h3>
              <button 
                onClick={() => setShowMessageModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-500">
                This will send an email to all students currently registered for <strong>{selectedEvent?.title}</strong>.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="Event update..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Type your message here..."
                ></textarea>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <Button 
                variant="outline" 
                onClick={() => setShowMessageModal(false)}
                disabled={sendingMessage}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSendMessage}
                disabled={sendingMessage || !messageSubject || !messageBody}
                className="min-w-[120px]"
              >
                {sendingMessage ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
