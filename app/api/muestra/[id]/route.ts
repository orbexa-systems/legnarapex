import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

const ALLOWED = new Set(['1', '2', '3', '4', '5', '6'])

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  if (!ALLOWED.has(id)) return new NextResponse('Not found', { status: 404 })

  const filePath = path.join(process.cwd(), 'private', 'muestra', `muestra-${id}.jpg`)

  try {
    const file = await readFile(filePath)
    return new NextResponse(file, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': 'inline',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}
