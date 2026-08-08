import { supabase } from '@/lib/supabase'
import { adminSupabase } from '@/lib/supabase-admin'

export type Foto = {
  id: string
  codigo: string
  lugar_id: string
  fecha_foto: string
  hora_foto: string
  url_foto: string
  fecha_subida: string
  expira_en: string
}

export type FotoConLugar = Foto & {
  lugares: { nombre: string } | null
}

export type FotosByCriteriaParams = {
  lugar_id?: string
  fecha?: string
  codigo?: string
}

export async function getFotosByCriteria(params: FotosByCriteriaParams): Promise<Foto[]> {
  let query = supabase
    .from('fotos')
    .select('*')
    .gt('expira_en', new Date().toISOString())
    .order('hora_foto', { ascending: false })

  if (params.lugar_id) query = query.eq('lugar_id', params.lugar_id)
  if (params.fecha)    query = query.eq('fecha_foto', params.fecha)
  if (params.codigo)   query = query.ilike('codigo', `%${params.codigo}%`)

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getFotosByCodigo(codigo: string): Promise<Foto[]> {
  const { data, error } = await supabase
    .from('fotos')
    .select('*')
    .ilike('codigo', `%${codigo}%`)
    .gt('expira_en', new Date().toISOString())

  if (error) throw error
  return data ?? []
}

// Usa adminSupabase para ver TODAS las fotos incluyendo expiradas
export async function getFotosAdmin(): Promise<FotoConLugar[]> {
  const { data, error } = await adminSupabase
    .from('fotos')
    .select('*, lugares(nombre)')
    .order('fecha_subida', { ascending: false })

  if (error) throw error
  return (data ?? []) as FotoConLugar[]
}

export async function deleteFoto(id: string): Promise<void> {
  const { error } = await supabase.from('fotos').delete().eq('id', id)
  if (error) throw error
}
