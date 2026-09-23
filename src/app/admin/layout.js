"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const lucide_react_1 = require("lucide-react");
const Button_1 = require("@/components/ui/Button");
function AdminLayout({ children }) {
    var _a;
    const [isSidebarOpen, setIsSidebarOpen] = (0, react_1.useState)(false);
    const [admin, setAdmin] = (0, react_1.useState)(null);
    const pathname = (0, navigation_1.usePathname)();
    const router = (0, navigation_1.useRouter)();
    (0, react_1.useEffect)(() => {
        const isAuth = localStorage.getItem('admin_token');
        if (!isAuth && !pathname.includes('/login')) {
            router.push('/admin/login');
        }
        if (isAuth) {
            try {
                const data = JSON.parse(localStorage.getItem('admin_data') || '{}');
                setAdmin(data);
            }
            catch (e) {
                // ignore
            }
        }
    }, [pathname, router]);
    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
        router.push('/admin/login');
    };
    const navItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: lucide_react_1.LayoutDashboard },
        { name: 'Events', href: '/admin/events', icon: lucide_react_1.Calendar },
        { name: 'Create Event', href: '/admin/events/create', icon: lucide_react_1.PlusCircle },
        { name: 'Coordinators', href: '/admin/coordinators', icon: lucide_react_1.Shield },
        { name: 'Registrations', href: '/admin/registrations', icon: lucide_react_1.Users },
        { name: 'Profile', href: '/admin/profile', icon: lucide_react_1.User },
    ];
    if (pathname === '/admin/login') {
        return (0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-slate-50", children: children });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen flex bg-slate-50", children: [isSidebarOpen && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/50 z-40 md:hidden", onClick: () => setIsSidebarOpen(false) })), (0, jsx_runtime_1.jsxs)("aside", { className: `fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 shadow-sm z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "h-20 flex items-center px-6 border-b border-gray-100 justify-between", children: [(0, jsx_runtime_1.jsxs)(link_1.default, { href: "/admin/dashboard", className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-8 w-8 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("img", { src: "/logo.png", alt: "CKPCET Logo", className: "h-full w-full object-contain" }) }), (0, jsx_runtime_1.jsx)("span", { className: "font-extrabold text-lg text-navy-900", children: "Portal" })] }), (0, jsx_runtime_1.jsx)("button", { className: "md:hidden text-gray-500", onClick: () => setIsSidebarOpen(false), children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-5 w-5" }) })] }), admin && ((0, jsx_runtime_1.jsxs)("div", { className: "p-6 border-b border-gray-100 flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-12 w-12 rounded-full border border-gray-200 bg-red-100 flex items-center justify-center text-red-600 font-bold", children: ((_a = admin.name) === null || _a === void 0 ? void 0 : _a.charAt(0)) || 'A' }), (0, jsx_runtime_1.jsxs)("div", { className: "overflow-hidden", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-sm text-navy-900 truncate", children: admin.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 truncate capitalize", children: admin.role })] })] })), (0, jsx_runtime_1.jsx)("nav", { className: "flex-1 p-4 space-y-1 overflow-y-auto", children: navItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                            const Icon = item.icon;
                            return ((0, jsx_runtime_1.jsxs)(link_1.default, { href: item.href, className: `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-navy-900'}`, onClick: () => setIsSidebarOpen(false), children: [(0, jsx_runtime_1.jsx)(Icon, { className: `h-5 w-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}` }), item.name] }, item.name));
                        }) }), (0, jsx_runtime_1.jsx)("div", { className: "p-4 border-t border-gray-100", children: (0, jsx_runtime_1.jsxs)(Button_1.Button, { variant: "outline", fullWidth: true, onClick: handleLogout, className: "justify-start gap-3 rounded-lg border-gray-200 text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-100", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.LogOut, { className: "h-5 w-5" }), " Logout"] }) })] }), (0, jsx_runtime_1.jsxs)("main", { className: "flex-1 flex flex-col min-h-screen max-w-full overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("header", { className: "h-16 bg-white border-b border-gray-100 flex items-center px-4 md:hidden sticky top-0 z-30", children: [(0, jsx_runtime_1.jsx)("button", { className: "p-2 -ml-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none", onClick: () => setIsSidebarOpen(true), children: (0, jsx_runtime_1.jsx)(lucide_react_1.Menu, { className: "h-6 w-6" }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 flex justify-center mr-6", children: (0, jsx_runtime_1.jsx)("span", { className: "font-bold text-navy-900", children: "Admin Portal" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 p-4 sm:p-6 lg:p-8 overflow-auto", children: (0, jsx_runtime_1.jsx)("div", { className: "mx-auto max-w-6xl", children: children }) })] })] }));
}
