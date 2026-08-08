import Link from 'next/link'

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5625384283'
const WA_URL = `https://wa.me/${WA_NUMBER}`

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

        <p className="animate-fade-up-d3 text-xs tracking-widest text-legnar-gray/60 uppercase pt-2">
          Pregunta por tu foto
        </p>
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
