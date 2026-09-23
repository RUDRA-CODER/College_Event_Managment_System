"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
const google_1 = require("next/font/google");
require("./globals.css");
const ConditionalLayout_1 = __importDefault(require("@/components/layout/ConditionalLayout"));
const inter = (0, google_1.Inter)({ subsets: ["latin"] });
exports.metadata = {
    title: "CKPCET Events | College Event Management System",
    description: "Discover, explore, and participate in events at C. K. Pithawala College of Engineering and Technology (CKPCET), Surat.",
};
function RootLayout({ children, }) {
    return ((0, jsx_runtime_1.jsx)("html", { lang: "en", children: (0, jsx_runtime_1.jsx)("body", { className: `${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-900`, children: (0, jsx_runtime_1.jsx)(ConditionalLayout_1.default, { children: children }) }) }));
}
