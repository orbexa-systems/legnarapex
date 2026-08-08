import { supabase } from '@/lib/supabase'
import { adminSupabase } from '@/lib/supabase-admin'

export type Foto = {
  id: string
  code: string
  location_id: string
  photo_date: string
  photo_time: string
  photo_url: string
  uploaded_at: string
  expires_at: string
}

export type FotoConLugar = Foto & {
  locations: { name: string } | null
}

export type FotosByCriteriaParams = {
  location_id?: string
  date?: string
  code?: string
}

export async function getFotosByCriteria(params: FotosByCriteriaParams): Promise<Foto[]> {
  let query = supabase
    .from('photos')
    .select('*')
    .gt('expires_at', new Date().toISOString())
    .order('photo_time', { ascending: false })

  if (params.location_id) query = query.eq('location_id', params.location_id)
  if (params.date)        query = query.eq('photo_date', params.date)
  if (params.code)        query = query.ilike('code', `%${params.code}%`)

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getFotosByCodigo(code: string): Promise<Foto[]> {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .ilike('code', `%${code}%`)
    .gt('expires_at', new Date().toISOString())

  if (error) throw error
  return data ?? []
}

// Uses adminSupabase to bypass RLS and return all photos including expired ones
export async function getFotosAdmin(): Promise<FotoConLugar[]> {
  const { data, error } = await adminSupabase
    .from('photos')
    .select('*, locations(name)')
    .order('uploaded_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as FotoConLugar[]
}

export async function deleteFoto(id: string): Promise<void> {
  const { error } = await supabase.from('photos').delete().eq('id', id)
  if (error) throw error
}
