"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  UserPlus, User, Hash, Mail, Phone, BookOpen, 
  GraduationCap, Lock, Check, ArrowLeft, Calendar, 
  Users, MapPin, Building, Map, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { setToken } from '@/services/auth';
import { registerStudent, verifyEmail } from '@/services/api';
import { useToast } from '@/contexts/ToastContext';

export default function RegisterPage() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState('');
  
  // Updated state for all fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    enrollmentNumber: '',
    department: '',
    semester: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showError("Passwords do not match");
      return;
    }
    setIsLoading(true);

    try {
      const data = await registerStudent({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        enrollmentNumber: formData.enrollmentNumber,
        department: formData.department,
        semester: formData.semester,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        password: formData.password
      });
      if (data.success && data.requiresVerification) {
        setStep(2);
      } else if (data.success) {
        setToken(data.token);
        showSuccess("Registration successful!");
        router.push('/dashboard');
      } else {
        showError(data.message || 'Signup failed');
      }
    } catch(err: any) {
      showError(err.message || 'Failed to connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await verifyEmail({ email: formData.email, otp });
      if (data.success) {
        setToken(data.token);
        showSuccess("Email verified successfully!");
        router.push('/dashboard');
      } else {
        showError(data.message || 'Verification failed');
      }
    } catch(err: any) {
      showError(err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-12 xl:px-20 py-12 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl">
          
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-navy-900 transition-colors mb-8 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to home
          </Link>

          <div>
            <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight">
              {step === 1 ? 'Student Registration' : 'Verify Your Email'}
            </h2>
            <p className="mt-2 text-gray-600">
              {step === 1 ? 'Create your profile to access events and dashboard.' : `We've sent a 6-digit verification code to ${formData.email}`}
            </p>
          </div>

          <div className="mt-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            {step === 1 ? (
              <form onSubmit={handleRegister} className="space-y-8">
              
              {/* SECTION: Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required autoComplete="name" className="block w-full pl-11 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-600 focus:border-primary-600 sm:text-sm transition-all shadow-sm" placeholder="Enter your full name" />
                    </div>
                  </div>

                  {/* College Email */}
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">College Email</label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email" className="block w-full pl-11 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-600 focus:border-primary-600 sm:text-sm transition-all shadow-sm" placeholder="student@ckpcet.ac.in" />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required autoComplete="tel" className="block w-full pl-11 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-600 focus:border-primary-600 sm:text-sm transition-all shadow-sm" placeholder="10-digit number" />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Gender</label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-gray-400" />
                      </div>
                      <select required name="gender" value={formData.gender} onChange={handleChange} className="block w-full pl-11 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-600 focus:border-primary-600 sm:text-sm appearance-none bg-white transition-all shadow-sm">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Date of Birth</label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className="block w-full pl-11 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-600 focus:border-primary-600 sm:text-sm transition-all shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: Academic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4 mt-6">Academic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Enrollment Number */}
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Enrollment Number</label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Hash className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" name="enrollmentNumber" value={formData.enrollmentNumber} onChange={handleChange} required className="block w-full pl-11 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-600 focus:border-primary-600 sm:text-sm transition-all shadow-sm" placeholder="e.g. 123456789012" />
                    </div>
                  </div>

                  {/* Department */}
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Department</label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <BookOpen className="h-5 w-5 text-gray-400" />
                      </div>
                      <select required name="department" value={formData.department} onChange={handleChange} className="block w-full pl-11 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-600 focus:border-primary-600 sm:text-sm appearance-none bg-white transition-all shadow-sm">
                        <option value="">Select Department</option>
                        <option value="Computer Engineering">Computer Engineering</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Civil Engineering">Civil Engineering</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Electrical Engineering">Electrical Engineering</option>
                      </select>
                    </div>
                  </div>

                  {/* Semester */}
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Semester</label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <GraduationCap className="h-5 w-5 text-gray-400" />
                      </div>
                      <select required name="semester" value={formData.semester} onChange={handleChange} className="block w-full pl-11 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-600 focus:border-primary-600 sm:text-sm appearance-none bg-white transition-all shadow-sm">
                        <option value="">Select Semester</option>
                        {[1,2,3,4,5,6,7,8].map(sem => (
                          <option key={sem} value={sem}>Semester {sem}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: Address Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4 mt-6">Address Information</h3>
                <div className="space-y-6">
                  {/* Address */}
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Full Address</label>
                    <div className="relative mt-1">
                      <div className="absolute top-3 left-0 pl-3.5 flex items-start pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea name="address" value={formData.address} onChange={handleChange} required rows={2} className="block w-full pl-11 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-600 focus:border-primary-600 sm:text-sm transition-all shadow-sm" placeholder="Enter your full residential address" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* City */}
                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-700">City</label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Building className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} required className="block w-full pl-11 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-600 focus:border-primary-600 sm:text-sm transition-all shadow-sm" placeholder="City" />
                      </div>
                    </div>

                    {/* State */}
                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-700">State</label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Map className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="text" name="state" value={formData.state} onChange={handleChange} required className="block w-full pl-11 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-600 focus:border-primary-600 sm:text-sm transition-all shadow-sm" placeholder="State" />
                      </div>
                    </div>

                    {/* Pincode */}
                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-700">Pincode</label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required className="block w-full pl-11 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-600 focus:border-primary-600 sm:text-sm transition-all shadow-sm" placeholder="Pincode" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: Security */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4 mt-6">Security</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Password */}
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Password</label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="password" name="password" value={formData.password} onChange={handleChange} required autoComplete="new-password" className="block w-full pl-11 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-600 focus:border-primary-600 sm:text-sm transition-all shadow-sm" placeholder="Create a secure password" />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Check className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required autoComplete="new-password" className="block w-full pl-11 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-600 focus:border-primary-600 sm:text-sm transition-all shadow-sm" placeholder="Re-enter your password" />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: Consent */}
              <div className="flex items-center pt-4">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  I agree to the <a href="#" className="text-primary-600 hover:underline">terms and conditions</a> and <a href="#" className="text-primary-600 hover:underline">privacy policy</a>.
                </label>
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  fullWidth 
                  size="lg" 
                  className="gap-2 h-12 rounded-xl shadow-md shadow-primary-500/20 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : <><UserPlus className="h-5 w-5" /> Create Account</>}
                </Button>
              </div>
            </form>
            ) : (
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Verification Code</label>
                  <input 
                    type="text" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    required 
                    maxLength={6}
                    autoComplete="one-time-code"
                    className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-primary-600 focus:border-primary-600 sm:text-center sm:text-2xl tracking-widest transition-all shadow-sm" 
                    placeholder="Enter 6-digit code" 
                  />
                </div>
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    fullWidth 
                    size="lg" 
                    className="gap-2 h-12 rounded-xl shadow-md shadow-primary-500/20 text-base"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? 'Verifying...' : 'Verify Email'}
                  </Button>
                </div>
                <div className="text-center">
                   <button type="button" onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-primary-600">
                     Change Email
                   </button>
                </div>
              </form>
            )}

            {step === 1 && (
              <div className="mt-8 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-bold text-primary-600 hover:text-primary-500 transition-colors">
                  Log in instead
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block relative w-0 flex-1 overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src="/campus.jpg"
          alt="CKPCET Campus"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-16 text-white animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white mb-6">
            <span className="text-sm font-semibold">Join 1,200+ students</span>
          </div>
          <h3 className="text-4xl font-bold leading-tight mb-4">
            Unlock your campus experience.
          </h3>
          <p className="text-lg text-gray-200">
            Register for workshops, participate in cultural fests, and build your extracurricular portfolio all in one place.
          </p>
        </div>
      </div>
    </div>
  );
}
