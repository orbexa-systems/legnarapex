import { supabase } from '@/lib/supabase'

export type Lugar = {
  id: string
  name: string
  active: boolean
  created_at: string
}

export async function getLugares(): Promise<Lugar[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('active', true)
    .order('name')

  if (error) throw error
  return data ?? []
}

export async function getLugarById(id: string): Promise<Lugar | null> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}
