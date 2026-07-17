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
    // Spring Boot elimina de R2 + DB
    const res = await fetch(`${apiUrl}/fotos/${id}`, { method: 'DELETE' })
    if (!res.ok && res.status !== 404) {
      throw new Error(`Error del backend al eliminar: ${res.status}`)
    }
  } else {
    // Fallback: solo elimina de DB (R2 quedará huérfano hasta configurar el backend)
    const { error } = await adminSupabase.from('fotos').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }
}
