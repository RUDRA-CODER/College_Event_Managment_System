"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CreateEventPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const navigation_1 = require("next/navigation");
function CreateEventPage() {
    const router = (0, navigation_1.useRouter)();
    (0, react_1.useEffect)(() => {
        // Coordinators can no longer create events
        router.replace('/coordinator/events');
    }, [router]);
    return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500", children: "Redirecting... You do not have permission to create events." }) }));
}
