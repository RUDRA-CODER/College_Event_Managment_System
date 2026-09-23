"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CoordinatorRegistrations;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const Button_1 = require("@/components/ui/Button");
const Badge_1 = require("@/components/ui/Badge");
function CoordinatorRegistrations() {
    const [registrations, setRegistrations] = (0, react_1.useState)([]);
    const [events, setEvents] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [filterEvent, setFilterEvent] = (0, react_1.useState)('All');
    const [filterStatus, setFilterStatus] = (0, react_1.useState)('All');
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('coordinator_token');
            const headers = { 'Authorization': `Bearer ${token}` };
            const [regsRes, eventsRes] = await Promise.all([
                fetch('http://localhost:5000/api/coordinator/registrations', { headers }),
                fetch('http://localhost:5000/api/coordinator/events', { headers })
            ]);
            const regsData = await regsRes.json();
            const eventsData = await eventsRes.json();
            if (regsData.success)
                setRegistrations(regsData.data);
            if (eventsData.success)
                setEvents(eventsData.data);
        }
        catch (err) {
            console.error('Failed to fetch data', err);
        }
        finally {
            setLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        fetchData();
    }, []);
    const handleUpdateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('coordinator_token');
            const res = await fetch(`http://localhost:5000/api/registrations/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.success) {
                fetchData();
            }
        }
        catch (err) {
            alert('Failed to update status');
        }
    };
    const handleUpdateAttendance = async (id, attendance) => {
        try {
            const token = localStorage.getItem('coordinator_token');
            const res = await fetch(`http://localhost:5000/api/registrations/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ attendance })
            });
            const data = await res.json();
            if (data.success) {
                fetchData();
            }
        }
        catch (err) {
            alert('Failed to update attendance');
        }
    };
    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to cancel and delete this registration?')) {
            try {
                const token = localStorage.getItem('coordinator_token');
                const res = await fetch(`http://localhost:5000/api/registrations/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    fetchData();
                }
            }
            catch (err) {
                alert('Failed to delete registration');
            }
        }
    };
    const filteredRegistrations = registrations.filter(r => {
        const matchesSearch = r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.enrollmentNumber.includes(searchTerm);
        const matchesEvent = filterEvent === 'All' || r.eventId === filterEvent;
        const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
        return matchesSearch && matchesEvent && matchesStatus;
    });
    const getEventName = (eventId) => {
        const ev = events.find(e => e.id === eventId);
        return ev ? ev.title : eventId;
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-navy-900", children: "Registration Management" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 mt-1", children: "Manage student registrations and attendance." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 border-b border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "h-5 w-5 text-gray-400" }) }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search student or enrollment...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "h-5 w-5 text-gray-400" }) }), (0, jsx_runtime_1.jsxs)("select", { value: filterEvent, onChange: (e) => setFilterEvent(e.target.value), className: "block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm appearance-none bg-white", children: [(0, jsx_runtime_1.jsx)("option", { value: "All", children: "All Events" }), events.map(ev => ((0, jsx_runtime_1.jsx)("option", { value: ev.id, children: ev.title }, ev.id)))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "h-5 w-5 text-gray-400" }) }), (0, jsx_runtime_1.jsxs)("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm appearance-none bg-white", children: [(0, jsx_runtime_1.jsx)("option", { value: "All", children: "All Statuses" }), (0, jsx_runtime_1.jsx)("option", { value: "pending", children: "Pending" }), (0, jsx_runtime_1.jsx)("option", { value: "confirmed", children: "Confirmed" }), (0, jsx_runtime_1.jsx)("option", { value: "cancelled", children: "Cancelled" })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: loading ? ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" }) })) : ((0, jsx_runtime_1.jsxs)("table", { className: "w-full text-sm text-left", children: [(0, jsx_runtime_1.jsx)("thead", { className: "text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 font-medium", children: "Student Details" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 font-medium", children: "Event" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 font-medium", children: "Registration Date" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 font-medium", children: "Status & Attendance" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 font-medium text-right", children: "Actions" })] }) }), (0, jsx_runtime_1.jsxs)("tbody", { className: "divide-y divide-gray-100", children: [filteredRegistrations.map((reg) => ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [(0, jsx_runtime_1.jsxs)("td", { className: "px-6 py-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-navy-900", children: reg.studentName }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-500 text-xs mt-1", children: reg.enrollmentNumber }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-xs", children: reg.email })] }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: (0, jsx_runtime_1.jsx)("div", { className: "text-gray-900 font-medium", children: getEventName(reg.eventId) }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 text-gray-600", children: reg.registrationDate }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-2 items-start", children: [reg.status === 'confirmed' ? ((0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "success", children: "Confirmed" })) : reg.status === 'pending' ? ((0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "warning", children: "Pending" })) : ((0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "danger", children: "Cancelled" })), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2", children: (0, jsx_runtime_1.jsxs)("label", { className: "text-xs text-gray-500 flex items-center gap-1 cursor-pointer", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: reg.attendance, onChange: (e) => handleUpdateAttendance(reg.id, e.target.checked), className: "rounded text-primary-600 focus:ring-primary-500" }), "Present"] }) })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 text-right", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-end gap-1", children: [reg.status !== 'confirmed' && ((0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "ghost", size: "sm", onClick: () => handleUpdateStatus(reg.id, 'confirmed'), className: "h-8 w-8 p-0 rounded-lg text-green-600 hover:bg-green-50", title: "Confirm Registration", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4" }) })), reg.status !== 'cancelled' && ((0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "ghost", size: "sm", onClick: () => handleUpdateStatus(reg.id, 'cancelled'), className: "h-8 w-8 p-0 rounded-lg text-amber-600 hover:bg-amber-50", title: "Cancel Registration", children: (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-4 w-4" }) })), (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "ghost", size: "sm", onClick: () => handleDelete(reg.id), className: "h-8 w-8 p-0 rounded-lg text-red-600 hover:bg-red-50", title: "Delete Registration", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "h-4 w-4" }) })] }) })] }, reg.id))), filteredRegistrations.length === 0 && ((0, jsx_runtime_1.jsx)("tr", { children: (0, jsx_runtime_1.jsx)("td", { colSpan: 5, className: "px-6 py-12 text-center text-gray-500", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center justify-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "h-12 w-12 text-gray-200 mb-3" }), (0, jsx_runtime_1.jsx)("p", { className: "text-base font-medium text-navy-900", children: "No registrations found" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm", children: "Try adjusting your search or filters." })] }) }) }))] })] })) })] })] }));
}
