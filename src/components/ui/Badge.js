"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Badge = Badge;
const jsx_runtime_1 = require("react/jsx-runtime");
function Badge({ children, variant = 'primary', className = '' }) {
    const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    const variants = {
        primary: "bg-primary-100 text-primary-800",
        secondary: "bg-gray-100 text-gray-800",
        success: "bg-green-100 text-green-800",
        warning: "bg-yellow-100 text-yellow-800",
        danger: "bg-red-100 text-red-800",
        outline: "bg-transparent border border-gray-300 text-gray-700",
    };
    const variantStyle = variants[variant] || variants.primary;
    return ((0, jsx_runtime_1.jsx)("span", { className: `${baseStyles} ${variantStyle} ${className}`, children: children }));
}
