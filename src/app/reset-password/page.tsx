"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { KeyRound, Mail, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import { API_BASE } from '@/services/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const email = searchParams.get('email');
  const role = searchParams.get('role');

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!email || !role) {
     return (
        <div className="p-8 text-center space-y-4">
           <p className="text-red-500 font-medium">Invalid or missing email parameters.</p>
           <Link href="/forgot-password">
             <Button variant="outline">Request New Reset OTP</Button>
           </Link>
        </div>
     );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
    }
    
    try {
      const res = await fetch(`${API_BASE}/auth/password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, token: otp, newPassword })
      });
      
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
        <div className="py-8 px-4 text-center space-y-6">
           <div className="mx-auto w-16 h-16 bg-success-50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-success-500" />
           </div>
           <h2 className="text-2xl font-bold text-navy-900">Password Reset Successful</h2>
           <p className="text-gray-600">
             Your password has been changed successfully. You can now login with your new password.
           </p>
           <Link href={role === 'student' ? '/login' : role === 'coordinator' ? '/coordinator/login' : '/admin/login'} className="block w-full mt-6">
             <Button variant="primary" fullWidth className="rounded-xl">
               Go to Login
             </Button>
           </Link>
        </div>
    );
  }

  return (
    <form className="space-y-6 px-4 py-6" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
          Verification Code (OTP)
        </label>
        <div className="mt-2 relative">
          <input
            id="otp"
            name="otp"
            type="text"
            required
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            autoComplete="one-time-code"
            className="block w-full rounded-xl border-gray-300 px-3 py-3 focus:border-primary-500 focus:ring-primary-500 sm:text-center sm:text-2xl tracking-widest bg-gray-50/50"
            placeholder="Enter 6-digit code"
          />
        </div>
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
          New Password
        </label>
        <div className="mt-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            className="block w-full rounded-xl border-gray-300 pl-10 py-3 focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-gray-50/50"
            placeholder="Create a new password"
            minLength={6}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <div className="mt-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            className="block w-full rounded-xl border-gray-300 pl-10 py-3 focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-gray-50/50"
            placeholder="Re-enter your new password"
            minLength={6}
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
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-96 bg-primary-600 rounded-b-[100px] sm:rounded-b-[200px] -z-0"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative">
        <h2 className="text-center text-4xl font-extrabold text-white mb-2">Reset Password</h2>
        <p className="text-center text-primary-100 text-lg mb-8">
          Enter your new password below.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative">
        <div className="bg-white py-2 px-2 shadow-xl shadow-primary-900/5 sm:rounded-2xl sm:px-4 border border-gray-100">
           <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
             <ResetPasswordForm />
           </Suspense>
        </div>
      </div>
    </div>
  );
}
