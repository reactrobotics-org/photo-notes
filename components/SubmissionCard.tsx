// components/SubmissionCard.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const MAX_DESC = 500

type Props = {
  id: string
  imageUrl?: string
  description: string
  createdAt: string
  reverse?: boolean
}

export default function SubmissionCard({
  id,
  imageUrl,
  description,
  createdAt,
  reverse = false,
}: Props) {
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(description)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSave = async () => {
    setError(null)
    const trimmed = text.trim()
    if (!trimmed) { setError('Description cannot be empty.'); return }
    if (trimmed.length > MAX_DESC) { setError(`Max ${MAX_DESC} characters.`); return }

    setSaving(true)
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: trimmed }),
      })
      const t = await res.text()
      if (!res.ok) {
        let msg = 'Update failed'
        try { msg = JSON.parse(t).error || msg } catch {}
        throw new Error(msg)
      }
      setIsEditing(false)
      router.refresh()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    const ok = confirm('Delete this submission? This cannot be undone.')
    if (!ok) return

    setError(null)
    setDeleting(true)
    try {
      const res = await fetch(`/api/submissions/${id}`, { method: 'DELETE' })
      const t = await res.text()
      if (!res.ok) {
        let msg = 'Delete failed'
        try { msg = JSON.parse(t).error || msg } catch {}
        throw new Error(msg)
      }
      router.refresh()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  const imageColOrder = reverse ? 'md:order-2' : 'md:order-1'
  const textColOrder  = reverse ? 'md:order-1' : 'md:order-2'

  return (
    <article className="border rounded-xl p-4 grid gap-4 md:grid-cols-[260px_1fr] items-start print:border-0 print:p-0 print:shadow-none print:break-inside-avoid">
      {/* Image */}
      <div className={imageColOrder}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="submission"
            className="w-full h-auto rounded-lg object-cover max-h-[420px]"
          />
        ) : (
          <div className="w-full aspect-video rounded-lg border grid place-items-center text-sm text-gray-500">
            No image
          </div>
        )}
      </div>

      {/* Text / Meta / Actions */}
      <div className={`grid gap-3 ${textColOrder}`}>
        {isEditing ? (
          <>
            <div className="grid gap-2 print:hidden">
              <textarea
                className="border rounded-xl p-3 min-h-28"
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={MAX_DESC}
              />
              <div className="text-sm opacity-70">{text.length}/{MAX_DESC}</div>
              <div className="flex gap-2">
                <button
                  onClick={onSave}
                  disabled={saving}
                  className="border rounded-xl px-3 py-1"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button
                  onClick={() => { setIsEditing(false); setText(description) }}
                  disabled={saving}
                  className="border rounded-xl px-3 py-1"
                >
                  Cancel
                </button>
              </div>
            </div>
            <p className="whitespace-pre-wrap hidden print:block">{description}</p>
          </>
        ) : (
          <p className="whitespace-pre-wrap">{description}</p>
        )}

        <time className="text-sm opacity-70">
          {new Date(createdAt).toLocaleString()}
        </time>

        {error ? <p className="text-red-600 text-sm print:hidden">{error}</p> : null}

        {/* Buttons hidden on print */}
        <div className="flex gap-2 print:hidden">
          <button
            onClick={() => setIsEditing(true)}
            disabled={deleting || saving}
            className="border rounded-xl px-3 py-1"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            disabled={deleting || saving}
            className="border rounded-xl px-3 py-1"
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </article>
  )
}
