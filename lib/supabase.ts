import { createClient } from '@supabase/supabase-js'

// Fallbacks vacíos evitan que createClient lance en build time sin env vars.
// En runtime, las solicitudes fallarán explícitamente si las vars no están configuradas.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL    ?? 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key',
)
