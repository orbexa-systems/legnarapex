'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const PHOTOS = [
  '/muestra/muestra-1.jpg',
  '/muestra/muestra-2.jpg',
  '/muestra/muestra-3.jpg',
  '/muestra/muestra-4.jpg',
  '/muestra/muestra-5.jpg',
  '/muestra/muestra-6.jpg',
]

const INTERVAL = 5000

export default function GaleriaMuestra() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const prev = useCallback(
    () => setCurrent((i) => (i === 0 ? PHOTOS.length - 1 : i - 1)),
    [],
  )
  const next = useCallback(
    () => setCurrent((i) => (i === PHOTOS.length - 1 ? 0 : i + 1)),
    [],
  )

  // Restart the auto-advance timer whenever the current slide or paused state changes.
  // This ensures a manual navigation always gives a full INTERVAL before auto-advance.
  useEffect(() => {
    if (paused) return
    const id = setInterval(next, INTERVAL)
    return () => clearInterval(id)
  }, [paused, current, next])

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-6xl">

        <div className="mb-12 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-legnar-gold">
              Vista previa
            </span>
            <h2
              className="text-[clamp(2.5rem,6vw,4.5rem)] uppercase leading-none tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Galería de muestra
            </h2>
          </div>
          <Link
            href="/galeria"
            className="shrink-0 rounded-full border border-legnar-red bg-legnar-red/10 px-6 py-2.5 text-sm font-semibold uppercase tracking-widest text-legnar-white transition-all hover:bg-legnar-red hover:shadow-[0_0_20px_#C0392B66]"
          >
            Ver todas las fotos
          </Link>
        </div>

        <div
          className="relative aspect-[3/2] sm:aspect-[16/9] overflow-hidden rounded-2xl border border-legnar-border"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {PHOTOS.map((src, i) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <Image
                src={src}
                alt={`Foto de muestra ${i + 1}`}
                fill
                className="object-cover"
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          ))}

          <button
            onClick={prev}
            aria-label="Foto anterior"
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-110"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={next}
            aria-label="Siguiente foto"
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-110"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {PHOTOS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Ir a foto ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-6 bg-legnar-red'
                    : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-legnar-gray/50">
          Imágenes de muestra — las fotos reales se muestran con marca de agua
        </p>

        <div className="mt-16 border-t border-legnar-border pt-8 text-center">
          <p className="text-xs text-legnar-gray/40">
            © {new Date().getFullYear()} Legnar Apex · Fotografía de motociclismo
          </p>
        </div>
      </div>
    </section>
  )
}
