import { supabase } from '@/lib/supabase'
import { adminSupabase } from '@/lib/supabase-admin'

export type Photo = {
  id: string
  code: string
  location_id: string
  photo_date: string
  photo_time: string
  photo_url: string
  uploaded_at: string
  expires_at: string
}

export type PhotoWithLocation = Photo & {
  locations: { name: string } | null
}

export type PhotosByCriteriaParams = {
  location_id?: string
  date?: string
  code?: string
  time_slot?: string // "HH:MM" — start of the 20-minute slot
}

const SLOT_MINUTES = 20

export async function getPhotosByCriteria(params: PhotosByCriteriaParams): Promise<Photo[]> {
  let query = supabase
    .from('photos')
    .select('*')
    .gt('expires_at', new Date().toISOString())
    .order('photo_time', { ascending: false })
    .limit(100)

  if (params.location_id) query = query.eq('location_id', params.location_id)
  if (params.date)        query = query.eq('photo_date', params.date)
  if (params.code)        query = query.ilike('code', `%${params.code}%`)

  if (params.time_slot) {
    const [h, m] = params.time_slot.split(':').map(Number)
    const startMin = h * 60 + m
    const endMin = startMin + SLOT_MINUTES
    const pad = (n: number) => n.toString().padStart(2, '0')
    const slotStart = `${pad(Math.floor(startMin / 60))}:${pad(startMin % 60)}:00`
    const slotEnd   = `${pad(Math.floor(endMin / 60))}:${pad(endMin % 60)}:00`
    query = query.gte('photo_time', slotStart).lt('photo_time', slotEnd)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getAvailableTimeSlots(location_id: string, date: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('photos')
    .select('photo_time')
    .eq('location_id', location_id)
    .eq('photo_date', date)
    .gt('expires_at', new Date().toISOString())

  if (error) throw error
  if (!data?.length) return []

  const pad = (n: number) => n.toString().padStart(2, '0')
  const slotSet = new Set<string>()

  for (const { photo_time } of data) {
    const [h, m] = photo_time.split(':').map(Number)
    const slotStart = Math.floor((h * 60 + m) / SLOT_MINUTES) * SLOT_MINUTES
    slotSet.add(`${pad(Math.floor(slotStart / 60))}:${pad(slotStart % 60)}`)
  }

  return Array.from(slotSet).sort()
}

export async function getPhotosByCode(code: string): Promise<Photo[]> {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .ilike('code', `%${code}%`)
    .gt('expires_at', new Date().toISOString())

  if (error) throw error
  return data ?? []
}

export async function getPhotosAdmin(): Promise<PhotoWithLocation[]> {
  const { data, error } = await adminSupabase
    .from('photos')
    .select('*, locations(name)')
    .order('uploaded_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as PhotoWithLocation[]
}

export async function deletePhoto(id: string): Promise<void> {
  const { error } = await supabase.from('photos').delete().eq('id', id)
  if (error) throw error
}
