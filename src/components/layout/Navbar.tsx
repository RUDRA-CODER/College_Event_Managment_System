"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Check login status on mount and when pathname changes
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    router.push('/');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Seminars & Workshops', href: '/seminars-workshops' },
    { name: 'About', href: '/about' },
  ];

  if (isLoggedIn) {
    navLinks.push({ name: 'My Registrations', href: '/my-registrations' });
  }

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
              <div className="h-10 w-10 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                <img src="/logo.png" alt="CKPCET Logo" className="h-full w-full object-contain" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-navy-900 hidden sm:block">
                CKPCET <span className="text-primary-600">Events</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive(link.href) 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-navy-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Events Dropdown */}
            <div className="relative group px-1">
              <Link
                href="/events"
                className={`flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  pathname.startsWith('/events') 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-navy-900'
                }`}
              >
                Events <ChevronDown className="ml-1.5 h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
              </Link>
              
              {/* Dropdown Menu */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-56 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 ease-out z-50">
                <div className="bg-white rounded-2xl shadow-xl ring-1 ring-black/5 overflow-hidden p-2 flex flex-col gap-1 border border-gray-100">
                  <Link href="/events" className="block px-4 py-2 text-sm font-semibold text-primary-700 bg-primary-50 rounded-lg">All Events</Link>
                  <Link href="/events?category=Inspire" className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-navy-900 hover:bg-gray-50 rounded-lg transition-colors">Inspire</Link>
                  <Link href="/events?category=Technical" className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-navy-900 hover:bg-gray-50 rounded-lg transition-colors">Technical</Link>
                  <Link href="/events?category=Cultural" className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-navy-900 hover:bg-gray-50 rounded-lg transition-colors">Cultural</Link>
                  <Link href="/events?category=Sports" className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-navy-900 hover:bg-gray-50 rounded-lg transition-colors">Sports</Link>
                </div>
              </div>
            </div>

            <div className="ml-4 flex items-center border-l pl-5 border-gray-200 gap-3 h-8">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="gap-2 font-semibold text-gray-600 hover:text-navy-900 hover:bg-gray-50 rounded-full">
                      <User className="h-4 w-4" /> Dashboard
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="ghost" size="sm" className="font-semibold text-gray-600 hover:text-navy-900 hover:bg-gray-50 rounded-full">
                      Profile
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 rounded-full border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700">
                    <LogOut className="h-4 w-4" /> Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="font-semibold text-gray-600 hover:text-navy-900 hover:bg-gray-50 rounded-full">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="primary" size="sm" className="rounded-full shadow-md shadow-primary-500/20">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-navy-900 hover:bg-gray-100 transition-colors focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden absolute w-full bg-white border-b border-gray-100 shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pt-4 pb-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                isActive(link.href) ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/events"
            className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
              pathname.startsWith('/events') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Events & Categories
          </Link>
          
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-3">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" fullWidth className="justify-start gap-3 rounded-xl py-6 bg-gray-50 text-navy-900">
                    <User className="h-5 w-5" /> Student Dashboard
                  </Button>
                </Link>
                <Link href="/profile" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" fullWidth className="justify-start rounded-xl text-gray-600">Profile Settings</Button>
                </Link>
                <Button variant="outline" fullWidth onClick={() => { handleLogout(); setIsOpen(false); }} className="justify-start gap-3 rounded-xl border-gray-200">
                  <LogOut className="h-5 w-5" /> Logout
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" fullWidth className="rounded-xl border-gray-200 py-6">Login</Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" fullWidth className="rounded-xl py-6 shadow-md shadow-primary-500/20">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
