import { supabase } from '@/lib/supabase'

// Named TrackLocation to avoid collision with the DOM built-in Location interface
export type TrackLocation = {
  id: string
  name: string
  active: boolean
  created_at: string
}

export async function getLocations(): Promise<TrackLocation[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('active', true)
    .order('name')

  if (error) throw error
  return data ?? []
}

export async function getLocationById(id: string): Promise<TrackLocation | null> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}
