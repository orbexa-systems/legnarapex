'use client'

import { useEffect, useRef } from 'react'

interface InfiniteScrollTriggerProps {
  onIntersect: () => void
  isLoading: boolean
  hasMore: boolean
}

export default function InfiniteScrollTrigger({ onIntersect, isLoading, hasMore }: InfiniteScrollTriggerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          onIntersect()
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [onIntersect, isLoading, hasMore])

  if (!hasMore) return null

  return (
    <div ref={ref} className="w-full py-10 flex justify-center">
      {isLoading && (
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 rounded-full border-2 border-legnar-red border-t-transparent animate-spin" />
          <span className="text-sm text-legnar-gray">Cargando más fotos…</span>
        </div>
      )}
    </div>
  )
}
