'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import type { TrackLocation } from '@/lib/data/lugares'

const SLOT_MINUTES = 20

function formatSlot(slot: string): string {
  const [h, m] = slot.split(':').map(Number)
  const endMin = h * 60 + m + SLOT_MINUTES
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${slot} – ${pad(Math.floor(endMin / 60))}:${pad(endMin % 60)}`
}

interface SearchFiltersProps {
  locations: TrackLocation[]
  slots: string[]
}

export default function SearchFilters({ locations, slots }: SearchFiltersProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const lugar = searchParams.get('lugar') ?? ''
  const fecha = searchParams.get('fecha') ?? ''
  const franja = searchParams.get('franja') ?? ''

  const [codigoInput, setCodigoInput] = useState(searchParams.get('codigo') ?? '')

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [searchParams, router, pathname],
  )

  function setLugar(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set('lugar', value)
    else params.delete('lugar')
    params.delete('franja')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  function setFecha(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set('fecha', value)
    else params.delete('fecha')
    params.delete('franja')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  function handleCodigoSubmit(e: React.FormEvent) {
    e.preventDefault()
    setParam('codigo', codigoInput.trim().toUpperCase())
  }

  function clearFilters() {
    setCodigoInput('')
    router.push(pathname, { scroll: false })
  }

  const hasFilters = lugar || fecha || franja || searchParams.get('codigo')
  const showSlotPicker = !!(lugar && fecha)

  return (
    <div className="sticky top-0 z-20 border-b border-legnar-border bg-legnar-black/90 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:flex-wrap sm:gap-4">

          <div className="flex flex-col gap-1.5 sm:w-48">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-legnar-gray">
              Lugar
            </label>
            <select
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
              className="rounded-lg border border-legnar-border bg-legnar-dark px-3 py-2.5 text-sm text-legnar-white outline-none transition-colors focus:border-legnar-red"
            >
              <option value="">Todos los lugares</option>
              {locations.map((l) => (
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
              onChange={(e) => setFecha(e.target.value)}
              className="rounded-lg border border-legnar-border bg-legnar-dark px-3 py-2.5 text-sm text-legnar-white outline-none transition-colors focus:border-legnar-red [color-scheme:dark]"
            />
          </div>

          {showSlotPicker && (
            <div className="flex flex-col gap-1.5 sm:w-52">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-legnar-gray">
                Franja horaria
              </label>
              {slots.length === 0 ? (
                <p className="py-2.5 text-sm text-legnar-gray/60">Sin fotos en esa fecha</p>
              ) : (
                <select
                  value={franja}
                  onChange={(e) => setParam('franja', e.target.value)}
                  className="rounded-lg border border-legnar-border bg-legnar-dark px-3 py-2.5 text-sm text-legnar-white outline-none transition-colors focus:border-legnar-red"
                >
                  <option value="">Selecciona tu franja</option>
                  {slots.map((slot) => (
                    <option key={slot} value={slot}>
                      {formatSlot(slot)}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <form onSubmit={handleCodigoSubmit} className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
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

          {hasFilters && (
            <button
              onClick={clearFilters}
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
