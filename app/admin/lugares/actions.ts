'use server'

import { adminSupabase } from '@/lib/supabase-admin'
import { createSupabaseServerClient } from '@/lib/supabase-server'

async function requireAuth() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')
  return user
}

export async function toggleLugar(id: string, activo: boolean): Promise<void> {
  await requireAuth()
  const { error } = await adminSupabase.from('lugares').update({ activo }).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function agregarLugar(nombre: string): Promise<void> {
  await requireAuth()
  const { error } = await adminSupabase.from('lugares').insert({ nombre: nombre.trim() })
  if (error) throw new Error(error.message)
}
