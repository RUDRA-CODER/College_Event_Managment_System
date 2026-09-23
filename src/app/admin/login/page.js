"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminLogin;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const lucide_react_1 = require("lucide-react");
const Button_1 = require("@/components/ui/Button");
const link_1 = __importDefault(require("next/link"));
function AdminLogin() {
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const router = (0, navigation_1.useRouter)();
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem('admin_token', data.data.token);
                localStorage.setItem('admin_data', JSON.stringify(data.data.admin));
                router.push('/admin/dashboard');
            }
            else {
                setError(data.message || 'Login failed');
            }
        }
        catch (err) {
            setError('Failed to connect to the server. Is the backend running?');
        }
        finally {
            setLoading(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white", children: [(0, jsx_runtime_1.jsxs)("div", { className: "absolute inset-0 pointer-events-none z-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute -top-40 -right-40 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute top-40 -left-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute -bottom-40 left-1/2 w-80 h-80 bg-slate-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "max-w-md w-full space-y-8 z-10 bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: "/", className: "inline-block transition-transform hover:scale-105", children: (0, jsx_runtime_1.jsx)("div", { className: "h-16 w-16 mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-3", children: (0, jsx_runtime_1.jsx)("img", { src: "/logo.png", alt: "CKPCET Logo", className: "h-full w-full object-contain" }) }) }), (0, jsx_runtime_1.jsx)("h2", { className: "mt-6 text-3xl font-extrabold text-navy-900 tracking-tight", children: "Admin Portal" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm text-gray-500", children: "Sign in to manage the entire event system" })] }), (0, jsx_runtime_1.jsxs)("form", { className: "mt-8 space-y-6", onSubmit: handleLogin, children: [error && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-start gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-5 w-5 shrink-0" }), (0, jsx_runtime_1.jsx)("p", { children: error })] })), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email Address" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "h-5 w-5 text-gray-400" }) }), (0, jsx_runtime_1.jsx)("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm bg-white/50", placeholder: "admin@ckpcet.ac.in" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Password" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "h-5 w-5 text-gray-400" }) }), (0, jsx_runtime_1.jsx)("input", { type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm bg-white/50", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] })] })] }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(Button_1.Button, { type: "submit", variant: "primary", fullWidth: true, size: "lg", className: "group rounded-xl py-3 shadow-md shadow-primary-500/20", disabled: loading, children: (0, jsx_runtime_1.jsxs)("span", { className: "flex items-center justify-center gap-2", children: [loading ? 'Signing in...' : 'Sign in to Portal', !loading && (0, jsx_runtime_1.jsx)(lucide_react_1.LogIn, { className: "h-5 w-5 group-hover:translate-x-1 transition-transform" })] }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "text-center mt-4", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-500", children: ["Hint: use ", (0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-gray-700", children: "admin@ckpcet.ac.in" }), " and any password."] }) })] })] })] }));
}
