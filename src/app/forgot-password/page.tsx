"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { API_BASE } from '@/services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_BASE}/auth/password/forgot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      });
      
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.message || 'Failed to process request');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="sm:mx-auto sm:w-full sm:max-w-md relative">
          <div className="bg-white py-8 px-4 shadow-xl shadow-primary-900/5 sm:rounded-2xl sm:px-10 border border-gray-100 text-center space-y-6">
             <div className="mx-auto w-16 h-16 bg-success-50 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-success-500" />
             </div>
             <h2 className="text-2xl font-bold text-navy-900">OTP Sent</h2>
             <p className="text-gray-600">
               If your email is registered, you will receive a 6-digit OTP shortly.
             </p>
             <Link href={`/reset-password?email=${encodeURIComponent(email)}&role=${role}`} className="block w-full">
               <Button variant="primary" fullWidth className="rounded-xl">
                 Enter OTP to Reset Password
               </Button>
             </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-96 bg-primary-600 rounded-b-[100px] sm:rounded-b-[200px] -z-0"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative">
        <Link href="/" className="inline-block mb-6">
          <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white rounded-full">
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to Home
          </Button>
        </Link>
        <h2 className="text-center text-4xl font-extrabold text-white mb-2">Forgot Password</h2>
        <p className="text-center text-primary-100 text-lg mb-8">
          Enter your email to receive an OTP
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative">
        <div className="bg-white py-8 px-4 shadow-xl shadow-primary-900/5 sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <div className="mt-2">
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="block w-full rounded-xl border-gray-300 py-3 pl-4 pr-10 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm bg-gray-50/50"
                >
                  <option value="student">Student</option>
                  <option value="coordinator">Coordinator</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border-gray-300 pl-10 py-3 focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-gray-50/50"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <Button 
                type="submit" 
                variant="primary" 
                fullWidth 
                disabled={loading}
                className="py-6 text-lg rounded-xl shadow-lg shadow-primary-500/20"
              >
                {loading ? 'Sending Request...' : 'Send OTP'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
