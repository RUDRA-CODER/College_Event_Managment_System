"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventCard = EventCard;
const jsx_runtime_1 = require("react/jsx-runtime");
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
const Badge_1 = require("../ui/Badge");
function EventCard({ event }) {
    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'Upcoming': return 'primary';
            case 'Ongoing': return 'success';
            case 'Completed': return 'secondary';
            default: return 'primary';
        }
    };
    return ((0, jsx_runtime_1.jsx)(link_1.default, { href: `/events/${event.id}`, className: "group block h-full", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-2xl hover-lift border border-gray-100 overflow-hidden flex flex-col h-full shadow-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative h-56 w-full overflow-hidden bg-gray-100", children: [(0, jsx_runtime_1.jsx)("img", { src: event.image, alt: event.name, className: "w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-navy-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute top-4 left-4", children: (0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "outline", className: "bg-white/95 backdrop-blur-md text-navy-900 border-none font-bold shadow-sm text-xs px-3 py-1", children: event.category.toUpperCase() }) }), (0, jsx_runtime_1.jsx)("div", { className: "absolute top-4 right-4", children: (0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: getStatusBadgeVariant(event.status), className: "shadow-md font-semibold text-xs", children: event.status }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6 flex flex-col flex-grow relative", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-navy-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors duration-300", children: event.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed", children: event.shortDescription }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2.5 mt-auto mb-6 text-sm text-gray-500 font-medium", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-primary-50 p-1.5 rounded-md text-primary-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("span", { children: event.date })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-primary-50 p-1.5 rounded-md text-primary-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("span", { children: event.time })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-primary-50 p-1.5 rounded-md text-primary-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("span", { className: "truncate", children: event.venue })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "pt-5 border-t border-gray-100 mt-auto flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-semibold text-primary-600", children: "View Details" }), (0, jsx_runtime_1.jsx)("div", { className: "bg-primary-50 rounded-full p-2 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "h-4 w-4 text-primary-600 group-hover:text-white transition-colors" }) })] })] })] }) }));
}
