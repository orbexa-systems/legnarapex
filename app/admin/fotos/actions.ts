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
  const { error } = await adminSupabase.from('fotos').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
