import { Suspense } from 'react'
import Link from 'next/link'
import { getLocations } from '@/lib/data/lugares'
import { getPhotosByCriteria, getAvailableTimeSlots } from '@/lib/data/fotos'
import SearchFilters from '@/components/galeria/SearchFilters'
import PhotoGrid from '@/components/galeria/PhotoGrid'

type SearchParams = {
  lugar?: string
  fecha?: string
  codigo?: string
  franja?: string
}

export const metadata = {
  title: 'Galería — Legnar Apex',
  description: 'Busca tu foto por lugar, fecha o código.',
}

export default async function GaleriaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  const hasLocationAndDate = !!(params.lugar && params.fecha)
  const shouldFetchPhotos = (hasLocationAndDate && !!params.franja) || !!params.codigo

  const [locations, photos, slots] = await Promise.all([
    getLocations(),
    shouldFetchPhotos
      ? getPhotosByCriteria({
          location_id: params.lugar,
          date: params.fecha,
          code: params.codigo,
          time_slot: params.franja,
        })
      : Promise.resolve([]),
    hasLocationAndDate
      ? getAvailableTimeSlots(params.lugar!, params.fecha!)
      : Promise.resolve([]),
  ])

  const hasFilters = shouldFetchPhotos

  return (
    <div className="min-h-screen">
      <nav className="border-b border-legnar-border bg-legnar-black px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-legnar-gray transition-colors hover:text-legnar-white"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Inicio</span>
          </Link>

          <span
            className="text-xl uppercase tracking-widest text-legnar-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Legnar Apex
          </span>

          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5625384283'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-green-600/40 bg-green-600/10 px-3 py-1.5 text-xs font-semibold text-green-400 transition-all hover:bg-green-600/20"
          >
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </nav>

      <div className="border-b border-legnar-border/50 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <h1
            className="text-[clamp(2rem,5vw,3.5rem)] uppercase leading-none tracking-wide text-legnar-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Tus fotos
          </h1>
          <p className="mt-1 text-sm text-legnar-gray">
            Filtra por lugar, fecha y franja horaria, o ingresa el código de tu tarjeta
          </p>
        </div>
      </div>

      <Suspense fallback={<FiltersSkeleton />}>
        <SearchFilters locations={locations} slots={slots} />
      </Suspense>

      <PhotoGrid photos={photos} hasFilters={hasFilters} />
    </div>
  )
}

function FiltersSkeleton() {
  return (
    <div className="border-b border-legnar-border bg-legnar-black/90 px-6 py-4">
      <div className="mx-auto flex max-w-6xl gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-40 animate-pulse rounded-lg bg-legnar-dark" />
        ))}
      </div>
    </div>
  )
}
