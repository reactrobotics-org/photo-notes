// components/NewSubmissionForm.tsx
'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

const MAX_DESC = 500
const MAX_DIM = 1600
const QUALITY = 0.8

type MyTeam = { team_id: string; name: string; role: 'owner' | 'member' }

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Image load failed'))
    img.src = src
  })
}
function calcSize(w: number, h: number, maxSide: number) {
  if (w <= maxSide && h <= maxSide) return { w, h }
  const s = w > h ? maxSide / w : maxSide / h
  return { w: Math.round(w * s), h: Math.round(h * s) }
}
async function canvasToBlob(canvas: HTMLCanvasElement, mime: 'image/webp'|'image/jpeg', q: number) {
  return new Promise<Blob>((res, rej) => canvas.toBlob(b => b ? res(b) : rej(new Error('toBlob null')), mime, q))
}
async function downscale(file: File) {
  const url = URL.createObjectURL(file)
  try {
    const img = await loadImage(url)
    const { w, h } = calcSize(img.naturalWidth || img.width, img.naturalHeight || img.height, MAX_DIM)
    const canvas = document.createElement('canvas')
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, w, h)
    try {
      const webp = await canvasToBlob(canvas, 'image/webp', QUALITY)
      return { blob: webp, mime: 'image/webp' as const }
    } catch {
      const jpg = await canvasToBlob(canvas, 'image/jpeg', QUALITY)
      return { blob: jpg, mime: 'image/jpeg' as const }
    }
  } finally {
    URL.revokeObjectURL(url)
  }
}

export default function NewSubmissionForm() {
  const supabase = supabaseBrowser()
  const router = useRouter()

  const [teams, setTeams] = useState<MyTeam[]>([])
  const [teamId, setTeamId] = useState<string>('')

  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement | null>(null)

  // load teams
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/teams', { cache: 'no-store' })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Failed to load teams')
        setTeams(json.teams || [])
        if ((json.teams || []).length) setTeamId(json.teams[0].team_id)
      } catch (e:any) {
        setError(e.message || 'Failed to load teams')
      }
    }
    load()
  }, [])

  // preview
  useEffect(() => {
    if (!file) { setPreviewUrl(null); return }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const canSubmit = useMemo(() =>
    !!teamId && !!file && description.trim().length > 0 && description.trim().length <= MAX_DESC && !saving
  , [teamId, file, description, saving])

  const onPick = () => inputRef.current?.click()
  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setError(null)
    const f = e.target.files?.[0] || null
    setFile(f); setFileName(f ? f.name : '')
  }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault(); setError(null)
    if (!teamId) { setError('Please select a team.'); return }
    if (!file) { setError('Please choose a photo.'); return }
    const trimmed = description.trim()
    if (!trimmed) { setError('Please add a short description.'); return }
    if (trimmed.length > MAX_DESC) { setError(`Max ${MAX_DESC} characters.`); return }

    setSaving(true)
    try {
      const { data: { user }, error: authErr } = await supabase.auth.getUser()
      if (authErr) throw new Error(authErr.message)
      if (!user) { window.location.href = '/(auth)/login'; return }

      const { blob, mime } = await downscale(file)
      const ext = mime === 'image/webp' ? 'webp' : 'jpg'
      const key = `${user.id}/${crypto.randomUUID()}.${ext}`

      const { error: upErr } = await supabase.storage.from('photos').upload(key, blob, {
        cacheControl: '3600', upsert: false, contentType: mime,
      })
      if (upErr) throw new Error(upErr.message)

      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_path: key, description: trimmed, team_id: teamId }),
      })
      const t = await res.text()
      if (!res.ok) {
        try { throw new Error(JSON.parse(t).error || 'Insert failed') } catch { throw new Error(t || 'Insert failed') }
      }

      router.push('/my'); router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      {/* Team */}
      <div className="grid gap-2">
        <label htmlFor="team" className="text-sm font-semibold">Team</label>
        <select
          id="team"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          className="border border-neutral-300 dark:border-neutral-700 rounded-xl p-2 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
        >
          {teams.map(t => (
            <option key={t.team_id} value={t.team_id}>
              {t.name} {t.role === 'owner' ? ' (owner)' : ''}
            </option>
          ))}
        </select>
        {!teams.length && <p className="text-sm opacity-80">You’re not in any teams yet. Ask an owner to add you.</p>}
      </div>

      {/* File picker */}
      <div className="grid gap-2">
        <label className="text-sm font-semibold">Photo</label>
        <input ref={inputRef} type="file" accept="image/*" capture="environment" className="sr-only" onChange={onFileChange} />
        <div className="flex items-center gap-3">
          <button type="button" onClick={onPick}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-700 px-3 py-2 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M20 17.5A3.5 3.5 0 1 1 13 17.5 3.5 3.5 0 0 1 20 17.5ZM16.75 2a2.75 2.75 0 0 1 2.694 2.248l.04.252H21a2 2 0 0 1 1.995 1.85L23 6.5V17a3 3 0 0 1-2.824 2.995L20 20H6a3 3 0 0 1-2.995-2.824L3 17V6.5a2 2 0 0 1 1.85-1.995L5 4.5h1.516a2.75 2.75 0 0 1 2.494-2.495L9.75 2h7ZM12 7.75a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z"/></svg>
            Choose Photo
          </button>
          <span className="text-sm opacity-90 truncate max-w-[60ch]">{fileName || 'No file chosen'}</span>
        </div>
        {previewUrl && (
          <div className="mt-2">
            <img src={previewUrl} alt="Preview" className="w-full max-w-md rounded-xl border border-neutral-200 dark:border-neutral-700 object-cover" />
          </div>
        )}
      </div>

      {/* Description */}
      <div className="grid gap-2">
        <label htmlFor="desc" className="text-sm font-semibold">Description</label>
        <textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={MAX_DESC}
          placeholder="Write a few sentences describing the photo…"
          className="border border-neutral-300 dark:border-neutral-700 rounded-xl p-3 min-h-28 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100" />
        <div className="text-xs opacity-70">{description.length}/{MAX_DESC}</div>
      </div>

      {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={!canSubmit}
          className="rounded-xl border border-neutral-300 dark:border-neutral-700 px-4 py-2 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save'}
        </button>
        <a href="/my" className="rounded-xl border border-neutral-300 dark:border-neutral-700 px-4 py-2">Cancel</a>
      </div>
    </form>
  )
}
