// components/NewSubmissionForm.tsx
'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabaseClient'

/** ---- Tunables for compression ---- */
const MAX_DIMENSION = 1920;          // px: longest side after resize
const TARGET_MAX_BYTES = 1_500_000;  // ~1.5MB target size
const START_QUALITY = 0.85;          // initial quality for compression
const MIN_QUALITY = 0.5;             // lowest we’ll go on quality
const SCALE_STEP = 0.85;             // if still too big, scale image down by this factor and retry
const MAX_ITERATIONS = 8;            // safety cap for compression loops

export default function NewSubmissionForm({ userId: _userId }: { userId: string }) {
  const router = useRouter()
  const supabase = supabaseBrowser()

  const [file, setFile] = useState<File | null>(null)
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // If session disappears, bounce back to /
  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.replace('/')
    }
    check()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Preview URL for the chosen file
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const onFileChange = (f: File | null) => {
    setError(null)
    if (!f) { setFile(null); return }
    if (!f.type.startsWith('image/')) { setError('Please choose an image.'); setFile(null); return }
    // Let very large originals through — we’ll compress them below.
    if (f.size > 40 * 1024 * 1024) { setError('Image too large (max 40 MB).'); setFile(null); return }
    setFile(f)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!file) { setError('Please select a photo.'); return }
    const trimmed = desc.trim()
    if (!trimmed) { setError('Please write a short description.'); return }
    if (trimmed.length > 2000) { setError('Description is too long (max 2000 chars).'); return }

    setLoading(true)
    try {
      // Confirm session (helps avoid RLS issues)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError('You are not signed in.'); router.replace('/'); return }

      // 1) Resize + compress on client
      const processed = await resizeAndCompress(file, {
        maxDimension: MAX_DIMENSION,
        targetMaxBytes: TARGET_MAX_BYTES,
        startQuality: START_QUALITY,
        minQuality: MIN_QUALITY,
        scaleStep: SCALE_STEP,
        maxIterations: MAX_ITERATIONS,
      })

      // Name & type for upload
      const ext = processed.ext // 'webp' or 'jpg'
      const uploadFile = new File([processed.blob], `upload.${ext}`, { type: processed.mime })

      // 2) Build Storage key like: <userId>/<uuid>.<ext>
      const key = `${user.id}/${crypto.randomUUID()}.${ext}`
      console.log('[NewSubmissionForm] Uploading to key:', key, 'size:', uploadFile.size)

      // 3) Upload to private bucket 'photos'
      const { error: upErr } = await supabase
        .storage.from('photos')
        .upload(key, uploadFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: uploadFile.type,
        })
      if (upErr) {
        console.error('[NewSubmissionForm] upload error:', upErr)
        throw new Error(upErr.message)
      }

      // 4) Insert DB row via server API (ensures cookies/session are used server-side)
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_path: key, description: trimmed }),
      })
      const bodyText = await res.text()
      console.log('[NewSubmissionForm] /api/submissions status:', res.status, 'body:', bodyText)
      if (!res.ok) {
        let msg = 'Insert failed'
        try { msg = JSON.parse(bodyText).error || msg } catch {}
        throw new Error(msg)
      }

      router.replace('/my')
    } catch (err: any) {
      setError(err?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">New Submission</h1>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <label className="font-medium">Photo</label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          />
          {previewUrl ? (
            <img src={previewUrl} alt="preview" className="mt-2 max-h-80 rounded-lg border" />
          ) : null}
          <p className="text-sm opacity-70">
            We’ll resize large images to {MAX_DIMENSION}px and compress to ~{Math.round(TARGET_MAX_BYTES / 1024 / 1024 * 10) / 10} MB.
          </p>
        </div>

        <div className="grid gap-2">
          <label htmlFor="desc" className="font-medium">Description</label>
          <textarea
            id="desc"
            className="border rounded-xl p-3 min-h-28"
            placeholder="Write a few sentences about the photo…"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            maxLength={2000}
          />
          <div className="text-sm opacity-70">{desc.length}/2000</div>
        </div>

        {error ? <p className="text-red-600">{error}</p> : null}

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="border rounded-xl px-4 py-2">
            {loading ? 'Saving…' : 'Save'}
          </button>
          <button type="button" onClick={() => router.back()} className="border rounded-xl px-4 py-2">
            Cancel
          </button>
        </div>
      </form>
    </main>
  )
}

/* ======================= Helpers: resize & compress ======================= */

type CompressOptions = {
  maxDimension: number
  targetMaxBytes: number
  startQuality: number
  minQuality: number
  scaleStep: number
  maxIterations: number
}

type ProcessedImage = {
  blob: Blob
  mime: 'image/webp' | 'image/jpeg'
  ext: 'webp' | 'jpg'
  width: number
  height: number
}

/**
 * Resize the image to fit within maxDimension, then compress to WEBP (fallback JPEG),
 * iteratively reducing quality and/or scale until <= targetMaxBytes or limits reached.
 */
async function resizeAndCompress(file: File, opts: CompressOptions): Promise<ProcessedImage> {
  // 1) Decode
  const imgData = await decodeImage(file)

  // 2) Initial target size based on maxDimension
  let targetW = imgData.width
  let targetH = imgData.height
  const longest = Math.max(targetW, targetH)
  if (longest > opts.maxDimension) {
    const scale = opts.maxDimension / longest
    targetW = Math.round(targetW * scale)
    targetH = Math.round(targetH * scale)
  }

  // 3) Try WEBP first, fallback to JPEG if not supported
  let mime: 'image/webp' | 'image/jpeg' = 'image/webp'
  if (!await canvasTypeSupported('image/webp')) {
    mime = 'image/jpeg'
  }

  // 4) Iteratively compress
  let quality = opts.startQuality
  let iterations = 0
  let blob: Blob | null = null

  while (iterations < opts.maxIterations) {
    const cvs = document.createElement('canvas')
    cvs.width = targetW
    cvs.height = targetH
    const ctx = cvs.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context not available')
    ctx.drawImage(imgData.image, 0, 0, targetW, targetH)

    blob = await canvasToBlob(cvs, mime, quality)

    if (blob && blob.size <= opts.targetMaxBytes) {
      break // success
    }

    // If quality can still drop, do that first
    if (quality > opts.minQuality) {
      quality = Math.max(opts.minQuality, quality - 0.1)
    } else {
      // Otherwise scale down further and retry
      const newW = Math.round(targetW * opts.scaleStep)
      const newH = Math.round(targetH * opts.scaleStep)
      if (newW < 720 && newH < 720) {
        // don’t shrink forever; accept current blob even if larger than target
        break
      }
      targetW = newW
      targetH = newH
    }

    iterations++
  }

  if (!blob) {
    // As a last resort, upload original
    return {
      blob: file,
      mime: file.type.startsWith('image/') ? (file.type as any) : 'image/jpeg',
      ext: file.type === 'image/webp' ? 'webp' : 'jpg',
      width: imgData.width,
      height: imgData.height,
    }
  }

  // If WEBP failed to produce data, fallback to JPEG once
  if (blob.size === 0 && mime === 'image/webp') {
    mime = 'image/jpeg'
    const cvs = document.createElement('canvas')
    cvs.width = targetW
    cvs.height = targetH
    const ctx = cvs.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context not available')
    ctx.drawImage(imgData.image, 0, 0, targetW, targetH)
    const jpegBlob = await canvasToBlob(cvs, mime, quality)
    if (jpegBlob) blob = jpegBlob
  }

  return {
    blob,
    mime,
    ext: mime === 'image/webp' ? 'webp' : 'jpg',
    width: targetW,
    height: targetH,
  }
}

async function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (!b) return reject(new Error('Failed to create blob'))
      resolve(b)
    }, type, quality)
  })
}

async function canvasTypeSupported(type: string): Promise<boolean> {
  const c = document.createElement('canvas')
  if (!('toDataURL' in c)) return false
  const data = c.toDataURL(type)
  return data.startsWith(`data:${type}`)
}

async function decodeImage(file: File): Promise<{ image: CanvasImageSource, width: number, height: number }> {
  // Try ImageBitmap (fast, may auto-honor EXIF in some browsers)
  try {
    const bmp = await createImageBitmap(file)
    return { image: bmp, width: bmp.width, height: bmp.height }
  } catch {
    // Fallback: HTMLImageElement
    const url = URL.createObjectURL(file)
    try {
      const img = await loadHtmlImage(url)
      return { image: img, width: img.naturalWidth, height: img.naturalHeight }
    } finally {
      URL.revokeObjectURL(url)
    }
  }
}

function loadHtmlImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(new Error('Failed to load image'))
    img.src = url
  })
}
