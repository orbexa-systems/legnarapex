'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import type { TrackLocation } from '@/lib/data/lugares'

/** @deprecated Use SearchFilters instead */
export default function FiltrosBusqueda({ lugares }: { lugares: TrackLocation[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const lugar = searchParams.get('lugar') ?? ''
  const fecha = searchParams.get('fecha') ?? ''

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [searchParams, router, pathname],
  )

  function limpiarFiltros() {
    router.push(pathname, { scroll: false })
  }

  const hayFiltros = lugar || fecha

  return (
    <div className="sticky top-0 z-20 border-b border-legnar-border bg-legnar-black/90 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">

          <div className="flex flex-col gap-1.5 sm:w-48">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-legnar-gray">
              Lugar
            </label>
            <select
              value={lugar}
              onChange={(e) => setParam('lugar', e.target.value)}
              className="rounded-lg border border-legnar-border bg-legnar-dark px-3 py-2.5 text-sm text-legnar-white outline-none transition-colors focus:border-legnar-red"
            >
              <option value="">Todos los lugares</option>
              {lugares.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 sm:w-44">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-legnar-gray">
              Fecha
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setParam('fecha', e.target.value)}
              className="rounded-lg border border-legnar-border bg-legnar-dark px-3 py-2.5 text-sm text-legnar-white outline-none transition-colors focus:border-legnar-red [color-scheme:dark]"
            />
          </div>

          {hayFiltros && (
            <button
              onClick={limpiarFiltros}
              className="self-end rounded-lg border border-legnar-border px-4 py-2.5 text-sm text-legnar-gray transition-colors hover:border-legnar-gray hover:text-legnar-white"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
