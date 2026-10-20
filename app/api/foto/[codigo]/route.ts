import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ codigo: string }> },
) {
  const { codigo } = await params

  const { data: photo } = await supabase
    .from('photos')
    .select('photo_url')
    .eq('code', codigo)
    .single()

  if (!photo) {
    return new NextResponse(null, { status: 404 })
  }

  let r2Response: Response
  try {
    r2Response = await fetch(photo.photo_url)
  } catch {
    return new NextResponse(null, { status: 502 })
  }

  if (!r2Response.ok) {
    return new NextResponse(null, { status: r2Response.status })
  }

  const contentType = r2Response.headers.get('Content-Type') ?? 'image/jpeg'

  return new NextResponse(r2Response.body, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': 'inline',
      'X-Content-Type-Options': 'nosniff',
      // s-maxage tells Vercel's CDN to cache at edge; stale-while-revalidate serves cached bytes while refreshing
      'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=86400',
    },
  })
}
