"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { API_BASE } from '@/services/api';
import { useToast } from '@/contexts/ToastContext';

export default function CreateEventPage() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [coordinators, setCoordinators] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    category: 'Technical',
    maxParticipants: 100,
    coordinatorIds: [] as string[],
    image: '',
    registrationDeadline: '',
    status: 'upcoming',
    customFields: [] as { name: string; type: string; required: boolean; options: string[] }[]
  });

  useEffect(() => {
    const fetchCoordinators = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await fetch(`${API_BASE}/admin/coordinators`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
            setCoordinators(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch coordinators', err);
      }
    };
    fetchCoordinators();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomFieldChange = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const newFields = [...prev.customFields];
      newFields[index] = { ...newFields[index], [field]: value };
      return { ...prev, customFields: newFields };
    });
  };

  const addCustomField = () => {
    setFormData(prev => ({
      ...prev,
      customFields: [...prev.customFields, { name: '', type: 'text', required: false, options: [] }]
    }));
  };

  const removeCustomField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index)
    }));
  };

  const handleCoordinatorToggle = (id: string) => {
    setFormData(prev => {
      const current = prev.coordinatorIds;
      if (current.includes(id)) {
        return { ...prev, coordinatorIds: current.filter(c => c !== id) };
      } else {
        return { ...prev, coordinatorIds: [...current, id] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            ...formData,
            maxParticipants: parseInt(formData.maxParticipants.toString(), 10)
        })
      });

      const data = await res.json();
      if (data.success) {
        showSuccess('Event saved successfully.');
        router.push('/admin/events');
      } else {
        showError(data.message || 'Failed to create event');
      }
    } catch (err: any) {
      showError(err.message || 'Error creating event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-4">
        <Link href="/admin/events">
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Create New Event</h1>
          <p className="text-gray-500 mt-1">Fill in the details to create a new event.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-navy-900 border-b border-gray-100 pb-2">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter event title"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  placeholder="Describe the event..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                >
                  <option value="Technical">Technical</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter image URL"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-navy-900 border-b border-gray-100 pb-2">Schedule & Venue</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Deadline *</label>
                <input
                  type="date"
                  name="registrationDeadline"
                  required
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                <input
                  type="time"
                  name="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue *</label>
                <input
                  type="text"
                  name="venue"
                  required
                  value={formData.venue}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter venue"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-navy-900 border-b border-gray-100 pb-2">Capacity & Assignment</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Participants *</label>
                <input
                  type="number"
                  name="maxParticipants"
                  required
                  min="1"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assign Coordinators</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {coordinators.map(coord => (
                      <div 
                        key={coord.id} 
                        onClick={() => handleCoordinatorToggle(coord.id)}
                        className={`cursor-pointer p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                            formData.coordinatorIds.includes(coord.id) 
                            ? 'bg-primary-50 border-primary-500 shadow-sm' 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                          <input 
                            type="checkbox" 
                            checked={formData.coordinatorIds.includes(coord.id)} 
                            readOnly
                            className="h-4 w-4 text-primary-600 rounded border-gray-300"
                          />
                          <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{coord.name}</p>
                              <p className="text-xs text-gray-500 truncate">{coord.department}</p>
                          </div>
                      </div>
                  ))}
                  {coordinators.length === 0 && (
                      <p className="text-sm text-gray-500">No coordinators available.</p>
                  )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h2 className="text-lg font-semibold text-navy-900">Custom Fields</h2>
              <Button type="button" variant="outline" size="sm" onClick={addCustomField}>
                Add Field
              </Button>
            </div>
            
            {formData.customFields.map((field, index) => (
              <div key={index} className="flex gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Field Name</label>
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => handleCustomFieldChange(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    required
                  />
                </div>
                <div className="w-32">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={field.type}
                    onChange={(e) => handleCustomFieldChange(index, 'type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="textarea">Textarea</option>
                    <option value="boolean">Checkbox</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => handleCustomFieldChange(index, 'required', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600"
                  />
                  <span className="text-sm text-gray-700">Required</span>
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => removeCustomField(index)} 
                  className="h-10 w-10 p-0 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center justify-center shrink-0 transition-colors"
                  title="Remove Field"
                  aria-label="Remove Field"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
            <Link href="/admin/events" className="w-full sm:w-auto">
              <Button type="button" variant="outline" className="w-full sm:w-auto rounded-xl h-11 px-6">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="primary" className="w-full sm:w-auto gap-2 rounded-xl h-11 px-6" disabled={loading}>
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Create Event
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
