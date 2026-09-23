"use client";

import React, { useState, useEffect } from 'react';
import { Mail, Shield, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    try {
        const storedData = JSON.parse(localStorage.getItem('admin_data') || '{}');
        setProfile(storedData);
    } catch (err) {
        console.error('Failed to fetch profile', err);
    } finally {
        setLoading(false);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save
    alert('Profile updated successfully (Mock)');
    setIsEditing(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  }

  if (!profile) {
    return <div>Profile not found.</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Admin Profile</h1>
        <p className="text-gray-500 mt-1">Manage your administrator account settings.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header Cover */}
        <div className="h-32 bg-gradient-to-r from-red-600 to-red-800"></div>
        
        <div className="px-6 md:px-8 pb-8 relative">
          {/* Avatar */}
          <div className="flex justify-between items-end -mt-12 mb-6">
            <div className="h-24 w-24 rounded-full border-4 border-white bg-red-100 shadow-md flex items-center justify-center relative">
                <span className="text-4xl font-bold text-red-600">{profile.name?.charAt(0) || 'A'}</span>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline" className="rounded-xl">
                Edit Profile
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(false)} variant="ghost" className="rounded-xl text-gray-500">
                Cancel
              </Button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  defaultValue={profile.name}
                  disabled={!isEditing}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    defaultValue={profile.email}
                    disabled={true} // Usually email is non-editable or requires verification
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    defaultValue={profile.role}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500 capitalize"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end pt-4 border-t border-gray-100 mt-8">
                <Button type="submit" variant="primary" className="gap-2 rounded-xl shadow-md shadow-primary-500/20">
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
