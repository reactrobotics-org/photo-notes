// components/NewSubmissionForm.tsx
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function NewSubmissionForm() {
  const supabase = supabaseBrowser()
  const router = useRouter()

  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement | null>(null)

  // Create/cleanup a local preview
  useEffect(() => {
    if (!file) { setPreviewUrl(null); return }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const canSubmit = useMemo(() => {
    return !!file && description.trim().length > 0 && !saving
  }, [file, description, saving])

  const onPickFile = () => {
    inputRef.current?.click()
  }

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setError(null)
    const f = e.target.files?.[0] || null
    setFile(f)
    setFileName(f ? f.name : '')
  }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setError(null)

    if (!file) { setError('Please choose a photo.'); return }
    const trimmed = description.trim()
    if (!trimmed) { setError('Please add a short description.'); return }
    if (trimmed.length > 2000) { setError('Max 2000 characters.'); return }

    setSaving(true)
    try {
      // Ensure we have a user
      const { data: { user }, error: authErr } = await supabase.auth.getUser()
      if (authErr) throw new Error(authErr.message)
      if (!user) { window.location.href = '/(auth)/login'; return }

      // Build a user-scoped key to satisfy Storage RLS
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
      const key = `${user.id}/${crypto.randomUUID()}.${ext}`

      const { error: upErr } = await supabase.storage
        .from('photos')
        .upload(key, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || 'image/jpeg',
        })

      if (upErr) throw new Error(upErr.message)

      // Create DB row
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_path: key, description: trimmed }),
      })
      if (!res.ok) {
        const t = await res.text().catch(() => '')
        try {
          const j = JSON.parse(t) as { error?: string }
          throw new Error(j.error || 'Insert failed')
        } catch {
          throw new Error(t || 'Insert failed')
        }
      }

      router.push('/my')
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      {/* File picker */}
      <div className="grid gap-2">
        <label className="text-sm font-semibold">Photo</label>

        {/* Hidden native input */}
        <input
          ref={inputRef}
          id="photo-input"
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={onFileChange}
        />

        {/* Visible “button” for choosing a file */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPickFile}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-700 px-3 py-2 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {/* simple icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
              <path d="M20 17.5A3.5 3.5 0 1 1 13 17.5 3.5 3.5 0 0 1 20 17.5ZM16.75 2a2.75 2.75 0 0 1 2.694 2.248l.04.252H21a2 2 0 0 1 1.995 1.85L23 6.5V17a3 3 0 0 1-2.824 2.995L20 20H6a3 3 0 0 1-2.995-2.824L3 17V6.5a2 2 0 0 1 1.85-1.995L5 4.5h1.516a2.75 2.75 0 0 1 2.494-2.495L9.75 2h7ZM12 7.75a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z"/>
            </svg>
            Choose Photo
          </button>

          {/* Selected file name */}
          <span className="text-sm opacity-90 truncate max-w-[60ch]">
            {fileName || 'No file chosen'}
          </span>
        </div>

        {/* Preview (if selected) */}
        {previewUrl && (
          <div className="mt-2">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full max-w-md rounded-xl border border-neutral-200 dark:border-neutral-700 object-cover"
            />
          </div>
        )}
      </div>

      {/* Description */}
      <div className="grid gap-2">
        <label htmlFor="desc" className="text-sm font-semibold">Description</label>
        <textarea
          id="desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={2000}
          placeholder="Write a few sentences describing the photo…"
          className="border border-neutral-300 dark:border-neutral-700 rounded-xl p-3 min-h-28 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
        />
        <div className="text-xs opacity-70">{description.length}/2000</div>
      </div>

      {/* Errors */}
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
      )}

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-xl border border-neutral-300 dark:border-neutral-700 px-4 py-2 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <a
          href="/my"
          className="rounded-xl border border-neutral-300 dark:border-neutral-700 px-4 py-2"
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
