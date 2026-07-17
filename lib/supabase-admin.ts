import { createClient } from '@supabase/supabase-js'

// Usa service_role — bypasea RLS. Solo usar server-side.
export const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
)
