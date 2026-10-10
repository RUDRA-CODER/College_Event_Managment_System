"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/services/auth';
import { fetchMyStudentProfile, updateStudentProfile, changeStudentPassword } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { User, Mail, Hash, Phone, BookOpen, GraduationCap, Save, Shield, KeyRound, X, Camera } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export default function ProfilePage() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enrollmentNumber: '',
    department: '',
    semester: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    dateOfBirth: '',
    gender: 'Male',
    profileImage: ''
  });

  // Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    setIsClient(true);
    const isLoggedIn = !!getToken();
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const profile = await fetchMyStudentProfile();
        setFormData({
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          enrollmentNumber: profile.enrollmentNumber || '',
          department: profile.department || '',
          semester: profile.semester || '',
          address: profile.address || '',
          city: profile.city || '',
          state: profile.state || '',
          pincode: profile.pincode || '',
          dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
          gender: profile.gender || 'Male',
          profileImage: profile.profileImage || ''
        });
      } catch (err: any) {
        if (err.message.includes('Forbidden') || err.message.includes('jwt')) {
          router.push('/login');
        } else {
          setError(err.message || 'Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  if (!isClient) return null;

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
        setFormData((prev: typeof formData) => ({ ...prev, profileImage: dataUrl }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const updated = await updateStudentProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        semester: formData.semester,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : undefined,
        gender: formData.gender,
        profileImage: formData.profileImage
      });
      setIsEditing(false);
      showSuccess('Profile updated successfully!');
    } catch (err: any) {
      showError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    setPasswordSaving(true);
    try {
      await changeStudentPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordSuccess("Password changed successfully!");
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordSuccess(null);
      }, 2000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Student Profile</h1>
          <p className="text-gray-600">Manage your personal and academic information.</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-500">Loading profile...</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Cover & Avatar */}
          <div className="h-32 bg-navy-900 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 bg-white rounded-full p-1.5 shadow-md relative group">
                <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-primary-600 overflow-hidden">
                  {formData.profileImage ? (
                    <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-10 w-10" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-6 w-6 text-white" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="pt-16 px-4 sm:px-8 pb-6 sm:pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-gray-100 pb-6">
              <div>
                <h2 className="text-2xl font-bold text-navy-900">{formData.name}</h2>
                <p className="text-gray-500">{formData.enrollmentNumber} • {formData.department}</p>
              </div>
              <Button 
                variant={isEditing ? "outline" : "primary"} 
                onClick={() => setIsEditing(!isEditing)}
                className="h-11 px-5 rounded-xl self-start sm:self-auto"
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
                          placeholder={!isEditing && !formData.phone ? "Not specified" : ""}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        disabled={!isEditing}
                        value={formData.gender}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 appearance-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        disabled={!isEditing}
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                      />
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
                          <option value="1">Semester 1</option>
                          <option value="2">Semester 2</option>
                          <option value="3">Semester 3</option>
                          <option value="4">Semester 4</option>
                          <option value="5">Semester 5</option>
                          <option value="6">Semester 6</option>
                          <option value="7">Semester 7</option>
                          <option value="8">Semester 8</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-6 md:col-span-2">
                  <h3 className="text-lg font-semibold text-navy-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary-600" /> Address Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        placeholder={!isEditing && !formData.address ? "Not specified" : ""}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        placeholder={!isEditing && !formData.city ? "Not specified" : ""}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        placeholder={!isEditing && !formData.state ? "Not specified" : ""}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={formData.pincode}
                        onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                        placeholder={!isEditing && !formData.pincode ? "Not specified" : ""}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="pt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={saving} className="w-full sm:w-auto h-11 px-6 rounded-xl">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="w-full sm:w-auto gap-2 h-11 px-6 rounded-xl" disabled={saving}>
                    {saving ? (
                      <>
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" /> Save Changes
                      </>
                    )}
                  </Button>
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
              <p className="text-sm text-gray-500">Keep your account secure by using a strong password.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsPasswordModalOpen(true)}>Change Password</Button>
          </div>
        </div>
        </>
        )}

      </div>
      
      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-slate-50">
              <h3 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-primary-600" /> Change Password
              </h3>
              <button 
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleChangePassword} className="p-6">
              {passwordError && (
                <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="mb-4 bg-green-50 text-green-600 p-3 rounded-lg text-sm flex items-center gap-2">
                  {passwordSuccess}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsPasswordModalOpen(false)} disabled={passwordSaving}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={passwordSaving}>
                  {passwordSaving ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
