"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminDashboard;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
const Button_1 = require("@/components/ui/Button");
const Badge_1 = require("@/components/ui/Badge");
function AdminDashboard() {
    var _a, _b;
    const [stats, setStats] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('admin_token');
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };
                const res = await fetch('http://localhost:5000/api/admin/dashboard', { headers });
                const data = await res.json();
                if (data.success) {
                    setStats(data.data);
                }
            }
            catch (err) {
                console.error('Failed to fetch dashboard data', err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    const getStatusBadge = (status) => {
        switch (status) {
            case 'upcoming': return (0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "warning", children: "Upcoming" });
            case 'ongoing': return (0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "primary", children: "Ongoing" });
            case 'completed': return (0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "success", children: "Completed" });
            case 'cancelled': return (0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "danger", children: "Cancelled" });
            case 'pending': return (0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "warning", children: "Pending" });
            case 'confirmed': return (0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "success", children: "Confirmed" });
            default: return (0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "secondary", children: status });
        }
    };
    if (loading) {
        return (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" }) });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-navy-900", children: "Admin Dashboard" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 mt-1", children: "Overview of the entire CKPCET Event Management System." })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
                    { label: 'Total Events', value: (stats === null || stats === void 0 ? void 0 : stats.totalEvents) || 0, icon: lucide_react_1.Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Active Events', value: (stats === null || stats === void 0 ? void 0 : stats.activeEvents) || 0, icon: lucide_react_1.Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Total Registrations', value: (stats === null || stats === void 0 ? void 0 : stats.totalRegistrations) || 0, icon: lucide_react_1.Users, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Coordinators', value: (stats === null || stats === void 0 ? void 0 : stats.totalCoordinators) || 0, icon: lucide_react_1.Shield, color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map((stat, idx) => ((0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-500", children: stat.label }), (0, jsx_runtime_1.jsx)("p", { className: "text-3xl font-bold text-navy-900 mt-2", children: stat.value })] }), (0, jsx_runtime_1.jsx)("div", { className: `h-12 w-12 rounded-xl flex items-center justify-center ${stat.bg}`, children: (0, jsx_runtime_1.jsx)(stat.icon, { className: `h-6 w-6 ${stat.color}` }) })] }) }, idx))) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid lg:grid-cols-3 gap-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-6 border-b border-gray-100 flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-bold text-navy-900", children: "Recent Events" }), (0, jsx_runtime_1.jsxs)(link_1.default, { href: "/admin/events", className: "text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1", children: ["View all ", (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "h-4 w-4" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full text-sm text-left", children: [(0, jsx_runtime_1.jsx)("thead", { className: "text-xs text-gray-500 uppercase bg-gray-50/50", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 font-medium", children: "Event" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 font-medium", children: "Date & Time" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 font-medium", children: "Registrations" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 font-medium", children: "Status" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 font-medium text-right", children: "Action" })] }) }), (0, jsx_runtime_1.jsxs)("tbody", { className: "divide-y divide-gray-100", children: [(_a = stats === null || stats === void 0 ? void 0 : stats.recentEvents) === null || _a === void 0 ? void 0 : _a.map((event) => ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [(0, jsx_runtime_1.jsxs)("td", { className: "px-6 py-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-navy-900", children: event.title }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-500 text-xs mt-1", children: event.category })] }), (0, jsx_runtime_1.jsxs)("td", { className: "px-6 py-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-900", children: event.date }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-500 text-xs", children: event.time })] }), (0, jsx_runtime_1.jsxs)("td", { className: "px-6 py-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium text-gray-900", children: event.registrationCount }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-400 text-xs", children: ["/ ", event.maxParticipants] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-100 rounded-full h-1.5 mt-2", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-primary-500 h-1.5 rounded-full", style: { width: `${Math.min(100, (event.registrationCount / event.maxParticipants) * 100)}%` } }) })] }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: getStatusBadge(event.status) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 text-right", children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-end gap-2", children: (0, jsx_runtime_1.jsx)(link_1.default, { href: `/admin/events/${event.id}/edit`, children: (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "ghost", size: "sm", className: "h-8 w-8 p-0 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "h-4 w-4" }) }) }) }) })] }, event.id))), (!(stats === null || stats === void 0 ? void 0 : stats.recentEvents) || stats.recentEvents.length === 0) && ((0, jsx_runtime_1.jsx)("tr", { children: (0, jsx_runtime_1.jsx)("td", { colSpan: 5, className: "px-6 py-8 text-center text-gray-500", children: "No events found." }) }))] })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-6 border-b border-gray-100 flex items-center justify-between", children: (0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-bold text-navy-900", children: "Recent Registrations" }) }), (0, jsx_runtime_1.jsx)("div", { className: "p-2 flex-1 overflow-y-auto", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(_b = stats === null || stats === void 0 ? void 0 : stats.recentRegistrations) === null || _b === void 0 ? void 0 : _b.map((reg) => {
                                            var _a, _b;
                                            return ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 hover:bg-gray-50 rounded-xl transition-colors flex items-start gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-10 w-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold shrink-0", children: reg.studentName.charAt(0) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-navy-900 truncate", children: reg.studentName }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 truncate mt-0.5", children: ((_b = (_a = stats === null || stats === void 0 ? void 0 : stats.recentEvents) === null || _a === void 0 ? void 0 : _a.find((e) => e.id === reg.eventId)) === null || _b === void 0 ? void 0 : _b.title) || 'Event ID: ' + reg.eventId })] }), (0, jsx_runtime_1.jsx)("div", { className: "shrink-0", children: getStatusBadge(reg.status) })] }, reg.id));
                                        }), (!(stats === null || stats === void 0 ? void 0 : stats.recentRegistrations) || stats.recentRegistrations.length === 0) && ((0, jsx_runtime_1.jsx)("div", { className: "p-6 text-center text-gray-500 text-sm", children: "No recent registrations." }))] }) }), (0, jsx_runtime_1.jsx)("div", { className: "p-4 border-t border-gray-100", children: (0, jsx_runtime_1.jsx)(link_1.default, { href: "/admin/registrations", children: (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "outline", fullWidth: true, className: "rounded-xl border-gray-200", children: "View All" }) }) })] })] })] }));
}
