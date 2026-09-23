"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ConditionalLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
const navigation_1 = require("next/navigation");
const Navbar_1 = require("@/components/layout/Navbar");
const Footer_1 = require("@/components/layout/Footer");
function ConditionalLayout({ children, }) {
    const pathname = (0, navigation_1.usePathname)();
    const isCoordinatorRoute = pathname === null || pathname === void 0 ? void 0 : pathname.startsWith('/coordinator');
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [!isCoordinatorRoute && (0, jsx_runtime_1.jsx)(Navbar_1.Navbar, {}), (0, jsx_runtime_1.jsx)("main", { className: isCoordinatorRoute ? "" : "flex-grow", children: children }), !isCoordinatorRoute && (0, jsx_runtime_1.jsx)(Footer_1.Footer, {})] }));
}
