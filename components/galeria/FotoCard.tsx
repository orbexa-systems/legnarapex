'use client'

import type { Foto } from '@/lib/data/fotos'

interface FotoCardProps {
  foto: Foto
  onOpen: (foto: Foto) => void
}

export default function FotoCard({ foto, onOpen }: FotoCardProps) {
  return (
    <button
      onClick={() => onOpen(foto)}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-legnar-border bg-legnar-dark text-left transition-all duration-300 hover:border-legnar-red/50 hover:shadow-[0_0_24px_#C0392B22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-legnar-red"
    >
      <div
        className="relative aspect-[3/2] w-full overflow-hidden bg-legnar-dark"
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* watermarked image — drag and context menu disabled */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={foto.url_foto}
          alt={`Foto ${foto.codigo}`}
          draggable={false}
          className="photo-protected h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-legnar-dark/70 via-transparent to-transparent" />

        <span className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-0.5 font-mono text-[10px] text-legnar-gray backdrop-blur-sm">
          {foto.hora_foto.slice(0, 5)}
        </span>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="rounded-full bg-black/50 p-3 backdrop-blur-sm">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-3 py-2.5">
        <span className="font-mono text-xs font-semibold tracking-wider text-legnar-gold">
          {foto.codigo}
        </span>
        <span className="text-[10px] text-legnar-gray">
          {new Date(foto.fecha_foto).toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'short',
          })}
        </span>
      </div>
    </button>
  )
}
