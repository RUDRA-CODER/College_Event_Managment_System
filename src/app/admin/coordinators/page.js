"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminCoordinators;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const Button_1 = require("@/components/ui/Button");
function AdminCoordinators() {
    const [coordinators, setCoordinators] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const fetchCoordinators = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch('http://localhost:5000/api/admin/coordinators', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success)
                setCoordinators(data.data);
        }
        catch (err) {
            console.error('Failed to fetch coordinators', err);
        }
        finally {
            setLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        fetchCoordinators();
    }, []);
    const filteredCoordinators = coordinators.filter(c => {
        const term = searchTerm.toLowerCase();
        return c.name.toLowerCase().includes(term) ||
            c.email.toLowerCase().includes(term) ||
            c.department.toLowerCase().includes(term);
    });
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-navy-900", children: "Coordinator Management" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 mt-1", children: "Manage event coordinators and their assignments." })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "h-5 w-5 text-gray-400" }) }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search coordinators by name, email or department...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: loading ? ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" }) })) : ((0, jsx_runtime_1.jsxs)("table", { className: "w-full text-sm text-left", children: [(0, jsx_runtime_1.jsx)("thead", { className: "text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 font-medium", children: "Coordinator" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 font-medium", children: "Contact" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 font-medium", children: "Department" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 font-medium", children: "Assigned Events" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 font-medium text-right", children: "Actions" })] }) }), (0, jsx_runtime_1.jsxs)("tbody", { className: "divide-y divide-gray-100", children: [filteredCoordinators.map((coordinator) => ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [(0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("img", { src: coordinator.avatar || 'https://via.placeholder.com/150', alt: coordinator.name, className: "h-10 w-10 rounded-full object-cover border border-gray-200" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-navy-900", children: coordinator.name }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-500 text-xs mt-1 capitalize", children: coordinator.role })] })] }) }), (0, jsx_runtime_1.jsxs)("td", { className: "px-6 py-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-900", children: coordinator.email }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-500 text-xs mt-1", children: coordinator.phone })] }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: (0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: coordinator.department }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-1 font-medium text-navy-900", children: coordinator.assignedEventsCount || 0 }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 text-right", children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-end gap-1", children: (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "ghost", size: "sm", className: "h-8 w-8 p-0 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50", title: "Edit Coordinator", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "h-4 w-4" }) }) }) })] }, coordinator.id))), filteredCoordinators.length === 0 && ((0, jsx_runtime_1.jsx)("tr", { children: (0, jsx_runtime_1.jsx)("td", { colSpan: 5, className: "px-6 py-12 text-center text-gray-500", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center justify-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-12 w-12 text-gray-200 mb-3" }), (0, jsx_runtime_1.jsx)("p", { className: "text-base font-medium text-navy-900", children: "No coordinators found" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm", children: "Try adjusting your search." })] }) }) }))] })] })) })] })] }));
}
