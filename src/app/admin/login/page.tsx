"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('admin_token', data.data.token);
        localStorage.setItem('admin_data', JSON.stringify(data.data.admin));
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Failed to connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-slate-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 z-10 bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/50">
        <div className="text-center">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <div className="h-16 w-16 mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-3">
              <img
                src="/logo.png"
                alt="CKPCET Logo"
                className="h-full w-full object-contain"
              />
            </div>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-navy-900 tracking-tight">
            Admin Portal
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to manage the entire event system
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-start gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm bg-white/50"
                  placeholder="admin@ckpcet.ac.in"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm bg-white/50"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <Button 
              type="submit" 
              variant="primary" 
              fullWidth 
              size="lg"
              className="group rounded-xl py-3 shadow-md shadow-primary-500/20"
              disabled={loading}
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? 'Signing in...' : 'Sign in to Portal'}
                {!loading && <LogIn className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
              </span>
            </Button>
          </div>
          
          <div className="text-center mt-4">
             <p className="text-xs text-gray-500">Hint: use <span className="font-semibold text-gray-700">admin@ckpcet.ac.in</span> and any password.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
