'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { eliminarFoto } from '@/app/admin/fotos/actions'
import type { FotoConLugar } from '@/lib/data/fotos'

function diasRestantes(expiraEn: string) {
  return Math.ceil((new Date(expiraEn).getTime() - Date.now()) / 86_400_000)
}

export default function ListaFotos({ fotos }: { fotos: FotoConLugar[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleEliminar(id: string, codigo: string) {
    if (!confirm(`¿Eliminar la foto ${codigo}? Esta acción no se puede deshacer.`)) return
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
      <div className="border-b border-legnar-border px-6 py-4">
        <h2 className="text-base font-bold uppercase tracking-widest text-legnar-white">
          Fotos activas
          <span className="ml-2 rounded-full bg-legnar-border px-2 py-0.5 text-xs font-normal text-legnar-gray">
            {fotos.length}
          </span>
        </h2>
      </div>

      {/* Tabla */}
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
            {fotos.map((foto) => {
              const dias = diasRestantes(foto.expira_en)
              const expiraColor =
                dias <= 1 ? 'text-red-400' : dias <= 3 ? 'text-yellow-400' : 'text-legnar-gray'

              return (
                <tr key={foto.id} className="transition-colors hover:bg-legnar-border/20">
                  <td className="px-4 py-3 font-mono font-semibold tracking-wider text-legnar-gold">
                    {foto.codigo}
                  </td>
                  <td className="px-4 py-3 text-legnar-white">
                    {foto.lugares?.nombre ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-legnar-gray">
                    {new Date(foto.fecha_foto).toLocaleDateString('es-MX', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 font-mono text-legnar-gray">
                    {foto.hora_foto.slice(0, 5)}
                  </td>
                  <td className={`px-4 py-3 font-mono text-xs ${expiraColor}`}>
                    {dias > 0 ? `${dias}d` : 'Expirada'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleEliminar(foto.id, foto.codigo)}
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
    </div>
  )
}
