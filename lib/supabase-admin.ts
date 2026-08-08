import { createClient } from '@supabase/supabase-js'

// Service role — bypasea RLS. Solo usar server-side.
// Fallback vacío evita error en build time; falla explícitamente en runtime si falta.
export const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL    ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY   ?? 'placeholder-service-role',
  { auth: { autoRefreshToken: false, persistSession: false } },
)
