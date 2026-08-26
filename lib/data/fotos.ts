import { supabase } from '@/lib/supabase'
import { adminSupabase } from '@/lib/supabase-admin'

export type Photo = {
  id: string
  code: string
  location_id: string
  photo_date: string
  photo_time: string
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
export const PAGE_SIZE = 20

const PUBLIC_FIELDS = 'id, code, location_id, photo_date, photo_time, uploaded_at, expires_at'

function buildPhotosQuery(params: PhotosByCriteriaParams) {
  let query = supabase
    .from('photos')
    .select(PUBLIC_FIELDS, { count: 'exact' })
    .gt('expires_at', new Date().toISOString())
    .order('photo_time', { ascending: true })

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

  return query
}

export async function getPhotosPaginated(
  params: PhotosByCriteriaParams,
  page: number,
): Promise<{ photos: Photo[]; total: number; hasMore: boolean }> {
  const offset = (page - 1) * PAGE_SIZE
  const { data, error, count } = await buildPhotosQuery(params).range(offset, offset + PAGE_SIZE - 1)
  if (error) throw error
  const total = count ?? 0
  return { photos: data ?? [], total, hasMore: offset + PAGE_SIZE < total }
}

export async function getAvailableTimeSlots(location_id: string, date: string): Promise<string[]> {
  const { data, error } = await supabase.rpc('get_available_slots', {
    p_location_id: location_id,
    p_date: date,
  })

  if (error) throw error
  if (!data?.length) return []

  return (data as { slot: string }[]).map((r) => r.slot.slice(0, 5))
}

export async function getPhotosByCode(code: string): Promise<Photo[]> {
  const { data, error } = await supabase
    .from('photos')
    .select(PUBLIC_FIELDS)
    .ilike('code', `%${code}%`)
    .gt('expires_at', new Date().toISOString())

  if (error) throw error
  return data ?? []
}

export async function getPhotosAdmin(): Promise<PhotoWithLocation[]> {
  const { data, error } = await adminSupabase
    .from('photos')
    .select(`${PUBLIC_FIELDS}, locations(name)`)
    .order('photo_date', { ascending: true })
    .order('photo_time', { ascending: true })

  if (error) throw error
  return (data ?? []) as unknown as PhotoWithLocation[]
}

export async function deletePhoto(id: string): Promise<void> {
  const { error } = await supabase.from('photos').delete().eq('id', id)
  if (error) throw error
}
