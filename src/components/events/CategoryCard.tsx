import React from 'react';
import Link from 'next/link';
import { Sparkles, Music, Users, Trophy, Cpu, Presentation, BookOpen, Star } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  description: string;
  count: number;
  iconName: string;
}

export function CategoryCard({ name, description, count, iconName }: CategoryCardProps) {
  
  // Mapping string to lucide icons
  const getIcon = () => {
    switch (iconName.toLowerCase()) {
      case 'inspire': return <Sparkles className="h-7 w-7" />;
      case 'cultural': return <Music className="h-7 w-7" />;
      case 'dance': return <Users className="h-7 w-7" />;
      case 'sports': return <Trophy className="h-7 w-7" />;
      case 'technical': return <Cpu className="h-7 w-7" />;
      case 'workshop': return <Presentation className="h-7 w-7" />;
      case 'seminar': return <BookOpen className="h-7 w-7" />;
      default: return <Star className="h-7 w-7" />;
    }
  };

  return (
    <Link href={`/events?category=${name}`} className="block group">
      <div className="bg-white rounded-2xl p-6 shadow-sm hover-lift border border-gray-100 transition-all overflow-hidden relative">
        {/* Decorative subtle background icon */}
        <div className="absolute -right-4 -bottom-4 text-primary-50 opacity-50 group-hover:scale-150 group-hover:-rotate-12 transition-transform duration-500">
          {getIcon()}
        </div>

        <div className="relative z-10">
          <div className="bg-primary-50 text-primary-600 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300 shadow-sm">
            {getIcon()}
          </div>
          <h3 className="text-xl font-bold text-navy-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">{name}</h3>
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">{description}</p>
          <div className="text-xs font-bold text-primary-700 bg-primary-50 inline-flex items-center px-3 py-1.5 rounded-full group-hover:bg-primary-100 transition-colors">
            {count} Event{count !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </Link>
  );
}
