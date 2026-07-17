import { createSupabaseServerClient } from '@/lib/supabase-server'
import Sidebar from '@/components/admin/Sidebar'

export const metadata = {
  title: 'Admin — Legnar Apex',
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Sin sesión → solo renderiza el children (página de login)
  // El middleware ya maneja el redirect; esto es defensa en profundidad
  if (!user) {
    return (
      <div className="min-h-screen bg-legnar-black">
        {children}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-legnar-black">
      <Sidebar userEmail={user.email ?? ''} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
