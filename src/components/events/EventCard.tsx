import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Event } from '@/data/events';
import { Badge } from '../ui/Badge';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Upcoming': return 'primary';
      case 'Ongoing': return 'success';
      case 'Completed': return 'secondary';
      default: return 'primary';
    }
  };

  return (
    <Link href={`/events/${event.id}`} className="group block h-full">
      <div className="bg-white rounded-2xl hover-lift border border-gray-100 overflow-hidden flex flex-col h-full shadow-sm">
        {/* Image container */}
        <div className="relative h-56 w-full overflow-hidden bg-gray-100">
          <img 
            src={event.image} 
            alt={event.name} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Subtle gradient overlay for better text readability if badges overlap */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute top-4 left-4">
            <Badge variant="outline" className="bg-white/95 backdrop-blur-md text-navy-900 border-none font-bold shadow-sm text-xs px-3 py-1">
              {event.category.toUpperCase()}
            </Badge>
          </div>
          <div className="absolute top-4 right-4">
            <Badge variant={getStatusBadgeVariant(event.status)} className="shadow-md font-semibold text-xs">
              {event.status}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow relative">
          <h3 className="text-xl font-bold text-navy-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors duration-300">
            {event.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
            {event.shortDescription}
          </p>

          <div className="space-y-2.5 mt-auto mb-6 text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-3">
              <div className="bg-primary-50 p-1.5 rounded-md text-primary-600">
                <Calendar className="h-4 w-4" />
              </div>
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary-50 p-1.5 rounded-md text-primary-600">
                <Clock className="h-4 w-4" />
              </div>
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary-50 p-1.5 rounded-md text-primary-600">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="truncate">{event.venue}</span>
            </div>
          </div>

          {/* Action / Arrow indicator */}
          <div className="pt-5 border-t border-gray-100 mt-auto flex items-center justify-between">
            <span className="text-sm font-semibold text-primary-600">View Details</span>
            <div className="bg-primary-50 rounded-full p-2 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
              <ArrowRight className="h-4 w-4 text-primary-600 group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
