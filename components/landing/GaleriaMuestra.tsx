import Link from 'next/link'

/* Placeholder cards shown until real photos are available.
   They mimic the look of a watermarked photo. */
const PLACEHOLDERS = [
  { id: 1, gradient: 'from-slate-900 via-slate-800 to-legnar-red/20',  codigo: '2V0A1234' },
  { id: 2, gradient: 'from-slate-900 via-legnar-dark to-legnar-fire/20', codigo: '2V0A5678' },
  { id: 3, gradient: 'from-legnar-dark via-slate-900 to-legnar-gold/20', codigo: '2V0A9012' },
  { id: 4, gradient: 'from-slate-900 via-slate-800 to-legnar-red/30',  codigo: '2V0A3456' },
  { id: 5, gradient: 'from-slate-900 via-legnar-dark to-legnar-fire/30', codigo: '2V0A7890' },
  { id: 6, gradient: 'from-legnar-dark via-slate-800 to-legnar-red/20', codigo: '2V0A2468' },
]

export default function GaleriaMuestra() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-legnar-gold">
              Vista previa
            </span>
            <h2
              className="text-[clamp(2.5rem,6vw,4.5rem)] uppercase leading-none tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Galería de muestra
            </h2>
          </div>
          <Link
            href="/galeria"
            className="shrink-0 rounded-full border border-legnar-red bg-legnar-red/10 px-6 py-2.5 text-sm font-semibold uppercase tracking-widest text-legnar-white transition-all hover:bg-legnar-red hover:shadow-[0_0_20px_#C0392B66]"
          >
            Ver todas las fotos
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
          {PLACEHOLDERS.map((p) => (
            <div
              key={p.id}
              className="group relative aspect-[3/2] overflow-hidden rounded-xl border border-legnar-border"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient}`} />

              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="select-none text-[clamp(1.2rem,3vw,2rem)] font-bold uppercase tracking-widest text-white/10"
                  style={{ fontFamily: 'var(--font-display)', transform: 'rotate(-25deg)' }}
                >
                  LEGNAR APEX
                </span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-5">
                <MotoIcon />
              </div>

              <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/90 to-transparent p-3 transition-transform duration-300 group-hover:translate-y-0">
                <p className="text-xs font-mono text-legnar-gold tracking-widest">{p.codigo}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-legnar-gray/50">
          Imágenes de muestra — las fotos reales se muestran con marca de agua
        </p>

        <div className="mt-16 border-t border-legnar-border pt-8 text-center">
          <p className="text-xs text-legnar-gray/40">
            © {new Date().getFullYear()} Legnar Apex · Fotografía de motociclismo
          </p>
        </div>
      </div>
    </section>
  )
}

function MotoIcon() {
  return (
    <svg viewBox="0 0 200 100" fill="white" className="w-48 opacity-80">
      <ellipse cx="40" cy="72" rx="22" ry="22" fill="none" stroke="white" strokeWidth="6" />
      <ellipse cx="160" cy="72" rx="22" ry="22" fill="none" stroke="white" strokeWidth="6" />
      <path d="M62 72 L80 40 L120 40 L138 72" stroke="white" strokeWidth="6" fill="none" strokeLinejoin="round" />
      <path d="M80 40 L90 20 L130 20 L145 40" stroke="white" strokeWidth="4" fill="none" strokeLinejoin="round" />
      <circle cx="95" cy="35" r="4" fill="white" />
      <path d="M62 72 L100 72 L115 55 L138 60" stroke="white" strokeWidth="4" fill="none" />
    </svg>
  )
}
