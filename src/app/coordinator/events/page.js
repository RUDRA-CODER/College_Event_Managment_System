"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CoordinatorEvents;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
const Button_1 = require("@/components/ui/Button");
const Badge_1 = require("@/components/ui/Badge");
function CoordinatorEvents() {
    const [events, setEvents] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [filterCategory, setFilterCategory] = (0, react_1.useState)('All');
    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem('coordinator_token');
            const res = await fetch('http://localhost:5000/api/coordinator/events', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success)
                setEvents(data.data);
        }
        catch (err) {
            console.error('Failed to fetch events', err);
        }
        finally {
            setLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        fetchEvents();
    }, []);
    const handleDelete = async (id) => {
        // Coordinators cannot delete events
        alert('You do not have permission to delete events.');
    };
    const getStatusBadge = (status) => {
        switch (status) {
            case 'upcoming': return (0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "warning", children: "Upcoming" });
            case 'ongoing': return (0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "primary", children: "Ongoing" });
            case 'completed': return (0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "success", children: "Completed" });
            case 'cancelled': return (0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "danger", children: "Cancelled" });
            default: return (0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "secondary", children: status });
        }
    };
    const filteredEvents = events.filter(e => {
        const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || e.category === filterCategory;
        return matchesSearch && matchesCategory;
    });
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-navy-900", children: "Event Management" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 mt-1", children: "Manage and track your assigned events." })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "h-5 w-5 text-gray-400" }) }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search events...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "relative sm:w-64", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "h-5 w-5 text-gray-400" }) }), (0, jsx_runtime_1.jsxs)("select", { value: filterCategory, onChange: (e) => setFilterCategory(e.target.value), className: "block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm appearance-none bg-white", children: [(0, jsx_runtime_1.jsx)("option", { value: "All", children: "All Categories" }), (0, jsx_runtime_1.jsx)("option", { value: "Technical", children: "Technical" }), (0, jsx_runtime_1.jsx)("option", { value: "Cultural", children: "Cultural" }), (0, jsx_runtime_1.jsx)("option", { value: "Sports", children: "Sports" }), (0, jsx_runtime_1.jsx)("option", { value: "Workshop", children: "Workshop" })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: loading ? ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" }) })) : ((0, jsx_runtime_1.jsxs)("table", { className: "w-full text-sm text-left", children: [(0, jsx_runtime_1.jsx)("thead", { className: "text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 font-medium", children: "Event Name" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 font-medium", children: "Date & Venue" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 font-medium", children: "Registrations" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 font-medium", children: "Status" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 font-medium text-right", children: "Actions" })] }) }), (0, jsx_runtime_1.jsxs)("tbody", { className: "divide-y divide-gray-100", children: [filteredEvents.map((event) => ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [(0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("img", { src: event.image, alt: event.title, className: "h-10 w-10 rounded-lg object-cover border border-gray-200" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-navy-900", children: event.title }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-500 text-xs mt-1", children: event.category })] })] }) }), (0, jsx_runtime_1.jsxs)("td", { className: "px-6 py-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-gray-900", children: [event.date, " at ", event.time] }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-500 text-xs mt-1 truncate max-w-[150px]", children: event.venue })] }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium text-gray-900", children: event.registrationCount }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-400 text-xs", children: ["/ ", event.maxParticipants] })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: getStatusBadge(event.status) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 text-right", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-end gap-1", children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: `/coordinator/events/${event.id}`, children: (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "ghost", size: "sm", className: "h-8 w-8 p-0 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50", title: "View Details", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-4 w-4" }) }) }), (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "ghost", size: "sm", className: "h-8 w-8 p-0 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50", title: "Edit Event", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "h-4 w-4" }) })] }) })] }, event.id))), filteredEvents.length === 0 && ((0, jsx_runtime_1.jsx)("tr", { children: (0, jsx_runtime_1.jsx)("td", { colSpan: 5, className: "px-6 py-12 text-center text-gray-500", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center justify-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "h-12 w-12 text-gray-200 mb-3" }), (0, jsx_runtime_1.jsx)("p", { className: "text-base font-medium text-navy-900", children: "No events found" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm", children: "Try adjusting your search or filters." })] }) }) }))] })] })) })] })] }));
}
