"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, User, Hash, Mail, Phone, BookOpen, GraduationCap, Lock, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock Authentication
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoading(false);
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-12 xl:px-20 py-12 overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl">
          
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-navy-900 transition-colors mb-8 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to home
          </Link>

          <div>
            <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight">Create your account</h2>
            <p className="mt-2 text-gray-600">Join the CKPCET Events platform and never miss out.</p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleRegister} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" required className="block w-full pl-11 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-primary-600 focus:border-primary-600 sm:text-sm transition-all shadow-sm" placeholder="Rudra Patel" />
                  </div>
                </div>

                {/* Enrollment Number */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Enrollment Number</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Hash className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" required className="block w-full pl-11 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-primary-600 focus:border-primary-600 sm:text-sm transition-all shadow-sm" placeholder="22CE001" />
                  </div>
                </div>

                {/* College Email */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">College Email</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="email" required className="block w-full pl-11 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-primary-600 focus:border-primary-600 sm:text-sm transition-all shadow-sm" placeholder="rudra@ckpcet.ac.in" />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="tel" required className="block w-full pl-11 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-primary-600 focus:border-primary-600 sm:text-sm transition-all shadow-sm" placeholder="+91 98765 43210" />
                  </div>
                </div>

                {/* Department */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Department</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <BookOpen className="h-5 w-5 text-gray-400" />
                    </div>
                    <select required className="block w-full pl-11 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-primary-600 focus:border-primary-600 sm:text-sm appearance-none bg-white transition-all shadow-sm">
                      <option value="">Select Department</option>
                      <option value="CE">Computer Engineering</option>
                      <option value="IT">Information Technology</option>
                      <option value="Civil">Civil Engineering</option>
                      <option value="Mech">Mechanical Engineering</option>
                      <option value="Elect">Electrical Engineering</option>
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
                    <select required className="block w-full pl-11 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-primary-600 focus:border-primary-600 sm:text-sm appearance-none bg-white transition-all shadow-sm">
                      <option value="">Select Semester</option>
                      {[1,2,3,4,5,6,7,8].map(sem => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="password" required className="block w-full pl-11 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-primary-600 focus:border-primary-600 sm:text-sm transition-all shadow-sm" placeholder="••••••••" />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Check className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="password" required className="block w-full pl-11 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-primary-600 focus:border-primary-600 sm:text-sm transition-all shadow-sm" placeholder="••••••••" />
                  </div>
                </div>
              </div>

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

            <div className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-primary-600 hover:text-primary-500 transition-colors">
                Log in instead
              </Link>
            </div>
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
