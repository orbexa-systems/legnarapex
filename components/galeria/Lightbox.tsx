'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import type { Photo } from '@/lib/data/fotos'
import ProtectedImage from './ProtectedImage'

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5625384283'

interface LightboxProps {
  photos: Photo[]
  initialIndex: number
  onClose: () => void
}

export default function Lightbox({ photos, initialIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const [imageLoaded, setImageLoaded] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const photo = photos[index]
  const hasPrev = index > 0
  const hasNext = index < photos.length - 1

  const prev = useCallback(() => {
    if (index > 0) {
      setIndex((i) => i - 1)
      setImageLoaded(false)
    }
  }, [index])

  const next = useCallback(() => {
    if (index < photos.length - 1) {
      setIndex((i) => i + 1)
      setImageLoaded(false)
    }
  }, [index, photos.length])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, prev, next])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (delta > 50) next()
    else if (delta < -50) prev()
    touchStartX.current = null
  }

  const mensaje = encodeURIComponent(
    `Hola, vi mi foto con el código ${photo.code} en Legnarapex, me interesa comprarla 🏍️`,
  )
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${mensaje}`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

      <div
        className="relative z-10 flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-legnar-border bg-legnar-dark shadow-2xl h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-20 rounded-full bg-black/60 p-1.5 text-legnar-gray backdrop-blur-sm transition-colors hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="absolute left-3 top-3 z-20 rounded-md bg-black/60 px-2 py-1 text-xs text-legnar-gray backdrop-blur-sm tabular-nums">
          {index + 1} / {photos.length}
        </div>

        <div
          className="relative min-h-0 flex-1 overflow-hidden bg-legnar-black"
          onContextMenu={(e) => e.preventDefault()}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full border-2 border-legnar-red border-t-transparent animate-spin" />
            </div>
          )}

          <ProtectedImage
            src={`/api/foto/${photo.code}`}
            alt={`Foto ${photo.code}`}
            sizes="(max-width: 640px) 95vw, 768px"
            onLoad={() => setImageLoaded(true)}
            className={`photo-protected object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />

          {hasPrev && (
            <button
              onClick={prev}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/60 p-2.5 text-white backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-110"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {hasNext && (
            <button
              onClick={next}
              aria-label="Siguiente foto"
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/60 p-2.5 text-white backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-110"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 border-t border-legnar-border px-6 py-5 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="text-[10px] uppercase tracking-widest text-legnar-gray">Código de foto</p>
            <p className="font-mono text-2xl font-bold tracking-widest text-legnar-gold">
              {photo.code}
            </p>
            <p className="mt-0.5 text-xs text-legnar-gray">
              {new Date(photo.photo_date + 'T00:00:00').toLocaleDateString('es-MX', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}{' '}
              · {photo.photo_time.slice(0, 5)} h
            </p>
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-[0_0_0_0_#16a34a] transition-all hover:bg-green-500 hover:shadow-[0_0_20px_#16a34a66]"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Me interesa esta foto
          </a>
        </div>
      </div>
    </div>
  )
}
