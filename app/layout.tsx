import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Bebas_Neue } from 'next/font/google'
import './globals.css'
import { version } from '../package.json'

const geist = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
})

const bebasNeue = Bebas_Neue({
  variable: '--font-display',
  subsets: ['latin'],
  weight: '400',
})

export const metadata: Metadata = {
  title: 'Legnar Apex — Fotografía de Motociclismo',
  description:
    'Tus mejores momentos en pista, inmortalizados. Busca tu foto por lugar, fecha o código.',
  openGraph: {
    title: 'Legnar Apex',
    description: 'Fotografía de motociclismo en pista. Busca tu foto.',
    siteName: 'Legnar Apex',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${geist.variable} ${bebasNeue.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-legnar-black text-legnar-white antialiased">
        {children}
        <footer className="mt-auto border-t border-legnar-border py-3 text-center">
          <span className="text-[11px] text-legnar-gray">
            © {new Date().getFullYear()} Legnar Apex · Todos los derechos reservados · v{version}
          </span>
        </footer>
      </body>
    </html>
  )
}
