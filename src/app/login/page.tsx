"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock Authentication
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoading(false);
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-navy-900 transition-colors mb-8 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to home
          </Link>

          <div>
            <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight">Welcome back</h2>
            <p className="mt-2 text-gray-600">Please enter your details to sign in.</p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleLogin} className="space-y-6">
              
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">Email or Enrollment No.</label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-primary-600 focus:border-primary-600 sm:text-sm transition-all shadow-sm"
                    placeholder="e.g. 22CE001"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-primary-600 focus:border-primary-600 sm:text-sm transition-all shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                    Remember for 30 days
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              <Button 
                type="submit" 
                fullWidth 
                size="lg" 
                className="gap-2 h-12 rounded-xl shadow-md shadow-primary-500/20 text-base"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : <><LogIn className="h-5 w-5" /> Sign in</>}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="font-bold text-primary-600 hover:text-primary-500 transition-colors">
                Sign up
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
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-16 text-white animate-fade-up">
          <blockquote className="space-y-6">
            <p className="text-3xl font-medium leading-tight">
              "The new events portal has completely changed how we experience campus life. Everything is just one click away."
            </p>
            <footer className="text-lg text-primary-300 font-semibold">
              — Student Council, CKPCET
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
