import { getLocations } from '@/lib/data/lugares'
import { getPhotosAdmin } from '@/lib/data/fotos'
import SubidaFotos from '@/components/admin/SubidaFotos'
import ListaFotos from '@/components/admin/ListaFotos'

export const metadata = { title: 'Fotos — Admin Legnar Apex' }

export default async function AdminFotosPage() {
  const [lugares, fotos] = await Promise.all([getLocations(), getPhotosAdmin()])

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-8">
        <h1
          className="text-3xl uppercase tracking-wide text-legnar-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Gestión de fotos
        </h1>
        <p className="mt-1 text-sm text-legnar-gray">
          Sube las fotos del día y administra el catálogo activo.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <SubidaFotos lugares={lugares} />
        <ListaFotos fotos={fotos} />
      </div>
    </div>
  )
}
