import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-navy-900 text-gray-300 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-800/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-3 inline-block">
              <div className="h-12 w-12 bg-white rounded-xl p-1 flex items-center justify-center overflow-hidden shadow-lg shadow-black/20">
                <img src="/logo.png" alt="CKPCET Logo" className="h-full w-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tight text-white leading-none">CKPCET</span>
                <span className="text-primary-400 font-semibold tracking-widest uppercase text-xs mt-1">Events Portal</span>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              Connecting students with opportunities, experiences and campus events. 
              The official platform to discover, explore and participate in events at CKPCET.
            </p>
            <div className="flex space-x-5 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all duration-300">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all duration-300">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all duration-300">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-white font-bold tracking-wide uppercase text-sm mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-all">Home</Link></li>
              <li><Link href="/events" className="text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-all">Browse Events</Link></li>
              <li><Link href="/seminars-workshops" className="text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-all">Seminars & Workshops</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-all">About Us</Link></li>
              <li><Link href="/login" className="text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-all">Student Login</Link></li>
            </ul>
          </div>

          {/* Event Categories */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold tracking-wide uppercase text-sm mb-6">Categories</h3>
            <ul className="space-y-3">
              <li><Link href="/events?category=Inspire" className="text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-all">Inspire 2026</Link></li>
              <li><Link href="/events?category=Technical" className="text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-all">Technical</Link></li>
              <li><Link href="/events?category=Cultural" className="text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-all">Cultural</Link></li>
              <li><Link href="/events?category=Sports" className="text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-all">Sports</Link></li>
              <li><Link href="/events?category=Workshop" className="text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-all">Workshops</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-bold tracking-wide uppercase text-sm mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="mt-1 bg-white/5 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary-400" />
                </div>
                <span className="text-gray-400 text-sm leading-relaxed">Near B.R.T.S. Route, Surat-Dumas Road, Surat - 395007, Gujarat</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="bg-white/5 p-2 rounded-lg">
                  <Phone className="h-5 w-5 text-primary-400" />
                </div>
                <span className="text-gray-400 text-sm">+91 261 272 8282</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="bg-white/5 p-2 rounded-lg">
                  <Mail className="h-5 w-5 text-primary-400" />
                </div>
                <a href="mailto:info@ckpcet.ac.in" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">info@ckpcet.ac.in</a>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-white/10">
              <a href="https://ckpcet.ac.in/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-400 hover:text-white transition-colors group">
                Visit Official Website
                <ExternalLink className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
          </div>
          
        </div>
        
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-gray-500">&copy; {new Date().getFullYear()} CKPCET Events Portal. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-gray-500">
            <a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Help Center</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
