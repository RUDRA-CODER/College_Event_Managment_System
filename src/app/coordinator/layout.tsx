"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Calendar, PlusCircle, Users, User, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CoordinatorLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [coordinator, setCoordinator] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Redirect to login if not authenticated (Mock implementation)
  useEffect(() => {
    const isAuth = localStorage.getItem('coordinator_token');
    if (!isAuth && !pathname.includes('/login')) {
      router.push('/coordinator/login');
    }
    if (isAuth) {
      try {
        const data = JSON.parse(localStorage.getItem('coordinator_data') || '{}');
        setCoordinator(data);
      } catch (e) {
        // ignore
      }
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('coordinator_token');
    localStorage.removeItem('coordinator_data');
    router.push('/coordinator/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/coordinator/dashboard', icon: LayoutDashboard },
    { name: 'My Events', href: '/coordinator/events', icon: Calendar },
    { name: 'Registrations', href: '/coordinator/registrations', icon: Users },
    { name: 'Profile', href: '/coordinator/profile', icon: User },
  ];

  if (pathname === '/coordinator/login') {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 shadow-sm z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-gray-100 justify-between">
          <Link href="/coordinator/dashboard" className="flex items-center gap-3">
            <div className="h-8 w-8 flex items-center justify-center">
              <img src="/logo.png" alt="CKPCET Logo" className="h-full w-full object-contain" />
            </div>
            <span className="font-extrabold text-lg text-navy-900">
              Portal
            </span>
          </Link>
          <button className="md:hidden text-gray-500" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar User Info */}
        {coordinator && (
          <div className="p-6 border-b border-gray-100 flex items-center gap-4">
            <img src={coordinator.avatar} alt="Profile" className="h-12 w-12 rounded-full border border-gray-200" />
            <div className="overflow-hidden">
              <h3 className="font-semibold text-sm text-navy-900 truncate">{coordinator.name}</h3>
              <p className="text-xs text-gray-500 truncate">{coordinator.role}</p>
            </div>
          </div>
        )}

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-navy-900'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100">
          <Button 
            variant="outline" 
            fullWidth 
            onClick={handleLogout}
            className="justify-start gap-3 rounded-lg border-gray-200 text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-100"
          >
            <LogOut className="h-5 w-5" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 md:hidden sticky top-0 z-30">
          <button 
            className="p-2 -ml-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 flex justify-center mr-6">
            <span className="font-bold text-navy-900">Coordinator Portal</span>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
