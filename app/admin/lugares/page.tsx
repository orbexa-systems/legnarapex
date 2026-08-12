import { adminSupabase } from '@/lib/supabase-admin'
import GestionLugares from '@/components/admin/GestionLugares'
import type { TrackLocation } from '@/lib/data/lugares'

export const metadata = { title: 'Lugares — Admin Legnar Apex' }

async function getAllLocations(): Promise<TrackLocation[]> {
  const { data, error } = await adminSupabase
    .from('locations')
    .select('*')
    .order('name')
  if (error) throw error
  return data ?? []
}

export default async function AdminLugaresPage() {
  const lugares = await getAllLocations()

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-8">
        <h1
          className="text-3xl uppercase tracking-wide text-legnar-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Lugares
        </h1>
        <p className="mt-1 text-sm text-legnar-gray">
          Administra los lugares de operación. Los lugares inactivos no aparecen en los filtros de la galería.
        </p>
      </div>

      <GestionLugares lugares={lugares} />
    </div>
  )
}
