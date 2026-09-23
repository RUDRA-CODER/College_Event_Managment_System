"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminProfile;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const Button_1 = require("@/components/ui/Button");
function AdminProfile() {
    var _a;
    const [profile, setProfile] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [isEditing, setIsEditing] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        try {
            const storedData = JSON.parse(localStorage.getItem('admin_data') || '{}');
            setProfile(storedData);
        }
        catch (err) {
            console.error('Failed to fetch profile', err);
        }
        finally {
            setLoading(false);
        }
    }, []);
    const handleSave = (e) => {
        e.preventDefault();
        // Mock save
        alert('Profile updated successfully (Mock)');
        setIsEditing(false);
    };
    if (loading) {
        return (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" }) });
    }
    if (!profile) {
        return (0, jsx_runtime_1.jsx)("div", { children: "Profile not found." });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-navy-900", children: "Admin Profile" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 mt-1", children: "Manage your administrator account settings." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-32 bg-gradient-to-r from-red-600 to-red-800" }), (0, jsx_runtime_1.jsxs)("div", { className: "px-6 md:px-8 pb-8 relative", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-end -mt-12 mb-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-24 w-24 rounded-full border-4 border-white bg-red-100 shadow-md flex items-center justify-center relative", children: (0, jsx_runtime_1.jsx)("span", { className: "text-4xl font-bold text-red-600", children: ((_a = profile.name) === null || _a === void 0 ? void 0 : _a.charAt(0)) || 'A' }) }), !isEditing ? ((0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: () => setIsEditing(true), variant: "outline", className: "rounded-xl", children: "Edit Profile" })) : ((0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: () => setIsEditing(false), variant: "ghost", className: "rounded-xl text-gray-500", children: "Cancel" }))] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSave, className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "md:col-span-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Full Name" }), (0, jsx_runtime_1.jsx)("input", { type: "text", defaultValue: profile.name, disabled: !isEditing, className: "w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email Address" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "h-5 w-5 text-gray-400" }) }), (0, jsx_runtime_1.jsx)("input", { type: "email", defaultValue: profile.email, disabled: true, className: "w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-gray-50 text-gray-500 cursor-not-allowed" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Role" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-5 w-5 text-gray-400" }) }), (0, jsx_runtime_1.jsx)("input", { type: "text", defaultValue: profile.role, disabled: !isEditing, className: "w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500 capitalize" })] })] })] }), isEditing && ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-end pt-4 border-t border-gray-100 mt-8", children: (0, jsx_runtime_1.jsxs)(Button_1.Button, { type: "submit", variant: "primary", className: "gap-2 rounded-xl shadow-md shadow-primary-500/20", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "h-4 w-4" }), " Save Changes"] }) }))] })] })] })] }));
}
