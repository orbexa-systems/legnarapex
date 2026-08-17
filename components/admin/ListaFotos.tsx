'use client'

import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'
import { eliminarFoto } from '@/app/admin/fotos/actions'
import type { PhotoWithLocation } from '@/lib/data/fotos'

const PAGE_SIZE = 25

function diasRestantes(expiresAt: string) {
  return Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86_400_000)
}

export default function ListaFotos({ fotos }: { fotos: PhotoWithLocation[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(fotos.length / PAGE_SIZE)
  const paginated = fotos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleEliminar(id: string, code: string) {
    if (!confirm(`¿Eliminar la foto ${code}? Esta acción no se puede deshacer.`)) return
    startTransition(async () => {
      await eliminarFoto(id)
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

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-legnar-border text-[10px] uppercase tracking-widest text-legnar-gray">
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

              return (
                <tr key={foto.id} className="transition-colors hover:bg-legnar-border/20">
                  <td className="px-4 py-3 font-mono font-semibold tracking-wider text-legnar-gold">
                    {foto.code}
                  </td>
                  <td className="px-4 py-3 text-legnar-white">
                    {foto.locations?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-legnar-gray">
                    {new Date(foto.photo_date).toLocaleDateString('es-MX', {
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-legnar-border px-6 py-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-md px-4 py-1.5 text-xs font-semibold text-legnar-gray transition-colors hover:text-legnar-white disabled:opacity-30"
          >
            ← Anterior
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-7 w-7 rounded-md text-xs font-semibold transition-colors ${
                  p === page
                    ? 'bg-legnar-red text-white'
                    : 'text-legnar-gray hover:text-legnar-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-md px-4 py-1.5 text-xs font-semibold text-legnar-gray transition-colors hover:text-legnar-white disabled:opacity-30"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}
