import { createClient } from '@supabase/supabase-js'

// Service role client — bypasses RLS. Server-side only.
// Empty fallbacks prevent build-time errors; requests fail explicitly at runtime if vars are missing.
export const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL    ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY   ?? 'placeholder-service-role',
  { auth: { autoRefreshToken: false, persistSession: false } },
)
