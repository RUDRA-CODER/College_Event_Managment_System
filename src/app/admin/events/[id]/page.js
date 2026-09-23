"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminEventDetails;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
const Button_1 = require("@/components/ui/Button");
const Badge_1 = require("@/components/ui/Badge");
function AdminEventDetails() {
    const { id } = (0, navigation_1.useParams)();
    const router = (0, navigation_1.useRouter)();
    const [event, setEvent] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const fetchEvent = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/events/${id}`);
                const data = await res.json();
                if (data.success) {
                    setEvent(data.data);
                }
                else {
                    router.push('/admin/events');
                }
            }
            catch (err) {
                console.error('Failed to fetch event details', err);
            }
            finally {
                setLoading(false);
            }
        };
        if (id)
            fetchEvent();
    }, [id, router]);
    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            try {
                const token = localStorage.getItem('admin_token');
                const res = await fetch(`http://localhost:5000/api/events/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    router.push('/admin/events');
                }
                else {
                    alert('Failed to delete event');
                }
            }
            catch (err) {
                alert('An error occurred');
            }
        }
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
    if (loading) {
        return (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" }) });
    }
    if (!event)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: "/admin/events", children: (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "ghost", className: "h-10 w-10 p-0 rounded-full", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { className: "h-5 w-5" }) }) }), (0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-navy-900", children: "Event Details" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: `/admin/events/${id}/edit`, children: (0, jsx_runtime_1.jsxs)(Button_1.Button, { variant: "outline", className: "gap-2 rounded-xl border-gray-200", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "h-4 w-4" }), " Edit Event"] }) }), (0, jsx_runtime_1.jsxs)(Button_1.Button, { variant: "outline", onClick: handleDelete, className: "gap-2 rounded-xl border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-100", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "h-4 w-4" }), " Delete"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "h-64 w-full relative", children: [(0, jsx_runtime_1.jsx)("img", { src: event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: event.title, className: "w-full h-full object-cover" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" }), (0, jsx_runtime_1.jsxs)("div", { className: "absolute bottom-6 left-6 right-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-2", children: [(0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "primary", children: event.category }), getStatusBadge(event.status)] }), (0, jsx_runtime_1.jsx)("h1", { className: "text-3xl md:text-4xl font-bold text-white mb-2", children: event.title })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "md:col-span-2 space-y-8", children: (0, jsx_runtime_1.jsxs)("section", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-bold text-navy-900 mb-3", children: "About the Event" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 leading-relaxed whitespace-pre-line", children: event.description })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-5 w-5 text-primary-600 shrink-0 mt-0.5" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-navy-900", children: "Date" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: event.date })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-5 w-5 text-primary-600 shrink-0 mt-0.5" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-navy-900", children: "Time" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: event.time })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "h-5 w-5 text-primary-600 shrink-0 mt-0.5" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-navy-900", children: "Venue" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: event.venue })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-5 w-5 text-primary-600 shrink-0 mt-0.5" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-navy-900", children: "Registration" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: [event.registrationCount, " / ", event.maxParticipants, " Registered"] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-1.5 mt-2", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-primary-500 h-1.5 rounded-full", style: { width: `${Math.min(100, (event.registrationCount / event.maxParticipants) * 100)}%` } }) })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-amber-50 rounded-xl p-5 border border-amber-100", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-amber-800 mb-1", children: "Registration Deadline" }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg font-bold text-amber-900", children: event.registrationDeadline })] }), (0, jsx_runtime_1.jsx)(link_1.default, { href: "/admin/registrations", className: "block", children: (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "primary", fullWidth: true, className: "shadow-md shadow-primary-500/20", children: "View Registrations" }) })] })] })] })] }));
}
