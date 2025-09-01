(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/my/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MySubmissions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function MySubmissions() {
    _s();
    const [rows, setRows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [urls, setUrls] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabaseBrowser"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MySubmissions.useEffect": ()=>{
            const fetchData = {
                "MySubmissions.useEffect.fetchData": async ()=>{
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) {
                        location.href = '/(auth)/login';
                        return;
                    }
                    const { data, error } = await supabase.from('submissions').select('id,image_path,description,created_at').order('created_at', {
                        ascending: false
                    });
                    if (error) {
                        alert(error.message);
                        return;
                    }
                    setRows(data || []);
                    // Create signed URLs for each image (valid 1 hour)
                    const paths = (data || []).map({
                        "MySubmissions.useEffect.fetchData.paths": (r)=>r.image_path
                    }["MySubmissions.useEffect.fetchData.paths"]);
                    if (paths.length) {
                        const { data: signed } = await supabase.storage.from('photos').createSignedUrls(paths, 3600);
                        const map = {};
                        signed === null || signed === void 0 ? void 0 : signed.forEach({
                            "MySubmissions.useEffect.fetchData": (s)=>{
                                if (s === null || s === void 0 ? void 0 : s.signedUrl) map[s.path] = s.signedUrl;
                            }
                        }["MySubmissions.useEffect.fetchData"]);
                        setUrls(map);
                    }
                }
            }["MySubmissions.useEffect.fetchData"];
            fetchData();
        }
    }["MySubmissions.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "p-6 grid gap-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-xl font-bold",
                children: "My Submissions"
            }, void 0, false, {
                fileName: "[project]/app/my/page.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            rows.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                    className: "border rounded-xl p-4 grid gap-2",
                    children: [
                        urls[r.image_path] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: urls[r.image_path],
                            alt: "submission",
                            className: "w-full rounded-lg"
                        }, void 0, false, {
                            fileName: "[project]/app/my/page.tsx",
                            lineNumber: 42,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "whitespace-pre-wrap",
                            children: r.description
                        }, void 0, false, {
                            fileName: "[project]/app/my/page.tsx",
                            lineNumber: 44,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("time", {
                            className: "text-sm opacity-70",
                            children: new Date(r.created_at).toLocaleString()
                        }, void 0, false, {
                            fileName: "[project]/app/my/page.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this)
                    ]
                }, r.id, true, {
                    fileName: "[project]/app/my/page.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, this)),
            !rows.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "No submissions yet."
            }, void 0, false, {
                fileName: "[project]/app/my/page.tsx",
                lineNumber: 50,
                columnNumber: 24
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/my/page.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
_s(MySubmissions, "mjEHlCUm7m00Zt0FwaphhyMOEXk=");
_c = MySubmissions;
var _c;
__turbopack_context__.k.register(_c, "MySubmissions");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_my_page_tsx_20ff199b._.js.map