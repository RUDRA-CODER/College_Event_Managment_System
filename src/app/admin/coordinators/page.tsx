"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Shield, Edit, Plus, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { API_BASE } from '@/services/api';
import { useToast } from '@/contexts/ToastContext';

export default function AdminCoordinators() {
  const { showSuccess, showError } = useToast();
  const [coordinators, setCoordinators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [coordinatorToDelete, setCoordinatorToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const emptyForm = {
    name: '',
    email: '',
    department: '',
    phone: '',
    coordinatorType: 'faculty',
    enrollmentNumber: '',
    semester: '',
    employeeId: '',
    designation: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    password: ''
  };

  const [newCoord, setNewCoord] = useState(emptyForm);

  const fetchCoordinators = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/admin/coordinators`, {
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
      const res = await fetch(`${API_BASE}/admin/coordinators`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCoord)
      });
      const data = await res.json();
      if (data.success) {
        showSuccess('Coordinator created successfully');
        setShowModal(false);
        setNewCoord({ ...emptyForm });
        fetchCoordinators();
      } else {
        showError(data.message || 'Failed to create coordinator');
      }
    } catch (err: any) {
      console.error(err);
      showError(err.message || 'An error occurred while creating the coordinator.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCoordinator = async () => {
    if (!coordinatorToDelete) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/admin/coordinators/${coordinatorToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showSuccess('Coordinator removed successfully');
        setDeleteModalOpen(false);
        setCoordinatorToDelete(null);
        fetchCoordinators();
      } else {
        showError(data.message || 'Failed to delete coordinator');
      }
    } catch (err: any) {
      console.error(err);
      showError(err.message || 'An error occurred while deleting the coordinator.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCoordinators = coordinators.filter(c => {
    const term = searchTerm.toLowerCase();
    return c.name.toLowerCase().includes(term) || 
           c.email.toLowerCase().includes(term) || 
           (c.department && c.department.toLowerCase().includes(term));
  });

  const isStudent = newCoord.coordinatorType === 'student';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Coordinator Management</h1>
          <p className="text-gray-500 mt-1">Manage event coordinators and their assignments.</p>
        </div>
        <Button onClick={() => { setNewCoord({ ...emptyForm }); setShowModal(true); }} className="gap-2">
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
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Assigned Events</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCoordinators.map((coordinator) => (
                  <tr key={coordinator.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {coordinator.profileImage ? (
                          <img src={coordinator.profileImage} alt={coordinator.name} className="h-10 w-10 rounded-full object-cover border border-gray-200" />
                        ) : (
                          <div className="h-10 w-10 rounded-full border border-gray-200 bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                            {coordinator.name?.charAt(0) || 'C'}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-navy-900">{coordinator.name}</div>
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
                      {coordinator.coordinatorType === 'student' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Student Coordinator
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          Faculty Coordinator
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-medium text-navy-900">
                        {coordinator.assignedEventsCount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/coordinators/${coordinator.id}`}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-10 w-10 p-0 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors" 
                            title="Edit Coordinator" 
                            aria-label="Edit Coordinator"
                          >
                            <Edit className="h-5 w-5" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-10 w-10 p-0 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors" 
                          title="Remove Coordinator" 
                          aria-label="Remove Coordinator"
                          onClick={() => { setCoordinatorToDelete(coordinator); setDeleteModalOpen(true); }}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCoordinators.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-navy-900">Add Coordinator</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCoordinator} className="p-6 overflow-y-auto max-h-[80vh] space-y-6">
              
              {/* Coordinator Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Coordinator Type <span className="text-red-500">*</span></label>
                <select
                  required
                  value={newCoord.coordinatorType}
                  onChange={e => setNewCoord({...emptyForm, coordinatorType: e.target.value})}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="faculty">Faculty Member</option>
                  <option value="student">Student Representative</option>
                </select>
              </div>

              {/* SECTION: Basic Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={newCoord.name}
                      onChange={e => setNewCoord({...newCoord, name: e.target.value})}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      required
                      autoComplete="off"
                      name="new_coordinator_email"
                      value={newCoord.email}
                      onChange={e => setNewCoord({...newCoord, email: e.target.value})}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter coordinator email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={newCoord.phone}
                      onChange={e => setNewCoord({...newCoord, phone: e.target.value})}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="10-digit number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={newCoord.gender}
                      onChange={e => setNewCoord({...newCoord, gender: e.target.value})}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={newCoord.dateOfBirth}
                      onChange={e => setNewCoord({...newCoord, dateOfBirth: e.target.value})}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: Academic/Professional Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2 mb-4">
                  {isStudent ? 'Academic Information' : 'Professional Information'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department <span className="text-red-500">*</span></label>
                    <select
                      required
                      value={newCoord.department}
                      onChange={e => setNewCoord({...newCoord, department: e.target.value})}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Engineering">Computer Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                    </select>
                  </div>
                  
                  {isStudent ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment No.</label>
                        <input
                          type="text"
                          value={newCoord.enrollmentNumber}
                          onChange={e => setNewCoord({...newCoord, enrollmentNumber: e.target.value})}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Enrollment number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                        <select
                          value={newCoord.semester}
                          onChange={e => setNewCoord({...newCoord, semester: e.target.value})}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                        >
                          <option value="">Select Semester</option>
                          {[1,2,3,4,5,6,7,8].map(sem => (
                            <option key={sem} value={String(sem)}>Semester {sem}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                        <input
                          type="text"
                          value={newCoord.employeeId}
                          onChange={e => setNewCoord({...newCoord, employeeId: e.target.value})}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Employee ID"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                        <input
                          type="text"
                          value={newCoord.designation}
                          onChange={e => setNewCoord({...newCoord, designation: e.target.value})}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="e.g. Assistant Professor"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* SECTION: Address Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2 mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={newCoord.address}
                      onChange={e => setNewCoord({...newCoord, address: e.target.value})}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter full address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={newCoord.city}
                      onChange={e => setNewCoord({...newCoord, city: e.target.value})}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={newCoord.state}
                      onChange={e => setNewCoord({...newCoord, state: e.target.value})}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={newCoord.pincode}
                      onChange={e => setNewCoord({...newCoord, pincode: e.target.value})}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Pincode"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: Security */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2 mb-4">Security</h3>
                <div className="max-w-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initial Password <span className="text-red-500">*</span></label>
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={newCoord.password}
                    onChange={e => setNewCoord({...newCoord, password: e.target.value})}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Create initial password"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-white pb-2 border-t border-gray-100">
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

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && coordinatorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Remove Coordinator</h2>
              <p className="text-gray-500 mb-6">
                Are you sure you want to remove <strong>{coordinatorToDelete.name}</strong>? This will also unassign them from any events they are currently coordinating. This action cannot be undone.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => { setDeleteModalOpen(false); setCoordinatorToDelete(null); }}
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
