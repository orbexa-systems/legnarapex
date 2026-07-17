import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

// Proxy server-side que oculta la URL interna del backend al navegador.
// Verifica sesión Supabase antes de reenviar a Spring Boot.
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const apiUrl = process.env.API_URL
  if (!apiUrl) {
    return NextResponse.json(
      { error: 'Backend no configurado. Define la variable de entorno API_URL.' },
      { status: 503 },
    )
  }

  try {
    const formData = await request.formData()
    const response = await fetch(`${apiUrl}/fotos/upload`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[upload proxy] Error:', error)
    return NextResponse.json({ error: 'Error conectando con el backend' }, { status: 502 })
  }
}
