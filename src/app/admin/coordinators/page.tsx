"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, Shield, MoreVertical, Edit, Trash2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminCoordinators() {
  const [coordinators, setCoordinators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newCoord, setNewCoord] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCoordinators = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('http://localhost:5000/api/admin/coordinators', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) setCoordinators(data.data);
    } catch (err) {
      console.error('Failed to fetch coordinators', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoordinators();
  }, []);

  const handleCreateCoordinator = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('http://localhost:5000/api/admin/coordinators', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCoord)
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setNewCoord({ name: '', email: '' });
        fetchCoordinators();
      } else {
        alert(data.message || 'Failed to create coordinator');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while creating the coordinator.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCoordinators = coordinators.filter(c => {
    const term = searchTerm.toLowerCase();
    return c.name.toLowerCase().includes(term) || 
           c.email.toLowerCase().includes(term) || 
           (c.department && c.department.toLowerCase().includes(term));
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Coordinator Management</h1>
          <p className="text-gray-500 mt-1">Manage event coordinators and their assignments.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Coordinator
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search coordinators by name, email or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium">Coordinator</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Department</th>
                  <th className="px-6 py-4 font-medium">Assigned Events</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCoordinators.map((coordinator) => (
                  <tr key={coordinator.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={coordinator.avatar || 'https://via.placeholder.com/150'} alt={coordinator.name} className="h-10 w-10 rounded-full object-cover border border-gray-200" />
                        <div>
                          <div className="font-medium text-navy-900">{coordinator.name}</div>
                          <div className="text-gray-500 text-xs mt-1 capitalize">{coordinator.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{coordinator.email}</div>
                      <div className="text-gray-500 text-xs mt-1">{coordinator.phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {coordinator.department || 'Unassigned'}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-medium text-navy-900">
                        {coordinator.assignedEventsCount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50" title="Edit Coordinator" onClick={() => window.location.href=`/admin/coordinators/${coordinator.id}`}>
                           <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCoordinators.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Shield className="h-12 w-12 text-gray-200 mb-3" />
                        <p className="text-base font-medium text-navy-900">No coordinators found</p>
                        <p className="text-sm">Try adjusting your search.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-navy-900">Add Coordinator</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCoordinator} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newCoord.name}
                  onChange={e => setNewCoord({...newCoord, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newCoord.email}
                  onChange={e => setNewCoord({...newCoord, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="john.doe@ckpcet.ac.in"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Coordinator'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
