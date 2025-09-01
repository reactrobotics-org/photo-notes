module.exports = [
"[project]/components/NewSubmissionForm.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/NewSubmissionForm.tsx
__turbopack_context__.s([
    "default",
    ()=>NewSubmissionForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
/** ---- Tunables for compression ---- */ const MAX_DIMENSION = 1920; // px: longest side after resize
const TARGET_MAX_BYTES = 1_500_000; // ~1.5MB target size
const START_QUALITY = 0.85; // initial quality for compression
const MIN_QUALITY = 0.5; // lowest we’ll go on quality
const SCALE_STEP = 0.85; // if still too big, scale image down by this factor and retry
const MAX_ITERATIONS = 8; // safety cap for compression loops
function NewSubmissionForm({ userId: _userId }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabaseBrowser"])();
    const [file, setFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [desc, setDesc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // If session disappears, bounce back to /
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const check = async ()=>{
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) router.replace('/');
        };
        check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // Preview URL for the chosen file
    const previewUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>file ? URL.createObjectURL(file) : null, [
        file
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [
        previewUrl
    ]);
    const onFileChange = (f)=>{
        setError(null);
        if (!f) {
            setFile(null);
            return;
        }
        if (!f.type.startsWith('image/')) {
            setError('Please choose an image.');
            setFile(null);
            return;
        }
        // Let very large originals through — we’ll compress them below.
        if (f.size > 40 * 1024 * 1024) {
            setError('Image too large (max 40 MB).');
            setFile(null);
            return;
        }
        setFile(f);
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError(null);
        if (!file) {
            setError('Please select a photo.');
            return;
        }
        const trimmed = desc.trim();
        if (!trimmed) {
            setError('Please write a short description.');
            return;
        }
        if (trimmed.length > 2000) {
            setError('Description is too long (max 2000 chars).');
            return;
        }
        setLoading(true);
        try {
            // Confirm session (helps avoid RLS issues)
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setError('You are not signed in.');
                router.replace('/');
                return;
            }
            // 1) Resize + compress on client
            const processed = await resizeAndCompress(file, {
                maxDimension: MAX_DIMENSION,
                targetMaxBytes: TARGET_MAX_BYTES,
                startQuality: START_QUALITY,
                minQuality: MIN_QUALITY,
                scaleStep: SCALE_STEP,
                maxIterations: MAX_ITERATIONS
            });
            // Name & type for upload
            const ext = processed.ext // 'webp' or 'jpg'
            ;
            const uploadFile = new File([
                processed.blob
            ], `upload.${ext}`, {
                type: processed.mime
            });
            // 2) Build Storage key like: <userId>/<uuid>.<ext>
            const key = `${user.id}/${crypto.randomUUID()}.${ext}`;
            console.log('[NewSubmissionForm] Uploading to key:', key, 'size:', uploadFile.size);
            // 3) Upload to private bucket 'photos'
            const { error: upErr } = await supabase.storage.from('photos').upload(key, uploadFile, {
                cacheControl: '3600',
                upsert: false,
                contentType: uploadFile.type
            });
            if (upErr) {
                console.error('[NewSubmissionForm] upload error:', upErr);
                throw new Error(upErr.message);
            }
            // 4) Insert DB row via server API (ensures cookies/session are used server-side)
            const res = await fetch('/api/submissions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image_path: key,
                    description: trimmed
                })
            });
            const bodyText = await res.text();
            console.log('[NewSubmissionForm] /api/submissions status:', res.status, 'body:', bodyText);
            if (!res.ok) {
                let msg = 'Insert failed';
                try {
                    msg = JSON.parse(bodyText).error || msg;
                } catch  {}
                throw new Error(msg);
            }
            router.replace('/my');
        } catch (err) {
            setError(err?.message || 'Something went wrong.');
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "p-6 max-w-3xl mx-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-xl font-bold mb-4",
                children: "New Submission"
            }, void 0, false, {
                fileName: "[project]/components/NewSubmissionForm.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "grid gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "font-medium",
                                children: "Photo"
                            }, void 0, false, {
                                fileName: "[project]/components/NewSubmissionForm.tsx",
                                lineNumber: 126,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "file",
                                accept: "image/*",
                                capture: "environment",
                                onChange: (e)=>onFileChange(e.target.files?.[0] ?? null)
                            }, void 0, false, {
                                fileName: "[project]/components/NewSubmissionForm.tsx",
                                lineNumber: 127,
                                columnNumber: 11
                            }, this),
                            previewUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: previewUrl,
                                alt: "preview",
                                className: "mt-2 max-h-80 rounded-lg border"
                            }, void 0, false, {
                                fileName: "[project]/components/NewSubmissionForm.tsx",
                                lineNumber: 134,
                                columnNumber: 13
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm opacity-70",
                                children: [
                                    "We’ll resize large images to ",
                                    MAX_DIMENSION,
                                    "px and compress to ~",
                                    Math.round(TARGET_MAX_BYTES / 1024 / 1024 * 10) / 10,
                                    " MB."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/NewSubmissionForm.tsx",
                                lineNumber: 136,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/NewSubmissionForm.tsx",
                        lineNumber: 125,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "desc",
                                className: "font-medium",
                                children: "Description"
                            }, void 0, false, {
                                fileName: "[project]/components/NewSubmissionForm.tsx",
                                lineNumber: 142,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                id: "desc",
                                className: "border rounded-xl p-3 min-h-28",
                                placeholder: "Write a few sentences about the photo…",
                                value: desc,
                                onChange: (e)=>setDesc(e.target.value),
                                maxLength: 2000
                            }, void 0, false, {
                                fileName: "[project]/components/NewSubmissionForm.tsx",
                                lineNumber: 143,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm opacity-70",
                                children: [
                                    desc.length,
                                    "/2000"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/NewSubmissionForm.tsx",
                                lineNumber: 151,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/NewSubmissionForm.tsx",
                        lineNumber: 141,
                        columnNumber: 9
                    }, this),
                    error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-red-600",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/components/NewSubmissionForm.tsx",
                        lineNumber: 154,
                        columnNumber: 18
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: loading,
                                className: "border rounded-xl px-4 py-2",
                                children: loading ? 'Saving…' : 'Save'
                            }, void 0, false, {
                                fileName: "[project]/components/NewSubmissionForm.tsx",
                                lineNumber: 157,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>router.back(),
                                className: "border rounded-xl px-4 py-2",
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/components/NewSubmissionForm.tsx",
                                lineNumber: 160,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/NewSubmissionForm.tsx",
                        lineNumber: 156,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/NewSubmissionForm.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/NewSubmissionForm.tsx",
        lineNumber: 121,
        columnNumber: 5
    }, this);
}
/**
 * Resize the image to fit within maxDimension, then compress to WEBP (fallback JPEG),
 * iteratively reducing quality and/or scale until <= targetMaxBytes or limits reached.
 */ async function resizeAndCompress(file, opts) {
    // 1) Decode
    const imgData = await decodeImage(file);
    // 2) Initial target size based on maxDimension
    let targetW = imgData.width;
    let targetH = imgData.height;
    const longest = Math.max(targetW, targetH);
    if (longest > opts.maxDimension) {
        const scale = opts.maxDimension / longest;
        targetW = Math.round(targetW * scale);
        targetH = Math.round(targetH * scale);
    }
    // 3) Try WEBP first, fallback to JPEG if not supported
    let mime = 'image/webp';
    if (!await canvasTypeSupported('image/webp')) {
        mime = 'image/jpeg';
    }
    // 4) Iteratively compress
    let quality = opts.startQuality;
    let iterations = 0;
    let blob = null;
    while(iterations < opts.maxIterations){
        const cvs = document.createElement('canvas');
        cvs.width = targetW;
        cvs.height = targetH;
        const ctx = cvs.getContext('2d');
        if (!ctx) throw new Error('Canvas 2D context not available');
        ctx.drawImage(imgData.image, 0, 0, targetW, targetH);
        blob = await canvasToBlob(cvs, mime, quality);
        if (blob && blob.size <= opts.targetMaxBytes) {
            break; // success
        }
        // If quality can still drop, do that first
        if (quality > opts.minQuality) {
            quality = Math.max(opts.minQuality, quality - 0.1);
        } else {
            // Otherwise scale down further and retry
            const newW = Math.round(targetW * opts.scaleStep);
            const newH = Math.round(targetH * opts.scaleStep);
            if (newW < 720 && newH < 720) {
                break;
            }
            targetW = newW;
            targetH = newH;
        }
        iterations++;
    }
    if (!blob) {
        // As a last resort, upload original
        return {
            blob: file,
            mime: file.type.startsWith('image/') ? file.type : 'image/jpeg',
            ext: file.type === 'image/webp' ? 'webp' : 'jpg',
            width: imgData.width,
            height: imgData.height
        };
    }
    // If WEBP failed to produce data, fallback to JPEG once
    if (blob.size === 0 && mime === 'image/webp') {
        mime = 'image/jpeg';
        const cvs = document.createElement('canvas');
        cvs.width = targetW;
        cvs.height = targetH;
        const ctx = cvs.getContext('2d');
        if (!ctx) throw new Error('Canvas 2D context not available');
        ctx.drawImage(imgData.image, 0, 0, targetW, targetH);
        const jpegBlob = await canvasToBlob(cvs, mime, quality);
        if (jpegBlob) blob = jpegBlob;
    }
    return {
        blob,
        mime,
        ext: mime === 'image/webp' ? 'webp' : 'jpg',
        width: targetW,
        height: targetH
    };
}
async function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve, reject)=>{
        canvas.toBlob((b)=>{
            if (!b) return reject(new Error('Failed to create blob'));
            resolve(b);
        }, type, quality);
    });
}
async function canvasTypeSupported(type) {
    const c = document.createElement('canvas');
    if (!('toDataURL' in c)) return false;
    const data = c.toDataURL(type);
    return data.startsWith(`data:${type}`);
}
async function decodeImage(file) {
    // Try ImageBitmap (fast, may auto-honor EXIF in some browsers)
    try {
        const bmp = await createImageBitmap(file);
        return {
            image: bmp,
            width: bmp.width,
            height: bmp.height
        };
    } catch  {
        // Fallback: HTMLImageElement
        const url = URL.createObjectURL(file);
        try {
            const img = await loadHtmlImage(url);
            return {
                image: img,
                width: img.naturalWidth,
                height: img.naturalHeight
            };
        } finally{
            URL.revokeObjectURL(url);
        }
    }
}
function loadHtmlImage(url) {
    return new Promise((resolve, reject)=>{
        const img = new Image();
        img.onload = ()=>resolve(img);
        img.onerror = (e)=>reject(new Error('Failed to load image'));
        img.src = url;
    });
}
}),
"[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-ssr] (ecmascript)");
}),
];

//# sourceMappingURL=_401289b3._.js.map