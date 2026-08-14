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

  const buffer = await r2Response.arrayBuffer()
  const contentType = r2Response.headers.get('Content-Type') ?? 'image/jpeg'

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': 'inline',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store',
    },
  })
}
