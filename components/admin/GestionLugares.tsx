'use client'

import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'
import { toggleLugar, agregarLugar } from '@/app/admin/lugares/actions'
import type { TrackLocation } from '@/lib/data/lugares'

interface GestionLugaresProps {
  lugares: TrackLocation[]
}

export default function GestionLugares({ lugares }: GestionLugaresProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [agregando, setAgregando] = useState(false)

  function handleToggle(id: string, activoActual: boolean) {
    startTransition(async () => {
      await toggleLugar(id, !activoActual)
      router.refresh()
    })
  }

  function handleAgregar(e: React.FormEvent) {
    e.preventDefault()
    if (!nuevoNombre.trim()) return
    startTransition(async () => {
      await agregarLugar(nuevoNombre)
      setNuevoNombre('')
      setAgregando(false)
      router.refresh()
    })
  }

  return (
    <div className="rounded-2xl border border-legnar-border bg-legnar-dark">
      <div className="flex items-center justify-between border-b border-legnar-border px-6 py-4">
        <h2 className="text-base font-bold uppercase tracking-widest text-legnar-white">
          Lugares de operación
        </h2>
        <button
          onClick={() => setAgregando((v) => !v)}
          className="rounded-full border border-legnar-border px-4 py-1.5 text-xs font-semibold text-legnar-gray transition-colors hover:border-legnar-white hover:text-legnar-white"
        >
          {agregando ? 'Cancelar' : '+ Agregar'}
        </button>
      </div>

      {agregando && (
        <form onSubmit={handleAgregar} className="flex gap-3 border-b border-legnar-border px-6 py-4">
          <input
            type="text"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            placeholder="Nombre del lugar"
            autoFocus
            required
            className="flex-1 rounded-lg border border-legnar-border bg-legnar-black px-3 py-2 text-sm text-legnar-white placeholder-legnar-gray/40 outline-none focus:border-legnar-red"
          />
          <button
            type="submit"
            disabled={pending || !nuevoNombre.trim()}
            className="rounded-full bg-legnar-red px-5 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-legnar-fire disabled:opacity-40"
          >
            Guardar
          </button>
        </form>
      )}

      <ul className="divide-y divide-legnar-border/50">
        {lugares.length === 0 && (
          <li className="px-6 py-8 text-center text-sm text-legnar-gray">
            No hay lugares configurados.
          </li>
        )}
        {lugares.map((lugar) => (
          <li key={lugar.id} className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-semibold text-legnar-white">{lugar.name}</p>
              <p className="text-xs text-legnar-gray">
                {lugar.active ? 'Visible en galería' : 'Oculto en galería'}
              </p>
            </div>

            <button
              onClick={() => handleToggle(lugar.id, lugar.active)}
              disabled={pending}
              className={`relative h-6 w-11 rounded-full transition-colors disabled:opacity-40 ${
                lugar.active ? 'bg-legnar-red' : 'bg-legnar-border'
              }`}
              aria-label={lugar.active ? 'Desactivar' : 'Activar'}
            >
              <span
                className={`absolute top-[2px] h-5 w-5 rounded-full bg-white shadow transition-all duration-200 ${
                  lugar.active ? 'left-[22px]' : 'left-[2px]'
                }`}
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
