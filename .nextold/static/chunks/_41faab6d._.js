(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/PrintButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/PrintButton.tsx
__turbopack_context__.s([
    "default",
    ()=>PrintButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function PrintButton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: ()=>window.print(),
        className: "border rounded-xl px-3 py-2 print:hidden",
        title: "Print this page",
        children: "Print"
    }, void 0, false, {
        fileName: "[project]/components/PrintButton.tsx",
        lineNumber: 6,
        columnNumber: 5
    }, this);
}
_c = PrintButton;
var _c;
__turbopack_context__.k.register(_c, "PrintButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/SubmissionCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/SubmissionCard.tsx
__turbopack_context__.s([
    "default",
    ()=>SubmissionCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const UNDO_SECONDS = 10;
function SubmissionCard(param) {
    let { id, imageUrl, description, createdAt, reverse = false } = param;
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [isEditing, setIsEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [text, setText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(description);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [deleting, setDeleting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [pendingDelete, setPendingDelete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [countdown, setCountdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(UNDO_SECONDS);
    const timeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const intervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [gone, setGone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SubmissionCard.useEffect": ()=>{
            return ({
                "SubmissionCard.useEffect": ()=>{
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                    if (intervalRef.current) clearInterval(intervalRef.current);
                }
            })["SubmissionCard.useEffect"];
        }
    }["SubmissionCard.useEffect"], []);
    const onSave = async ()=>{
        setError(null);
        const trimmed = text.trim();
        if (!trimmed) {
            setError('Description cannot be empty.');
            return;
        }
        if (trimmed.length > 2000) {
            setError('Max 2000 characters.');
            return;
        }
        setSaving(true);
        try {
            const res = await fetch("/api/submissions/".concat(id), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: trimmed
                })
            });
            const t = await res.text();
            if (!res.ok) {
                let msg = 'Update failed';
                try {
                    msg = JSON.parse(t).error || msg;
                } catch (e) {}
                throw new Error(msg);
            }
            setIsEditing(false);
            router.refresh();
        } catch (e) {
            setError((e === null || e === void 0 ? void 0 : e.message) || 'Update failed');
        } finally{
            setSaving(false);
        }
    };
    const finalizeHardDelete = async ()=>{
        try {
            const res = await fetch("/api/submissions/".concat(id, "?hard=1"), {
                method: 'DELETE'
            });
            const t = await res.text();
            if (!res.ok) {
                let msg = 'Hard delete failed';
                try {
                    msg = JSON.parse(t).error || msg;
                } catch (e) {}
                throw new Error(msg);
            }
            setGone(true);
            router.refresh();
        } catch (e) {
            // If hard delete fails, surface error and keep the pending state visible
            setError((e === null || e === void 0 ? void 0 : e.message) || 'Hard delete failed');
            setPendingDelete(false);
            setCountdown(UNDO_SECONDS);
        } finally{
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
            timeoutRef.current = null;
            intervalRef.current = null;
        }
    };
    const onDelete = async ()=>{
        if (pendingDelete) return;
        const ok = confirm('Delete this submission? You’ll have 10 seconds to undo.');
        if (!ok) return;
        setError(null);
        setDeleting(true);
        try {
            // Soft delete first
            const res = await fetch("/api/submissions/".concat(id), {
                method: 'DELETE'
            });
            const t = await res.text();
            if (!res.ok) {
                let msg = 'Delete failed';
                try {
                    msg = JSON.parse(t).error || msg;
                } catch (e) {}
                throw new Error(msg);
            }
            setPendingDelete(true);
            setCountdown(UNDO_SECONDS);
            // Start countdown + hard delete timer
            intervalRef.current = setInterval(()=>{
                setCountdown((c)=>c > 0 ? c - 1 : 0);
            }, 1000);
            timeoutRef.current = setTimeout(finalizeHardDelete, UNDO_SECONDS * 1000);
        } catch (e) {
            setError((e === null || e === void 0 ? void 0 : e.message) || 'Delete failed');
        } finally{
            setDeleting(false);
        }
    };
    const onUndo = async ()=>{
        if (!pendingDelete) return;
        setError(null);
        try {
            const res = await fetch("/api/submissions/".concat(id, "/undo"), {
                method: 'POST'
            });
            const t = await res.text();
            if (!res.ok) {
                let msg = 'Undo failed';
                try {
                    msg = JSON.parse(t).error || msg;
                } catch (e) {}
                throw new Error(msg);
            }
            // Cancel timers and restore
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
            timeoutRef.current = null;
            intervalRef.current = null;
            setPendingDelete(false);
            setCountdown(UNDO_SECONDS);
            setError(null);
        } catch (e) {
            setError((e === null || e === void 0 ? void 0 : e.message) || 'Undo failed');
        }
    };
    if (gone) return null;
    const imageColOrder = reverse ? 'md:order-2' : 'md:order-1';
    const textColOrder = reverse ? 'md:order-1' : 'md:order-2';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: "border rounded-xl p-4 grid gap-4 md:grid-cols-[260px_1fr] items-start print:border-0 print:p-0 print:shadow-none print:break-inside-avoid ".concat(pendingDelete ? 'opacity-60' : ''),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: imageColOrder,
                children: imageUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: imageUrl,
                    alt: "submission",
                    className: "w-full h-auto rounded-lg object-cover max-h-[420px]"
                }, void 0, false, {
                    fileName: "[project]/components/SubmissionCard.tsx",
                    lineNumber: 162,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full aspect-video rounded-lg border grid place-items-center text-sm text-gray-500",
                    children: "No image"
                }, void 0, false, {
                    fileName: "[project]/components/SubmissionCard.tsx",
                    lineNumber: 168,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/SubmissionCard.tsx",
                lineNumber: 160,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-3 ".concat(textColOrder),
                children: [
                    isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid gap-2 print:hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        className: "border rounded-xl p-3 min-h-28",
                                        value: text,
                                        onChange: (e)=>setText(e.target.value),
                                        maxLength: 2000,
                                        disabled: pendingDelete
                                    }, void 0, false, {
                                        fileName: "[project]/components/SubmissionCard.tsx",
                                        lineNumber: 180,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm opacity-70",
                                        children: [
                                            text.length,
                                            "/2000"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/SubmissionCard.tsx",
                                        lineNumber: 187,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: onSave,
                                                disabled: saving || pendingDelete,
                                                className: "border rounded-xl px-3 py-1",
                                                children: saving ? 'Saving…' : 'Save'
                                            }, void 0, false, {
                                                fileName: "[project]/components/SubmissionCard.tsx",
                                                lineNumber: 189,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    setIsEditing(false);
                                                    setText(description);
                                                },
                                                disabled: saving || pendingDelete,
                                                className: "border rounded-xl px-3 py-1",
                                                children: "Cancel"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SubmissionCard.tsx",
                                                lineNumber: 196,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/SubmissionCard.tsx",
                                        lineNumber: 188,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SubmissionCard.tsx",
                                lineNumber: 179,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "whitespace-pre-wrap hidden print:block",
                                children: description
                            }, void 0, false, {
                                fileName: "[project]/components/SubmissionCard.tsx",
                                lineNumber: 205,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "whitespace-pre-wrap",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/components/SubmissionCard.tsx",
                        lineNumber: 208,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("time", {
                        className: "text-sm opacity-70",
                        children: new Date(createdAt).toLocaleString()
                    }, void 0, false, {
                        fileName: "[project]/components/SubmissionCard.tsx",
                        lineNumber: 211,
                        columnNumber: 9
                    }, this),
                    error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-red-600 text-sm print:hidden",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/components/SubmissionCard.tsx",
                        lineNumber: 215,
                        columnNumber: 18
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 print:hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setIsEditing(true),
                                disabled: deleting || saving || pendingDelete,
                                className: "border rounded-xl px-3 py-1",
                                children: "Edit"
                            }, void 0, false, {
                                fileName: "[project]/components/SubmissionCard.tsx",
                                lineNumber: 219,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onDelete,
                                disabled: deleting || saving || pendingDelete,
                                className: "border rounded-xl px-3 py-1",
                                children: deleting ? 'Deleting…' : 'Delete'
                            }, void 0, false, {
                                fileName: "[project]/components/SubmissionCard.tsx",
                                lineNumber: 226,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SubmissionCard.tsx",
                        lineNumber: 218,
                        columnNumber: 9
                    }, this),
                    pendingDelete && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3 print:hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Deleted."
                            }, void 0, false, {
                                fileName: "[project]/components/SubmissionCard.tsx",
                                lineNumber: 238,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onUndo,
                                className: "border rounded-xl px-3 py-1",
                                children: [
                                    "Undo (",
                                    countdown,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SubmissionCard.tsx",
                                lineNumber: 239,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SubmissionCard.tsx",
                        lineNumber: 237,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/SubmissionCard.tsx",
                lineNumber: 175,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/SubmissionCard.tsx",
        lineNumber: 158,
        columnNumber: 5
    }, this);
}
_s(SubmissionCard, "qqyndMYSqBjFF8yQyDjgo+IIt9g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = SubmissionCard;
var _c;
__turbopack_context__.k.register(_c, "SubmissionCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/MySubmissionsList.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/MySubmissionsList.tsx
__turbopack_context__.s([
    "default",
    ()=>MySubmissionsList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SubmissionCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/SubmissionCard.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function MySubmissionsList(param) {
    let { initialRows, initialNextOffset, pageSize = 10 } = param;
    _s();
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialRows);
    const [nextOffset, setNextOffset] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialNextOffset);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const sentinelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // De-dupe by id (in case of quick refreshes)
    const seen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MySubmissionsList.useMemo[seen]": ()=>new Set(items.map({
                "MySubmissionsList.useMemo[seen]": (i)=>i.id
            }["MySubmissionsList.useMemo[seen]"]))
    }["MySubmissionsList.useMemo[seen]"], [
        items
    ]);
    const loadMore = async ()=>{
        if (loading || nextOffset == null) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/submissions/list?offset=".concat(nextOffset, "&limit=").concat(pageSize), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            const data = await res.json();
            if (!res.ok) throw new Error((data === null || data === void 0 ? void 0 : data.error) || "Load failed (".concat(res.status, ")"));
            var _data_rows;
            const newRows = ((_data_rows = data === null || data === void 0 ? void 0 : data.rows) !== null && _data_rows !== void 0 ? _data_rows : []).filter((r)=>!seen.has(r.id));
            setItems((prev)=>[
                    ...prev,
                    ...newRows
                ]);
            var _data_nextOffset;
            setNextOffset((_data_nextOffset = data === null || data === void 0 ? void 0 : data.nextOffset) !== null && _data_nextOffset !== void 0 ? _data_nextOffset : null);
        } catch (e) {
            setError((e === null || e === void 0 ? void 0 : e.message) || 'Load failed');
        } finally{
            setLoading(false);
        }
    };
    // IntersectionObserver to auto-load when the sentinel becomes visible
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MySubmissionsList.useEffect": ()=>{
            const el = sentinelRef.current;
            if (!el) return;
            const io = new IntersectionObserver({
                "MySubmissionsList.useEffect": (entries)=>{
                    const first = entries[0];
                    if (first === null || first === void 0 ? void 0 : first.isIntersecting) {
                        loadMore();
                    }
                }
            }["MySubmissionsList.useEffect"], {
                rootMargin: '400px 0px'
            }) // start preloading a bit earlier
            ;
            io.observe(el);
            return ({
                "MySubmissionsList.useEffect": ()=>io.disconnect()
            })["MySubmissionsList.useEffect"];
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["MySubmissionsList.useEffect"], [
        sentinelRef.current,
        nextOffset,
        loading
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid gap-6",
        children: [
            items.length ? items.map((r, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SubmissionCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    id: r.id,
                    imageUrl: r.imageUrl,
                    description: r.description,
                    createdAt: r.createdAt,
                    reverse: i % 2 === 1
                }, r.id, false, {
                    fileName: "[project]/components/MySubmissionsList.tsx",
                    lineNumber: 72,
                    columnNumber: 9
                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "No submissions yet."
            }, void 0, false, {
                fileName: "[project]/components/MySubmissionsList.tsx",
                lineNumber: 81,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-2 print:hidden",
                children: [
                    error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-red-600",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/components/MySubmissionsList.tsx",
                        lineNumber: 86,
                        columnNumber: 18
                    }, this) : null,
                    nextOffset != null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: loadMore,
                                disabled: loading,
                                className: "border rounded-xl px-4 py-2 justify-self-center",
                                children: loading ? 'Loading…' : 'Load more'
                            }, void 0, false, {
                                fileName: "[project]/components/MySubmissionsList.tsx",
                                lineNumber: 89,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: sentinelRef,
                                "aria-hidden": true,
                                className: "h-1"
                            }, void 0, false, {
                                fileName: "[project]/components/MySubmissionsList.tsx",
                                lineNumber: 97,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-center opacity-70",
                        children: "No more items."
                    }, void 0, false, {
                        fileName: "[project]/components/MySubmissionsList.tsx",
                        lineNumber: 100,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/MySubmissionsList.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/MySubmissionsList.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
_s(MySubmissionsList, "CIO5EsOLx8tPKmuDn0NsQlYEvhE=");
_c = MySubmissionsList;
var _c;
__turbopack_context__.k.register(_c, "MySubmissionsList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_41faab6d._.js.map