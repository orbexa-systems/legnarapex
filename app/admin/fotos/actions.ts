'use server'

import { adminSupabase } from '@/lib/supabase-admin'
import { createSupabaseServerClient } from '@/lib/supabase-server'

async function requireAuth() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')
  return user
}

export async function eliminarFoto(id: string): Promise<void> {
  await requireAuth()

  const apiUrl = process.env.API_URL

  if (apiUrl) {
    // Spring Boot deletes from both R2 and DB
    const res = await fetch(`${apiUrl}/fotos/${id}`, { method: 'DELETE' })
    if (!res.ok && res.status !== 404) {
      throw new Error(`Error del backend al eliminar: ${res.status}`)
    }
  } else {
    // Fallback: deletes from DB only — R2 object will be orphaned until backend is configured
    const { error } = await adminSupabase.from('photos').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }
}

export async function eliminarFotos(ids: string[]): Promise<void> {
  await requireAuth()
  await Promise.all(ids.map((id) => eliminarFoto(id)))
}
