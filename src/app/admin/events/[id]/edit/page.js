"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EditEventPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const Button_1 = require("@/components/ui/Button");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
function EditEventPage({ params }) {
    const router = (0, navigation_1.useRouter)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [initialLoading, setInitialLoading] = (0, react_1.useState)(true);
    const [coordinators, setCoordinators] = (0, react_1.useState)([]);
    const [formData, setFormData] = (0, react_1.useState)({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        category: 'Technical',
        maxParticipants: 100,
        coordinatorIds: [],
        image: ''
    });
    (0, react_1.useEffect)(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('admin_token');
                const [eventRes, coordsRes] = await Promise.all([
                    fetch(`http://localhost:5000/api/events/${params.id}`),
                    fetch('http://localhost:5000/api/admin/coordinators', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);
                const eventData = await eventRes.json();
                const coordsData = await coordsRes.json();
                if (eventData.success) {
                    setFormData(eventData.data);
                }
                if (coordsData.success) {
                    setCoordinators(coordsData.data);
                }
            }
            catch (err) {
                console.error('Failed to fetch data', err);
            }
            finally {
                setInitialLoading(false);
            }
        };
        fetchData();
    }, [params.id]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleCoordinatorToggle = (id) => {
        setFormData(prev => {
            const current = prev.coordinatorIds || [];
            if (current.includes(id)) {
                return Object.assign(Object.assign({}, prev), { coordinatorIds: current.filter(c => c !== id) });
            }
            else {
                return Object.assign(Object.assign({}, prev), { coordinatorIds: [...current, id] });
            }
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch(`http://localhost:5000/api/events/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(Object.assign(Object.assign({}, formData), { maxParticipants: parseInt(formData.maxParticipants.toString(), 10) }))
            });
            const data = await res.json();
            if (data.success) {
                router.push('/admin/events');
            }
            else {
                alert(data.message || 'Failed to update event');
            }
        }
        catch (err) {
            alert('Error updating event');
        }
        finally {
            setLoading(false);
        }
    };
    if (initialLoading) {
        return (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" }) });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: "/admin/events", children: (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "ghost", size: "sm", className: "h-10 w-10 p-0 rounded-full", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { className: "h-5 w-5" }) }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-navy-900", children: "Edit Event" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-500 mt-1", children: ["Update details for ", formData.title, "."] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "p-6 sm:p-8 space-y-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-navy-900 border-b border-gray-100 pb-2", children: "Basic Information" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "md:col-span-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Event Title *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", name: "title", required: true, value: formData.title, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "md:col-span-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description *" }), (0, jsx_runtime_1.jsx)("textarea", { name: "description", required: true, rows: 4, value: formData.description, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Category *" }), (0, jsx_runtime_1.jsxs)("select", { name: "category", required: true, value: formData.category, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white", children: [(0, jsx_runtime_1.jsx)("option", { value: "Technical", children: "Technical" }), (0, jsx_runtime_1.jsx)("option", { value: "Cultural", children: "Cultural" }), (0, jsx_runtime_1.jsx)("option", { value: "Sports", children: "Sports" }), (0, jsx_runtime_1.jsx)("option", { value: "Workshop", children: "Workshop" }), (0, jsx_runtime_1.jsx)("option", { value: "Seminar", children: "Seminar" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Image URL" }), (0, jsx_runtime_1.jsx)("input", { type: "url", name: "image", value: formData.image, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-navy-900 border-b border-gray-100 pb-2", children: "Schedule & Venue" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Date *" }), (0, jsx_runtime_1.jsx)("input", { type: "date", name: "date", required: true, value: formData.date, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Time *" }), (0, jsx_runtime_1.jsx)("input", { type: "time", name: "time", required: true, value: formData.time, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "md:col-span-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Venue *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", name: "venue", required: true, value: formData.venue, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-navy-900 border-b border-gray-100 pb-2", children: "Capacity & Assignment" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Maximum Participants *" }), (0, jsx_runtime_1.jsx)("input", { type: "number", name: "maxParticipants", required: true, min: "1", value: formData.maxParticipants, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" })] }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Assign Coordinators" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3", children: [coordinators.map(coord => ((0, jsx_runtime_1.jsxs)("div", { onClick: () => handleCoordinatorToggle(coord.id), className: `cursor-pointer p-3 rounded-xl border flex items-center gap-3 transition-colors ${(formData.coordinatorIds || []).includes(coord.id)
                                                        ? 'bg-primary-50 border-primary-500 shadow-sm'
                                                        : 'bg-white border-gray-200 hover:border-gray-300'}`, children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: (formData.coordinatorIds || []).includes(coord.id), readOnly: true, className: "h-4 w-4 text-primary-600 rounded border-gray-300" }), (0, jsx_runtime_1.jsxs)("div", { className: "min-w-0", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-900 truncate", children: coord.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 truncate", children: coord.department })] })] }, coord.id))), coordinators.length === 0 && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "No coordinators available." }))] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-end pt-4 border-t border-gray-100", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3", children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: "/admin/events", children: (0, jsx_runtime_1.jsx)(Button_1.Button, { type: "button", variant: "outline", className: "rounded-xl", children: "Cancel" }) }), (0, jsx_runtime_1.jsxs)(Button_1.Button, { type: "submit", variant: "primary", className: "gap-2 rounded-xl", disabled: loading, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "h-4 w-4" }), loading ? 'Saving...' : 'Save Changes'] })] }) })] }) })] }));
}
