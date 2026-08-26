'use client'

import Image from 'next/image'
import Link from 'next/link'

const PHOTOS = [
  '/api/muestra/1',
  '/api/muestra/2',
  '/api/muestra/3',
  '/api/muestra/4',
  '/api/muestra/5',
  '/api/muestra/6',
]

const row1 = [...PHOTOS, ...PHOTOS]
const row2 = [...[...PHOTOS].reverse(), ...[...PHOTOS].reverse()]

export default function GaleriaMuestra() {
  return (
    <section className="relative py-24 overflow-hidden">

      <div className="mx-auto max-w-6xl px-6 mb-12">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
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
      </div>

      <div className="mb-4 overflow-hidden">
        <div className="flex gap-4 w-max" style={{ animation: 'scroll-left 28s linear infinite' }}>
          {row1.map((src, i) => (
            <div
              key={`r1-${i}`}
              className="relative flex-shrink-0 h-72 w-48 overflow-hidden rounded-xl border border-legnar-border"
              onContextMenu={(e) => e.preventDefault()}
            >
              <Image
                src={src}
                alt={`Foto de muestra ${(i % PHOTOS.length) + 1}`}
                fill
                className="object-cover pointer-events-none select-none"
              draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="flex gap-4 w-max" style={{ animation: 'scroll-right 34s linear infinite' }}>
          {row2.map((src, i) => (
            <div
              key={`r2-${i}`}
              className="relative flex-shrink-0 h-72 w-48 overflow-hidden rounded-xl border border-legnar-border"
              onContextMenu={(e) => e.preventDefault()}
            >
              <Image
                src={src}
                alt={`Foto de muestra ${(i % PHOTOS.length) + 1}`}
                fill
                className="object-cover pointer-events-none select-none"
              draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-legnar-black to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-legnar-black to-transparent z-10" />

      <div className="mx-auto max-w-6xl px-6">
        <p className="mt-6 text-center text-xs text-legnar-gray/50">
          Imágenes de muestra — las fotos reales se muestran con marca de agua
        </p>

        <div className="mt-16 border-t border-legnar-border pt-8 text-center">
          <p className="text-xs text-legnar-gray/40">
            © {new Date().getFullYear()} Legnar Apex · Fotografía de motociclismo
          </p>
        </div>
      </div>

      <style>{`
        @keyframes scroll-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </section>
  )
}
