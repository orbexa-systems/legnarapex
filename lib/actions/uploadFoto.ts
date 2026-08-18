'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function uploadFoto(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { ok: false, error: 'No autorizado' }

  const apiUrl = process.env.API_URL
  if (!apiUrl) return { ok: false, error: 'Backend no configurado' }

  try {
    const response = await fetch(`${apiUrl}/fotos/admin/upload`, {
      method: 'POST',
      body: formData,
    })
    if (!response.ok) return { ok: false, error: `Error ${response.status}` }
    return { ok: true }
  } catch {
    return { ok: false, error: 'Error conectando con el backend' }
  }
}
