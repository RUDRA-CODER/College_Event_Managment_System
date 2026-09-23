"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryCard = CategoryCard;
const jsx_runtime_1 = require("react/jsx-runtime");
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
function CategoryCard({ name, description, count, iconName }) {
    // Mapping string to lucide icons
    const getIcon = () => {
        switch (iconName.toLowerCase()) {
            case 'inspire': return (0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { className: "h-7 w-7" });
            case 'cultural': return (0, jsx_runtime_1.jsx)(lucide_react_1.Music, { className: "h-7 w-7" });
            case 'dance': return (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-7 w-7" });
            case 'sports': return (0, jsx_runtime_1.jsx)(lucide_react_1.Trophy, { className: "h-7 w-7" });
            case 'technical': return (0, jsx_runtime_1.jsx)(lucide_react_1.Cpu, { className: "h-7 w-7" });
            case 'workshop': return (0, jsx_runtime_1.jsx)(lucide_react_1.Presentation, { className: "h-7 w-7" });
            case 'seminar': return (0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { className: "h-7 w-7" });
            default: return (0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "h-7 w-7" });
        }
    };
    return ((0, jsx_runtime_1.jsx)(link_1.default, { href: `/events?category=${name}`, className: "block group", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-2xl p-6 shadow-sm hover-lift border border-gray-100 transition-all overflow-hidden relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute -right-4 -bottom-4 text-primary-50 opacity-50 group-hover:scale-150 group-hover:-rotate-12 transition-transform duration-500", children: getIcon() }), (0, jsx_runtime_1.jsxs)("div", { className: "relative z-10", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-primary-50 text-primary-600 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300 shadow-sm", children: getIcon() }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-navy-900 mb-2 group-hover:text-primary-600 transition-colors duration-300", children: name }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 mb-5 leading-relaxed", children: description }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs font-bold text-primary-700 bg-primary-50 inline-flex items-center px-3 py-1.5 rounded-full group-hover:bg-primary-100 transition-colors", children: [count, " Event", count !== 1 ? 's' : ''] })] })] }) }));
}
