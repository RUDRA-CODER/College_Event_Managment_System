"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateEventPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Coordinators can no longer create events
    router.replace('/coordinator/events');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-500">Redirecting... You do not have permission to create events.</p>
    </div>
  );
}
