"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { API_BASE } from '@/services/api';
import { getToken } from '@/services/auth';
import { useToast } from '@/contexts/ToastContext';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    category: 'Technical',
    maxParticipants: 100,
    image: '',
    registrationDeadline: '',
    customFields: [] as { name: string; type: string; required: boolean }[]
  });

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/events/${id}`);
        const data = await res.json();
        
        if (data.success) {
            setFormData({
                ...data.data,
                customFields: data.data.customFields || []
            });
        } else {
            router.push('/coordinator/events');
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCustomField = () => {
    setFormData(prev => ({
        ...prev,
        customFields: [...prev.customFields, { name: '', type: 'text', required: false }]
    }));
  };

  const handleRemoveCustomField = (index: number) => {
    setFormData(prev => ({
        ...prev,
        customFields: prev.customFields.filter((_, i) => i !== index)
    }));
  };

  const handleCustomFieldChange = (index: number, field: string, value: any) => {
    setFormData(prev => {
        const updatedFields = [...prev.customFields];
        updatedFields[index] = { ...updatedFields[index], [field]: value };
        return { ...prev, customFields: updatedFields };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const token = getToken() || (typeof window !== 'undefined' ? localStorage.getItem('coordinator_token') : null);
      const { id: _omitId, _id, registrationCount, createdAt, updatedAt, __v, ...cleanPayload } = formData as any;
      const res = await fetch(`${API_BASE}/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            ...cleanPayload,
            maxParticipants: parseInt(formData.maxParticipants?.toString() || '100', 10)
        })
      });

      const data = await res.json();
      if (data.success) {
        showSuccess('Event saved successfully.');
        router.push(`/coordinator/events/${id}`);
      } else {
        showError(data.message || 'Failed to update event');
      }
    } catch (err: any) {
      showError(err.message || 'Error updating event');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
      return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-4">
        <Link href={`/coordinator/events/${id}`}>
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Edit Event</h1>
          <p className="text-gray-500 mt-1">Update details for {formData.title}.</p>
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
                  value={formData.registrationDeadline || ''}
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
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-navy-900 border-b border-gray-100 pb-2">Capacity</h2>
            
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
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h2 className="text-lg font-semibold text-navy-900">Custom Registration Fields</h2>
                <Button type="button" onClick={handleAddCustomField} variant="outline" size="sm" className="h-8 rounded-lg gap-2 text-primary-600 border-primary-200 hover:bg-primary-50">
                    <Plus className="h-4 w-4" /> Add Field
                </Button>
            </div>
            
            {formData.customFields.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-sm text-gray-500">No custom fields defined. Students will only provide basic details.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {formData.customFields.map((field, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50 items-start sm:items-center">
                            <div className="flex-1 w-full">
                                <label className="block text-xs font-medium text-gray-600 mb-1">Field Name (e.g., T-Shirt Size)</label>
                                <input
                                    type="text"
                                    required
                                    value={field.name}
                                    onChange={(e) => handleCustomFieldChange(idx, 'name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                                    placeholder="Enter field name"
                                />
                            </div>
                            <div className="w-full sm:w-48">
                                <label className="block text-xs font-medium text-gray-600 mb-1">Input Type</label>
                                <select
                                    value={field.type}
                                    onChange={(e) => handleCustomFieldChange(idx, 'type', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                                >
                                    <option value="text">Short Text</option>
                                    <option value="textarea">Long Text (Textarea)</option>
                                    <option value="number">Number</option>
                                    <option value="boolean">Checkbox</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2 mt-2 sm:mt-6">
                                <label className="flex items-center gap-2 cursor-pointer text-sm">
                                    <input
                                        type="checkbox"
                                        checked={field.required}
                                        onChange={(e) => handleCustomFieldChange(idx, 'required', e.target.checked)}
                                        className="h-4 w-4 text-primary-600 rounded border-gray-300"
                                    />
                                    Required
                                </label>
                                <Button
                                    type="button"
                                    onClick={() => handleRemoveCustomField(idx)}
                                    variant="ghost"
                                    className="h-10 w-10 p-0 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 ml-3 inline-flex items-center justify-center"
                                    title="Remove Field"
                                    aria-label="Remove Field"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
            <Link href={`/coordinator/events/${id}`} className="w-full sm:w-auto">
              <Button type="button" variant="outline" className="w-full sm:w-auto rounded-xl h-11 px-6">
                Cancel
              </Button>
            </Link>
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full sm:w-auto gap-2 rounded-xl h-11 px-6 shadow-md shadow-primary-500/20" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
