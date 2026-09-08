"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockUser } from '@/data/user';
import { Button } from '@/components/ui/Button';
import { User, Mail, Hash, Phone, BookOpen, GraduationCap, Save, Shield } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(mockUser);

  useEffect(() => {
    setIsClient(true);
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [router]);

  if (!isClient) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save
    setIsEditing(false);
    alert('Profile updated successfully! (Mock)');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Student Profile</h1>
          <p className="text-gray-600">Manage your personal and academic information.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Cover & Avatar */}
          <div className="h-32 bg-navy-900 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 bg-white rounded-full p-1.5 shadow-md">
                <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-primary-600">
                  <User className="h-10 w-10" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-16 px-8 pb-8">
            <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
              <div>
                <h2 className="text-2xl font-bold text-navy-900">{formData.name}</h2>
                <p className="text-gray-500">{formData.enrollmentNumber} • {formData.department}</p>
              </div>
              <Button 
                variant={isEditing ? "outline" : "primary"} 
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </Button>
            </div>

            <form onSubmit={handleSave}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-navy-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary-600" /> Personal Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          disabled={!isEditing}
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          disabled={!isEditing}
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-navy-900 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary-600" /> Academic Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Hash className="h-4 w-4 text-gray-400" />
                        </div>
                        {/* Enrollment number usually cannot be changed */}
                        <input
                          type="text"
                          disabled={true}
                          value={formData.enrollmentNumber}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 sm:text-sm"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Enrollment number cannot be changed.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <BookOpen className="h-4 w-4 text-gray-400" />
                        </div>
                        <select
                          disabled={!isEditing}
                          value={formData.department}
                          onChange={(e) => setFormData({...formData, department: e.target.value})}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 appearance-none"
                        >
                          <option value="Computer Engineering">Computer Engineering</option>
                          <option value="Information Technology">Information Technology</option>
                          <option value="Civil Engineering">Civil Engineering</option>
                          <option value="Mechanical Engineering">Mechanical Engineering</option>
                          <option value="Electrical Engineering">Electrical Engineering</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <GraduationCap className="h-4 w-4 text-gray-400" />
                        </div>
                        <select
                          disabled={!isEditing}
                          value={formData.semester}
                          onChange={(e) => setFormData({...formData, semester: e.target.value})}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 appearance-none"
                        >
                          <option value="1st Semester">1st Semester</option>
                          <option value="2nd Semester">2nd Semester</option>
                          <option value="3rd Semester">3rd Semester</option>
                          <option value="4th Semester">4th Semester</option>
                          <option value="5th Semester">5th Semester</option>
                          <option value="6th Semester">6th Semester</option>
                          <option value="7th Semester">7th Semester</option>
                          <option value="8th Semester">8th Semester</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button type="submit" variant="primary" className="gap-2"><Save className="h-4 w-4" /> Save Changes</Button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Security Settings - Static */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-red-50 text-red-600 p-3 rounded-lg"><Shield className="h-6 w-6" /></div>
            <div>
              <h3 className="text-lg font-semibold text-navy-900">Security Settings</h3>
              <p className="text-sm text-gray-500">Manage your password and account security.</p>
            </div>
          </div>
          <div className="flex items-center justify-between border border-gray-100 rounded-lg p-4 bg-slate-50">
            <div>
              <p className="font-medium text-navy-900">Password</p>
              <p className="text-sm text-gray-500">Last changed 3 months ago</p>
            </div>
            <Button variant="outline" size="sm">Change Password</Button>
          </div>
        </div>

      </div>
    </div>
  );
}
