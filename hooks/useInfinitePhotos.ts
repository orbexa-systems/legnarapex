'use client'

import { useState, useCallback, useRef } from 'react'
import type { Photo, PhotosByCriteriaParams } from '@/lib/data/fotos'

interface UseInfinitePhotosReturn {
  photos: Photo[]
  isLoadingMore: boolean
  hasMore: boolean
  total: number
  error: string | null
  loadMore: () => Promise<void>
}

export function useInfinitePhotos(
  initialPhotos: Photo[],
  initialHasMore: boolean,
  initialTotal: number,
  queryParams: PhotosByCriteriaParams,
): UseInfinitePhotosReturn {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [total, setTotal] = useState(initialTotal)
  const [error, setError] = useState<string | null>(null)
  const currentPage = useRef(1)

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return
    setIsLoadingMore(true)
    setError(null)

    const nextPage = currentPage.current + 1
    const qs = new URLSearchParams()
    if (queryParams.location_id) qs.set('location_id', queryParams.location_id)
    if (queryParams.date)        qs.set('date', queryParams.date)
    if (queryParams.code)        qs.set('code', queryParams.code)
    if (queryParams.time_slot)   qs.set('time_slot', queryParams.time_slot)
    qs.set('page', nextPage.toString())

    try {
      const res = await fetch(`/api/galeria/photos?${qs.toString()}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setPhotos(prev => [...prev, ...data.photos])
      setHasMore(data.hasMore)
      setTotal(data.total)
      currentPage.current = nextPage
    } catch {
      setError('Error al cargar más fotos.')
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, hasMore, queryParams])

  return { photos, isLoadingMore, hasMore, total, error, loadMore }
}
