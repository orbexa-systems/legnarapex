'use client'

import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'
import { eliminarFoto, eliminarFotos } from '@/app/admin/fotos/actions'
import type { PhotoWithLocation } from '@/lib/data/fotos'

const PAGE_SIZE = 25

function buildPageWindow(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = [1]
  if (current > 3) pages.push('…')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p)
  if (current < total - 2) pages.push('…')
  pages.push(total)
  return pages
}

function diasRestantes(expiresAt: string) {
  return Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86_400_000)
}

export default function ListaFotos({ fotos }: { fotos: PhotoWithLocation[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const totalPages = Math.ceil(fotos.length / PAGE_SIZE)
  const paginated = fotos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const pageIds = paginated.map((f) => f.id)
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id))

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleSelectPage() {
    setSelected((prev) => {
      const next = new Set(prev)
      if (allPageSelected) {
        pageIds.forEach((id) => next.delete(id))
      } else {
        pageIds.forEach((id) => next.add(id))
      }
      return next
    })
  }

  function clearSelection() {
    setSelected(new Set())
  }

  function handleEliminar(id: string, code: string) {
    if (!confirm(`¿Eliminar la foto ${code}? Esta acción no se puede deshacer.`)) return
    startTransition(async () => {
      await eliminarFoto(id)
      setSelected((prev) => { const next = new Set(prev); next.delete(id); return next })
      router.refresh()
    })
  }

  function handleEliminarSeleccionadas() {
    const count = selected.size
    if (!confirm(`¿Eliminar ${count} foto(s) seleccionada(s)? Esta acción no se puede deshacer.`)) return
    const ids = Array.from(selected)
    startTransition(async () => {
      await eliminarFotos(ids)
      clearSelection()
      router.refresh()
    })
  }

  if (fotos.length === 0) {
    return (
      <div className="rounded-2xl border border-legnar-border bg-legnar-dark p-10 text-center">
        <p className="text-sm text-legnar-gray">No hay fotos subidas todavía.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-legnar-border bg-legnar-dark">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-legnar-border px-6 py-4">
        <h2 className="text-base font-bold uppercase tracking-widest text-legnar-white">
          Fotos activas
          <span className="ml-2 rounded-full bg-legnar-border px-2 py-0.5 text-xs font-normal text-legnar-gray">
            {fotos.length}
          </span>
        </h2>
        {totalPages > 1 && (
          <span className="text-xs text-legnar-gray">
            Página {page} de {totalPages}
          </span>
        )}
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center justify-between border-b border-legnar-border bg-legnar-red/10 px-6 py-3">
          <span className="text-sm font-medium text-legnar-white">
            {selected.size} foto(s) seleccionada(s)
          </span>
          <div className="flex items-center gap-4">
            {!pending && (
              <button
                onClick={clearSelection}
                className="text-xs text-legnar-gray transition-colors hover:text-legnar-white"
              >
                Deseleccionar todo
              </button>
            )}
            <button
              onClick={handleEliminarSeleccionadas}
              disabled={pending}
              className="flex items-center gap-2 rounded-lg bg-legnar-red px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-red-700 disabled:opacity-60"
            >
              {pending ? (
                <>
                  <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Eliminando…
                </>
              ) : (
                'Eliminar seleccionadas'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-legnar-border text-[10px] uppercase tracking-widest text-legnar-gray">
              <th className="px-4 py-3 text-left w-8">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={toggleSelectPage}
                  className="h-4 w-4 cursor-pointer accent-legnar-red"
                  title="Seleccionar página"
                />
              </th>
              <th className="px-4 py-3 text-left">Código</th>
              <th className="px-4 py-3 text-left">Lugar</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Hora</th>
              <th className="px-4 py-3 text-left">Expira</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-legnar-border/50">
            {paginated.map((foto) => {
              const dias = diasRestantes(foto.expires_at)
              const expiraColor =
                dias <= 1 ? 'text-red-400' : dias <= 3 ? 'text-yellow-400' : 'text-legnar-gray'
              const isSelected = selected.has(foto.id)

              return (
                <tr
                  key={foto.id}
                  className={`transition-colors hover:bg-legnar-border/20 ${
                    isSelected ? 'bg-legnar-red/5' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(foto.id)}
                      className="h-4 w-4 cursor-pointer accent-legnar-red"
                    />
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold tracking-wider text-legnar-gold">
                    {foto.code}
                  </td>
                  <td className="px-4 py-3 text-legnar-white">
                    {foto.locations?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-legnar-gray">
                    {new Date(foto.photo_date + 'T00:00:00').toLocaleDateString('es-MX', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 font-mono text-legnar-gray">
                    {foto.photo_time.slice(0, 5)}
                  </td>
                  <td className={`px-4 py-3 font-mono text-xs ${expiraColor}`}>
                    {dias > 0 ? `${dias}d` : 'Expirada'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleEliminar(foto.id, foto.code)}
                      disabled={pending}
                      className="rounded-md px-3 py-1.5 text-xs text-legnar-gray transition-colors hover:bg-red-950/40 hover:text-red-400 disabled:opacity-40"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-legnar-border px-4 py-3 gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold text-legnar-gray transition-colors hover:text-legnar-white disabled:opacity-30"
          >
            ← Anterior
          </button>
          <div className="flex items-center gap-1 overflow-x-auto">
            {buildPageWindow(page, totalPages).map((item, idx) =>
              item === '…' ? (
                <span key={`ellipsis-${idx}`} className="px-1 text-xs text-legnar-gray select-none">…</span>
              ) : (
                <button
                  key={item}
                  onClick={() => setPage(item as number)}
                  className={`h-7 w-7 shrink-0 rounded-md text-xs font-semibold transition-colors ${
                    item === page
                      ? 'bg-legnar-red text-white'
                      : 'text-legnar-gray hover:text-legnar-white'
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold text-legnar-gray transition-colors hover:text-legnar-white disabled:opacity-30"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}
