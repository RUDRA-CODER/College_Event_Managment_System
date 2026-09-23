"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MyRegistrationsPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const events_1 = require("@/data/events");
const Badge_1 = require("@/components/ui/Badge");
const Button_1 = require("@/components/ui/Button");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
function MyRegistrationsPage() {
    const router = (0, navigation_1.useRouter)();
    const [isClient, setIsClient] = (0, react_1.useState)(false);
    const [registeredIds, setRegisteredIds] = (0, react_1.useState)([]);
    const [filter, setFilter] = (0, react_1.useState)('All');
    (0, react_1.useEffect)(() => {
        setIsClient(true);
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            router.push('/login');
        }
        const savedRegs = localStorage.getItem('mockRegistrations');
        if (savedRegs) {
            setRegisteredIds(JSON.parse(savedRegs));
        }
    }, [router]);
    if (!isClient)
        return null;
    const myEvents = events_1.mockEvents.filter(e => registeredIds.includes(e.id));
    const filteredEvents = myEvents.filter(e => {
        if (filter === 'All')
            return true;
        return e.status === filter;
    });
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-slate-50 min-h-screen pb-20", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-navy-900 pt-16 pb-16 relative overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-primary-900 opacity-10 mix-blend-overlay" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent" }), (0, jsx_runtime_1.jsx)("div", { className: "relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 animate-fade-up", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-extrabold text-white mb-3 tracking-tight", children: "My Registrations" }), (0, jsx_runtime_1.jsx)("p", { className: "text-primary-200 text-lg max-w-2xl", children: "Track and manage all the events you have registered for. Your tickets and certificates will appear here." })] }), (0, jsx_runtime_1.jsx)(link_1.default, { href: "/events", children: (0, jsx_runtime_1.jsxs)(Button_1.Button, { variant: "primary", className: "shadow-lg shadow-primary-600/20 gap-2 h-11 px-6", children: ["Browse More Events ", (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "h-4 w-4" })] }) })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white p-2 rounded-xl shadow-sm border border-gray-100/50 inline-flex mb-8 overflow-x-auto w-full sm:w-auto animate-fade-up", style: { animationDelay: '0.1s' }, children: ['All', 'Upcoming', 'Completed'].map(status => ((0, jsx_runtime_1.jsx)("button", { onClick: () => setFilter(status), className: `px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shrink-0 ${filter === status
                                ? 'bg-primary-50 text-primary-700 shadow-sm'
                                : 'text-gray-500 hover:text-navy-900 hover:bg-slate-50'}`, children: status }, status))) }), (0, jsx_runtime_1.jsx)("div", { className: "animate-fade-up", style: { animationDelay: '0.2s' }, children: filteredEvents.length > 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "space-y-6", children: filteredEvents.map(event => ((0, jsx_runtime_1.jsxs)("div", { className: "group bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-md hover:border-primary-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "w-full md:w-64 h-56 md:h-auto shrink-0 relative overflow-hidden", children: [(0, jsx_runtime_1.jsx)("img", { src: event.image, alt: event.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute top-4 left-4", children: (0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: event.status === 'Completed' ? 'secondary' : 'success', className: "shadow-sm backdrop-blur-md bg-white/90", children: event.status === 'Completed' ? 'Completed' : 'Confirmed' }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6 md:p-8 flex-grow flex flex-col", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2 mb-2", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xs font-bold bg-primary-50 text-primary-600 px-3 py-1 rounded-full uppercase tracking-wider", children: event.category }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-navy-900 group-hover:text-primary-600 transition-colors", children: event.name })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-left sm:text-right shrink-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-gray-100 text-sm font-mono text-gray-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Ticket, { className: "h-4 w-4 text-gray-400" }), "REG-", event.id.slice(-4).toUpperCase()] }) })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 text-sm mb-6 line-clamp-2", children: event.shortDescription }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-auto pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-6 text-sm text-gray-600 font-medium", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-4 w-4 text-gray-400" }), " ", event.date, " \u2022 ", event.time] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "h-4 w-4 text-gray-400" }), " ", event.venue] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3 w-full sm:w-auto", children: [event.status === 'Completed' ? ((0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "outline", className: "w-full sm:w-auto flex-1", children: "View Certificate" })) : ((0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "outline", className: "w-full sm:w-auto flex-1 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200", children: "View Ticket" })), (0, jsx_runtime_1.jsx)(link_1.default, { href: `/events/${event.id}`, className: "flex-1 sm:flex-none", children: (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "primary", className: "w-full", children: "Event Page" }) })] })] })] })] }, event.id))) })) : ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-2xl p-16 text-center border border-gray-100/50 shadow-sm", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "h-10 w-10 text-gray-400" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-navy-900 mb-3", children: "No registrations found" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-500 mb-8 max-w-md mx-auto text-lg", children: ["You haven't registered for any ", filter !== 'All' ? filter.toLowerCase() : '', " events yet. Find an event that matches your interests!"] }), (0, jsx_runtime_1.jsx)(link_1.default, { href: "/events", children: (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "primary", size: "lg", className: "shadow-lg shadow-primary-600/20 px-8", children: "Browse Events" }) })] })) })] })] }));
}
