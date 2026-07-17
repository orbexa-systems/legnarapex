import { supabase } from '@/lib/supabase'

export type Lugar = {
  id: string
  nombre: string
  activo: boolean
  created_at: string
}

export async function getLugares(): Promise<Lugar[]> {
  const { data, error } = await supabase
    .from('lugares')
    .select('*')
    .eq('activo', true)
    .order('nombre')

  if (error) throw error
  return data ?? []
}

export async function getLugarById(id: string): Promise<Lugar | null> {
  const { data, error } = await supabase
    .from('lugares')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}
