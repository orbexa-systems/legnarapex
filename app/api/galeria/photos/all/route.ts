import { type NextRequest, NextResponse } from 'next/server'
import { getAllPhotos, type PhotosByCriteriaParams } from '@/lib/data/fotos'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const params: PhotosByCriteriaParams = {
    location_id: searchParams.get('location_id') ?? undefined,
    date:        searchParams.get('date') ?? undefined,
    code:        searchParams.get('code') ?? undefined,
    time_slot:   searchParams.get('time_slot') ?? undefined,
  }

  try {
    const photos = await getAllPhotos(params)
    return NextResponse.json({ photos })
  } catch {
    return NextResponse.json({ error: 'Error loading photos' }, { status: 500 })
  }
}
