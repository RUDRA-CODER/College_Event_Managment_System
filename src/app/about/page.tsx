"use client";

import React from 'react';
import Image from 'next/image';
import { Target, Users, Zap, Shield, ChevronRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      
      {/* Hero */}
      <div className="relative bg-navy-900 py-32 text-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/campus.jpg')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/80 to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto animate-fade-up">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-white text-sm font-semibold rounded-full backdrop-blur-md border border-white/20 mb-6">
            Our Story
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">About CKPCET Events</h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto font-medium">
            One platform to discover, explore and participate in campus life at C. K. Pithawala College of Engineering and Technology.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy-900 mb-6 tracking-tight">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              The CKPCET Event Management System was created to unify the campus experience. Our goal is to connect students with opportunities, experiences, and campus events seamlessly.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-10">
              Whether you're looking to showcase your talents in a cultural fest, enhance your skills in a technical workshop, or represent your department in sports, this platform brings every opportunity directly to your dashboard.
            </p>

            <div className="space-y-8">
              <div className="flex gap-5 group">
                <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl shrink-0 group-hover:scale-110 group-hover:bg-blue-100 transition-all">
                  <Target className="h-7 w-7" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-navy-900 mb-1">Discover</h4>
                  <p className="text-gray-600 text-lg">Easily find events that match your interests from across all departments.</p>
                </div>
              </div>
              <div className="flex gap-5 group">
                <div className="bg-orange-50 text-orange-600 p-4 rounded-2xl shrink-0 group-hover:scale-110 group-hover:bg-orange-100 transition-all">
                  <Zap className="h-7 w-7" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-navy-900 mb-1">Engage</h4>
                  <p className="text-gray-600 text-lg">Register with a single click and manage your schedule effectively.</p>
                </div>
              </div>
              <div className="flex gap-5 group">
                <div className="bg-green-50 text-green-600 p-4 rounded-2xl shrink-0 group-hover:scale-110 group-hover:bg-green-100 transition-all">
                  <Users className="h-7 w-7" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-navy-900 mb-1">Connect</h4>
                  <p className="text-gray-600 text-lg">Build your network by participating in inter-departmental and college-wide activities.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 animate-fade-up group" style={{ animationDelay: '0.2s' }}>
            <img 
              src="/campus.jpg" 
              alt="CKPCET Campus Life" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />
            <div className="absolute bottom-10 left-10 right-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white mb-4">
                <span className="text-sm font-semibold tracking-wide uppercase">Digital Campus</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">Enhancing Student Engagement</h3>
              <p className="text-lg text-primary-100 font-medium">A digital ecosystem designed exclusively for CKPCET students.</p>
            </div>
          </div>
        </div>
      </div>

      {/* College Info Section */}
      <div className="bg-slate-50 py-24 border-t border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-primary-300 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-lg shadow-primary-600/10 mb-8 border border-gray-100">
            <Shield className="h-10 w-10 text-primary-600" />
          </div>
          <h2 className="text-4xl font-extrabold text-navy-900 mb-6 tracking-tight">About CKPCET</h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            C. K. Pithawala College of Engineering and Technology is a premier engineering institute in Surat, Gujarat. Managed by the Navyug Vidyabhavan Trust, the college is dedicated to providing quality technical education and fostering holistic student development.
          </p>
          <a 
            href="https://ckpcet.ac.in/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-navy-900 font-bold rounded-xl shadow-md border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all group"
          >
            Visit Official College Website <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform text-primary-600" />
          </a>
        </div>
      </div>

    </div>
  );
}
