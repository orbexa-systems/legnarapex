import Link from 'next/link'

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5625384283'
const WA_URL = `https://wa.me/${WA_NUMBER}`

const REDES = [
  {
    nombre: 'TikTok',
    href: 'https://www.tiktok.com/@legnar_apex',
    icon: <TikTokIcon />,
  },
  {
    nombre: 'Instagram',
    href: 'https://www.instagram.com/legnar_apex',
    icon: <InstagramIcon />,
  },
  {
    nombre: 'Facebook',
    href: 'https://www.facebook.com/LegnarApex',
    icon: <FacebookIcon />,
  },
]

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">

      <div
        aria-hidden
        className="animate-fire-pulse pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 55%, #C0392B22 0%, #E85D0411 40%, transparent 70%)',
        }}
      />

      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #C0392B, #F48C06, transparent)' }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-4xl">
        <span className="animate-fade-up inline-block rounded-full border border-legnar-gold/40 bg-legnar-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-legnar-gold">
          Fotografía de Motociclismo en Pista
        </span>

        <h1
          className="animate-fade-up-d1 text-[clamp(4rem,14vw,10rem)] font-display leading-none tracking-wide uppercase"
          style={{
            fontFamily: 'var(--font-display)',
            background: 'linear-gradient(135deg, #F5F5F5 20%, #F48C06 60%, #C0392B 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Legnar Apex
        </h1>

        <p className="animate-fade-up-d2 max-w-xl text-lg leading-relaxed text-legnar-gray">
          Tus mejores momentos en pista,{' '}
          <span className="text-legnar-white font-semibold">inmortalizados.</span>
        </p>

        <div className="animate-fade-up-d3 flex flex-col sm:flex-row gap-4 pt-2">
          <Link
            href="/galeria"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-legnar-red px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-legnar-fire hover:shadow-[0_0_24px_#E85D0466]"
          >
            Busca tu foto
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-legnar-border bg-legnar-dark/60 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-legnar-white backdrop-blur transition-all duration-300 hover:border-green-500/50 hover:bg-green-500/10 hover:text-green-400"
          >
            <WhatsAppIcon />
            Contactar
          </a>
        </div>

        <div className="animate-fade-up-d3 flex flex-col items-center gap-3 pt-2">
          <p className="text-xs tracking-widest text-legnar-gray/60 uppercase">Síguenos</p>
          <div className="flex items-center gap-3">
            {REDES.map((red) => (
              <a
                key={red.nombre}
                href={red.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={red.nombre}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-legnar-border bg-legnar-dark/60 text-legnar-gray backdrop-blur transition-all duration-300 hover:border-legnar-gold/40 hover:text-legnar-gold"
              >
                <span className="h-4 w-4">{red.icon}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-legnar-gray/40">
        <span className="text-xs tracking-widest uppercase">scroll</span>
        <svg className="h-4 w-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}
