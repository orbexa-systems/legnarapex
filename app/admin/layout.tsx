import { createSupabaseServerClient } from '@/lib/supabase-server'
import Sidebar from '@/components/admin/Sidebar'
import { version } from '../../package.json'

export const metadata = {
  title: 'Admin — Legnar Apex',
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // No session → render children only (login page)
  // Middleware already handles the redirect; this is defense in depth
  if (!user) {
    return (
      <div className="min-h-screen bg-legnar-black">
        {children}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-legnar-black">
      <Sidebar userEmail={user.email ?? ''} version={version} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
