const PASOS = [
  {
    numero: '01',
    emoji: '📸',
    titulo: 'Recibe tu tarjeta en pista',
    descripcion:
      'Al terminar tu sesión, el fotógrafo te entrega una tarjeta con acceso al sitio y el link directo a tus fotos.',
  },
  {
    numero: '02',
    emoji: '🔍',
    titulo: 'Busca tu foto',
    descripcion:
      'Filtra por lugar, fecha y hora, o ingresa directamente tu código. Visualiza las fotos con marca de agua.',
  },
  {
    numero: '03',
    emoji: '📲',
    titulo: 'Contáctanos por WhatsApp',
    descripcion:
      'Manda el código de tu foto. Nosotros la editamos del RAW original y te la enviamos lista en minutos.',
  },
]

export default function ComoFunciona() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-legnar-gold">
            Proceso
          </span>
          <h2
            className="text-[clamp(2.5rem,6vw,4.5rem)] uppercase leading-none tracking-wide"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Cómo funciona
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {PASOS.map((paso) => (
            <div
              key={paso.numero}
              className="group relative flex flex-col gap-5 rounded-2xl border border-legnar-border bg-legnar-dark p-8 transition-all duration-300 hover:border-legnar-red/40 hover:shadow-[0_0_32px_#C0392B18]"
            >
              <span
                className="absolute right-6 top-4 text-6xl font-bold leading-none text-legnar-border select-none transition-colors duration-300 group-hover:text-legnar-red/20"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {paso.numero}
              </span>

              <span className="text-4xl">{paso.emoji}</span>

              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-legnar-white">{paso.titulo}</h3>
                <p className="text-sm leading-relaxed text-legnar-gray">{paso.descripcion}</p>
              </div>

              <div className="absolute bottom-0 left-8 right-8 h-px scale-x-0 bg-gradient-to-r from-legnar-red to-legnar-fire transition-transform duration-300 group-hover:scale-x-100 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
