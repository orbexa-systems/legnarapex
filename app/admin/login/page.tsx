'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.')
      setCargando(false)
      return
    }

    router.push('/admin/fotos')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      {/* Fondo con glow sutil */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 50%, #C0392B14 0%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1
            className="text-5xl uppercase tracking-widest text-legnar-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Legnar Apex
          </h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-legnar-gray">
            Panel de administración
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-legnar-border bg-legnar-dark p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-legnar-gray">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@legnarapex.com"
                className="rounded-lg border border-legnar-border bg-legnar-black px-4 py-3 text-sm text-legnar-white placeholder-legnar-gray/40 outline-none transition-colors focus:border-legnar-red"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-legnar-gray">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="rounded-lg border border-legnar-border bg-legnar-black px-4 py-3 text-sm text-legnar-white placeholder-legnar-gray/40 outline-none transition-colors focus:border-legnar-red"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-900/40 bg-red-950/30 px-3 py-2 text-xs text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="mt-1 rounded-full bg-legnar-red py-3 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-legnar-fire disabled:opacity-50"
            >
              {cargando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
