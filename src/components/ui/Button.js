"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = Button;
const jsx_runtime_1 = require("react/jsx-runtime");
function Button(_a) {
    var { children, variant = 'primary', size = 'md', fullWidth = false, className = '' } = _a, props = __rest(_a, ["children", "variant", "size", "fullWidth", "className"]);
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
        primary: "bg-primary-600 text-white hover:bg-primary-700",
        secondary: "bg-navy-800 text-white hover:bg-navy-900",
        outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50",
        ghost: "bg-transparent text-gray-600 hover:text-navy-900 hover:bg-gray-100",
        danger: "bg-red-600 text-white hover:bg-red-700",
        light: "bg-white text-primary-700 hover:bg-gray-50",
        "outline-light": "border-2 border-white/30 text-white bg-white/5 hover:bg-white/10",
    };
    const sizes = {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-6 text-lg",
    };
    const widthStyle = fullWidth ? "w-full" : "";
    const variantStyle = variants[variant];
    const sizeStyle = sizes[size];
    return ((0, jsx_runtime_1.jsx)("button", Object.assign({ className: `${baseStyles} ${variantStyle} ${sizeStyle} ${widthStyle} ${className}` }, props, { children: children })));
}
