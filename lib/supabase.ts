import { createClient } from '@supabase/supabase-js'

// Empty fallbacks prevent createClient from throwing at build time without env vars.
// At runtime, requests will fail explicitly if the vars are not configured.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL    ?? 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key',
)
