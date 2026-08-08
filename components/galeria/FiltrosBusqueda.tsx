'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import type { Lugar } from '@/lib/data/lugares'

export default function FiltrosBusqueda({ lugares }: { lugares: Lugar[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const lugar = searchParams.get('lugar') ?? ''
  const fecha = searchParams.get('fecha') ?? ''

  // Estado local para código — solo navega al enviar el formulario
  const [codigoInput, setCodigoInput] = useState(searchParams.get('codigo') ?? '')

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

  function handleCodigoSubmit(e: React.FormEvent) {
    e.preventDefault()
    setParam('codigo', codigoInput.trim().toUpperCase())
  }

  function limpiarFiltros() {
    setCodigoInput('')
    router.push(pathname, { scroll: false })
  }

  const hayFiltros = lugar || fecha || searchParams.get('codigo')

  return (
    <div className="sticky top-0 z-20 border-b border-legnar-border bg-legnar-black/90 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">

          {/* Lugar */}
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
                  {l.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
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

          {/* Código */}
          <form onSubmit={handleCodigoSubmit} className="flex flex-col gap-1.5 flex-1">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-legnar-gray">
              Código de foto
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ej: 2V0A9780"
                value={codigoInput}
                onChange={(e) => setCodigoInput(e.target.value.toUpperCase())}
                className="flex-1 rounded-lg border border-legnar-border bg-legnar-dark px-3 py-2.5 font-mono text-sm text-legnar-white placeholder-legnar-gray/50 outline-none transition-colors focus:border-legnar-red"
              />
              <button
                type="submit"
                className="rounded-lg bg-legnar-red px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-legnar-fire"
              >
                Buscar
              </button>
            </div>
          </form>

          {/* Limpiar filtros */}
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
