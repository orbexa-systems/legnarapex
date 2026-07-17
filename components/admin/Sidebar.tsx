'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

const NAV = [
  {
    href: '/admin/fotos',
    label: 'Fotos',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    href: '/admin/lugares',
    label: 'Lugares',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

interface SidebarProps {
  userEmail: string
}

export default function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  async function cerrarSesion() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-legnar-border bg-legnar-dark">
      {/* Marca */}
      <div className="border-b border-legnar-border px-5 py-5">
        <Link href="/" className="block">
          <p
            className="text-xl uppercase tracking-widest text-legnar-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Legnar Apex
          </p>
          <p className="text-[10px] uppercase tracking-widest text-legnar-gray">Admin</p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-3 py-4">
        {NAV.map((item) => {
          const activo = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activo
                  ? 'bg-legnar-red/15 text-legnar-white'
                  : 'text-legnar-gray hover:bg-legnar-border/50 hover:text-legnar-white'
              }`}
            >
              <span className={activo ? 'text-legnar-red' : ''}>{item.icon}</span>
              {item.label}
              {activo && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-legnar-red" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Usuario + logout */}
      <div className="mt-auto border-t border-legnar-border px-4 py-4">
        <p className="mb-3 truncate text-xs text-legnar-gray" title={userEmail}>
          {userEmail}
        </p>
        <button
          onClick={cerrarSesion}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-legnar-gray transition-colors hover:bg-legnar-border/50 hover:text-legnar-white"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
