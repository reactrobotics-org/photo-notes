// components/MySubmissionsList.tsx
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import SubmissionCard from '@/components/SubmissionCard'

export type SubmissionOut = {
  id: string
  description: string
  createdAt: string
  imageUrl: string
}

export default function MySubmissionsList({
  initialRows,
  initialNextOffset,
  pageSize = 10,
}: {
  initialRows: SubmissionOut[]
  initialNextOffset: number | null
  pageSize?: number
}) {
  const [items, setItems] = useState<SubmissionOut[]>(initialRows)
  const [nextOffset, setNextOffset] = useState<number | null>(initialNextOffset)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // De-dupe by id (in case of quick refreshes)
  const seen = useMemo(() => new Set(items.map(i => i.id)), [items])

  const loadMore = async () => {
    if (loading || nextOffset == null) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/submissions/list?offset=${nextOffset}&limit=${pageSize}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || `Load failed (${res.status})`)

      const newRows: SubmissionOut[] = (data?.rows ?? []).filter((r: SubmissionOut) => !seen.has(r.id))
      setItems(prev => [...prev, ...newRows])
      setNextOffset(data?.nextOffset ?? null)
    } catch (e: any) {
      setError(e?.message || 'Load failed')
    } finally {
      setLoading(false)
    }
  }

  // IntersectionObserver to auto-load when the sentinel becomes visible
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      const first = entries[0]
      if (first?.isIntersecting) {
        loadMore()
      }
    }, { rootMargin: '400px 0px' }) // start preloading a bit earlier
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentinelRef.current, nextOffset, loading])

  return (
    <div className="grid gap-6">
      {items.length ? items.map((r, i) => (
        <SubmissionCard
          key={r.id}
          id={r.id}
          imageUrl={r.imageUrl}
          description={r.description}
          createdAt={r.createdAt}
          reverse={i % 2 === 1}
        />
      )) : (
        <p>No submissions yet.</p>
      )}

      {/* Status / Controls (hidden on print) */}
      <div className="grid gap-2 print:hidden">
        {error ? <p className="text-red-600">{error}</p> : null}
        {nextOffset != null ? (
          <>
            <button
              onClick={loadMore}
              disabled={loading}
              className="border rounded-xl px-4 py-2 justify-self-center"
            >
              {loading ? 'Loading…' : 'Load more'}
            </button>
            {/* Sentinel for auto-load; the observer watches this */}
            <div ref={sentinelRef} aria-hidden className="h-1" />
          </>
        ) : (
          <p className="text-center opacity-70">No more items.</p>
        )}
      </div>
    </div>
  )
}
