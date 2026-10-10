"use client";

import React, { useState, useEffect } from 'react';
import { Mail, Briefcase, Award, Save, User, MapPin, Phone, BookOpen, GraduationCap, Camera } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getToken } from '@/services/auth';
import { API_BASE } from '@/services/api';
import { useToast } from '@/contexts/ToastContext';

export default function CoordinatorProfile() {
  const { showSuccess, showError, showWarning } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getToken();
        const res = await fetch(`${API_BASE}/coordinator/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success) {
          setProfile(data.data);
          setFormData(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showError('Image must be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 200;
        let w = img.width, h = img.height;
        if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
        else { w = Math.round(w * MAX / h); h = MAX; }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setFormData((prev: any) => ({ ...prev, profileImage: dataUrl }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/coordinator/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        showSuccess('Profile updated successfully!');
        setIsEditing(false);
      } else {
        showError(data.message || 'Failed to update profile');
      }
    } catch (err: any) {
      console.error(err);
      showError(err.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  }

  if (!profile) {
    return <div>Profile not found.</div>;
  }

  const isStudent = profile?.coordinatorType === 'student';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Coordinator Profile</h1>
        <p className="text-gray-500 mt-1">Manage your personal and professional details.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header Cover */}
        <div className="h-32 bg-gradient-to-r from-primary-600 to-blue-800"></div>
        
        <div className="px-6 md:px-8 pb-8 relative">
          {/* Avatar */}
          <div className="flex justify-between items-end -mt-12 mb-8">
            <div className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden relative group">
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt={profile.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-slate-100 flex items-center justify-center text-primary-600">
                    <User className="h-10 w-10" />
                  </div>
                )}
                {isEditing && (
                  <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-6 w-6 text-white" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
                  </label>
                )}
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline" className="rounded-xl">
                Edit Profile
              </Button>
            ) : (
              <Button onClick={() => { setIsEditing(false); setFormData(profile); }} variant="ghost" className="rounded-xl text-gray-500">
                Cancel
              </Button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-navy-900 mb-4 flex items-center border-b border-gray-100 pb-2">
                <User className="w-5 h-5 mr-2 text-primary-500" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" name="name" value={formData.name || ''} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" name="email" value={formData.email || ''} disabled={true} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select name="gender" value={formData.gender || ''} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500 bg-white appearance-none">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth ? formData.dateOfBirth.split('T')[0] : ''} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500" />
                </div>
              </div>
            </div>

            {/* Professional/Academic Information */}
            <div>
              <h3 className="text-lg font-semibold text-navy-900 mb-4 flex items-center border-b border-gray-100 pb-2">
                {isStudent ? (
                  <><BookOpen className="w-5 h-5 mr-2 text-primary-500" /> Academic Information</>
                ) : (
                  <><Briefcase className="w-5 h-5 mr-2 text-primary-500" /> Professional Information</>
                )}
              </h3>
              {isStudent ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Number</label>
                    <input type="text" name="enrollmentNumber" value={formData.enrollmentNumber || ''} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select name="department" value={formData.department || ''} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500 bg-white appearance-none">
                      <option value="">Select Department</option>
                      <option value="Computer Engineering">Computer Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                    <select name="semester" value={formData.semester || ''} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500 bg-white appearance-none">
                      <option value="">Select Semester</option>
                      {[1,2,3,4,5,6,7,8].map(sem => (
                        <option key={sem} value={String(sem)}>Semester {sem}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select name="department" value={formData.department || ''} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500 bg-white appearance-none">
                      <option value="">Select Department</option>
                      <option value="Computer Engineering">Computer Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                    <input type="text" name="employeeId" value={formData.employeeId || ''} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                    <input type="text" name="designation" value={formData.designation || ''} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                </div>
              )}
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-semibold text-navy-900 mb-4 flex items-center border-b border-gray-100 pb-2">
                <MapPin className="w-5 h-5 mr-2 text-primary-500" /> Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input type="text" name="address" value={formData.address || ''} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" name="city" value={formData.city || ''} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input type="text" name="state" value={formData.state || ''} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input type="text" name="pincode" value={formData.pincode || ''} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500" />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100 mt-8">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditing(false)} 
                  disabled={saving}
                  className="w-full sm:w-auto rounded-xl h-11 px-6"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={saving}
                  className="w-full sm:w-auto gap-2 rounded-xl h-11 px-6 shadow-md shadow-primary-500/20"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Save Profile Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
