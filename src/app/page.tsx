import Link from 'next/link';
import { EventCard } from '@/components/events/EventCard';
import { CategoryCard } from '@/components/events/CategoryCard';
import { Button } from '@/components/ui/Button';
import { mockEvents } from '@/data/events';
import { ArrowRight, Calendar, Users, Trophy, Sparkles, ChevronRight } from 'lucide-react';

export default function Home() {
  const upcomingEvents = mockEvents.filter(e => e.status === 'Upcoming').slice(0, 3);

  const categories = [
    { name: 'Inspire', description: 'Annual cultural and technical festival.', count: 5, iconName: 'inspire' },
    { name: 'Technical', description: 'Hackathons, coding challenges, and more.', count: 12, iconName: 'technical' },
    { name: 'Sports', description: 'Inter-department and college tournaments.', count: 8, iconName: 'sports' },
    { name: 'Cultural', description: 'Dance, music, drama and arts.', count: 6, iconName: 'cultural' },
    { name: 'Workshop', description: 'Hands-on learning sessions.', count: 4, iconName: 'workshop' },
    { name: 'Seminar', description: 'Expert talks and guest lectures.', count: 7, iconName: 'seminar' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-navy-900 text-white min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/campus.jpg" 
            alt="CKPCET Campus" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 animate-image-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/80 to-navy-900/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent opacity-80"></div>
        </div>
        
        {/* Abstract Particles / Decorative */}
        <div className="absolute inset-0 overflow-hidden z-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary-600/30 blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/20 blur-[100px]" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 pb-16">
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 mb-8 shadow-xl">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold tracking-wide uppercase">The New Student Experience</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Where Campus <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-blue-300 to-white">Comes Alive</span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-10 leading-relaxed max-w-2xl font-light">
              Discover events, explore opportunities, and be part of the experiences that make CKPCET unforgettable. One unified platform for every student activity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
              <Link href="/events" className="w-full sm:w-auto group">
                <Button size="lg" fullWidth className="gap-2 h-14 px-8 text-lg font-semibold shadow-2xl shadow-primary-600/40 hover:shadow-primary-600/60 transition-all rounded-full">
                  Explore Events <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto group">
                <Button variant="outline-light" size="lg" fullWidth className="gap-2 h-14 px-8 text-lg font-semibold backdrop-blur-sm rounded-full transition-all">
                  Student Login
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl border-t border-white/10 pt-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col">
              <span className="text-4xl md:text-5xl font-black text-white tracking-tight">25+</span>
              <span className="text-sm md:text-base font-medium text-primary-300 mt-2 uppercase tracking-wider">Upcoming Events</span>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl md:text-5xl font-black text-white tracking-tight">8</span>
              <span className="text-sm md:text-base font-medium text-primary-300 mt-2 uppercase tracking-wider">Categories</span>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl md:text-5xl font-black text-white tracking-tight">1.2k</span>
              <span className="text-sm md:text-base font-medium text-primary-300 mt-2 uppercase tracking-wider">Registered</span>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl md:text-5xl font-black text-white tracking-tight">4</span>
              <span className="text-sm md:text-base font-medium text-primary-300 mt-2 uppercase tracking-wider">Workshops</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 animate-fade-up">
            <div className="max-w-2xl">
              <h4 className="text-primary-600 font-bold tracking-widest uppercase text-sm mb-3">Discover</h4>
              <h2 className="text-4xl md:text-5xl font-extrabold text-navy-900 tracking-tight">Explore Categories</h2>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed">Find the perfect event matching your interests, from high-octane cultural fests to deep-dive technical workshops.</p>
            </div>
            <Link href="/events" className="hidden md:inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 group">
              View all categories <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {categories.map((cat) => (
              <CategoryCard key={cat.name} {...cat} />
            ))}
          </div>
          
          <div className="mt-10 md:hidden flex justify-center">
             <Link href="/events">
              <Button variant="outline" className="gap-2 rounded-full font-semibold">
                View all categories <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-50/50 skew-x-[-15deg] translate-x-24 -z-10 rounded-3xl hidden lg:block"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 animate-fade-up">
            <div className="max-w-2xl">
              <h4 className="text-primary-600 font-bold tracking-widest uppercase text-sm mb-3">What's Next</h4>
              <h2 className="text-4xl md:text-5xl font-extrabold text-navy-900 tracking-tight">Upcoming Events</h2>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed">Don't miss out on what's happening next on campus. Secure your spot before registrations close.</p>
            </div>
            <Link href="/events">
              <Button variant="outline" className="gap-2 rounded-full font-semibold border-gray-300 hover:border-navy-900 hover:bg-navy-900 hover:text-white transition-all group">
                View All Events <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Use CKPCET Events */}
      <section className="py-24 bg-navy-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiLz48L3N2Zz4=')] opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-up">
              <h4 className="text-primary-400 font-bold tracking-widest uppercase text-sm mb-3">The Platform</h4>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight leading-tight">Why use the new CKPCET Events Portal?</h2>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed font-light">
                We've transformed how campus activities are managed. No more paper forms, no more missing out on announcements. Everything is digital, fast, and accessible.
              </p>
              
              <div className="space-y-8">
                <div className="flex gap-6 group cursor-default">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl text-primary-300 flex items-center justify-center shrink-0 shadow-lg border border-white/10 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                    <Calendar className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold mb-2">Centralized Discovery</h4>
                    <p className="text-gray-400 text-lg leading-relaxed">Find every college event, workshop, and seminar in one highly organized place.</p>
                  </div>
                </div>
                <div className="flex gap-6 group cursor-default">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl text-primary-300 flex items-center justify-center shrink-0 shadow-lg border border-white/10 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                    <Users className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold mb-2">One-Click Registration</h4>
                    <p className="text-gray-400 text-lg leading-relaxed">Register for events instantly without filling out your details over and over.</p>
                  </div>
                </div>
                <div className="flex gap-6 group cursor-default">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl text-primary-300 flex items-center justify-center shrink-0 shadow-lg border border-white/10 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                    <Trophy className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold mb-2">Track Achievements</h4>
                    <p className="text-gray-400 text-lg leading-relaxed">Keep a record of all your participations, certificates, and winnings in your profile.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Visual/Image area */}
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl h-[600px] lg:h-[700px] animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <img 
                src="/campus.jpg" 
                alt="CKPCET Campus" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-10 md:p-12">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl">
                  <Sparkles className="h-8 w-8 text-primary-400 mb-6" />
                  <blockquote className="text-white text-2xl font-semibold leading-relaxed mb-6">
                    "This platform makes it so easy to stay connected with campus life and never miss an opportunity."
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary-600 flex items-center justify-center font-bold text-lg border-2 border-white/50">
                      SC
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">Student Council</p>
                      <p className="text-primary-300">CKPCET</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-24 relative overflow-hidden">
        {/* Decorative blur elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Ready to get started?</h2>
          <p className="text-primary-100 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Create your student account today to explore events, manage registrations, and participate in campus life.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link href="/register">
              <Button variant="light" size="lg" className="h-14 px-8 text-lg font-bold w-full sm:w-auto shadow-xl rounded-full">
                Create Student Account
              </Button>
            </Link>
            <Link href="/events">
              <Button variant="outline-light" size="lg" className="h-14 px-8 text-lg font-bold w-full sm:w-auto rounded-full backdrop-blur-sm">
                Browse Events First
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
