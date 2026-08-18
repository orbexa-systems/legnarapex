'use client'

import { useCallback, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { TrackLocation } from '@/lib/data/lugares'
import { uploadFoto } from '@/lib/actions/uploadFoto'

type ArchivoEstado = {
  file: File
  estado: 'pendiente' | 'subiendo' | 'ok' | 'error'
  progreso: number
  error?: string
}

interface SubidaFotosProps {
  lugares: TrackLocation[]
}

export default function SubidaFotos({ lugares }: SubidaFotosProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()

  const [lugarId, setLugarId] = useState('')
  const [archivos, setArchivos] = useState<ArchivoEstado[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const subiendo = isPending

  function agregarArchivos(files: FileList | null) {
    if (!files) return
    const nuevos: ArchivoEstado[] = Array.from(files)
      .filter((f) => f.type === 'image/jpeg' || f.name.toLowerCase().endsWith('.jpg'))
      .map((file) => ({ file, estado: 'pendiente', progreso: 0 }))
    setArchivos((prev) => [...prev, ...nuevos])
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    agregarArchivos(e.dataTransfer.files)
  }, [])

  function removerArchivo(idx: number) {
    setArchivos((prev) => prev.filter((_, i) => i !== idx))
  }

  async function subirConAction(archivo: ArchivoEstado, idx: number): Promise<void> {
    const form = new FormData()
    form.append('lugar_id', lugarId)
    form.append('file', archivo.file)

    const result = await uploadFoto(form)

    if (result.ok) {
      setArchivos((prev) =>
        prev.map((a, i) => (i === idx ? { ...a, estado: 'ok', progreso: 100 } : a)),
      )
    } else {
      const msg = result.error ?? 'Error desconocido'
      setArchivos((prev) =>
        prev.map((a, i) => (i === idx ? { ...a, estado: 'error', error: msg } : a)),
      )
    }
  }

  function iniciarSubida() {
    if (!lugarId) return
    startTransition(async () => {
      for (let i = 0; i < archivos.length; i++) {
        if (archivos[i].estado !== 'pendiente') continue
        setArchivos((prev) =>
          prev.map((a, idx) => (idx === i ? { ...a, estado: 'subiendo' } : a)),
        )
        await subirConAction(archivos[i], i)
      }
      router.refresh()
    })
  }

  const pendientes = archivos.filter((a) => a.estado === 'pendiente').length
  const completados = archivos.filter((a) => a.estado === 'ok').length
  const errores = archivos.filter((a) => a.estado === 'error').length

  return (
    <div className="rounded-2xl border border-legnar-border bg-legnar-dark p-6">
      <h2 className="mb-5 text-base font-bold uppercase tracking-widest text-legnar-white">
        Subir fotos
      </h2>

      {/* NEXT_PUBLIC_API_URL doubles as a UI signal to warn when the backend is not wired up */}
      {!process.env.NEXT_PUBLIC_API_URL && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-yellow-900/40 bg-yellow-950/20 px-3 py-2.5 text-xs text-yellow-400">
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Backend no conectado. Define <code className="mx-1 font-mono">API_URL</code> y <code className="mx-1 font-mono">NEXT_PUBLIC_API_URL</code> cuando Spring Boot esté listo.
        </div>
      )}

      <div className="mb-4 flex flex-col gap-1.5">
        <label className="text-[10px] font-semibold uppercase tracking-widest text-legnar-gray">
          Lugar de la sesión *
        </label>
        <select
          value={lugarId}
          onChange={(e) => setLugarId(e.target.value)}
          className="rounded-lg border border-legnar-border bg-legnar-black px-3 py-2.5 text-sm text-legnar-white outline-none focus:border-legnar-red"
        >
          <option value="">Selecciona un lugar</option>
          {lugares.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-all ${
          isDragging
            ? 'border-legnar-red bg-legnar-red/10'
            : 'border-legnar-border hover:border-legnar-gray/50 hover:bg-legnar-border/20'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,.jpg"
          multiple
          className="hidden"
          onChange={(e) => agregarArchivos(e.target.files)}
        />
        <svg className="mx-auto mb-3 h-10 w-10 text-legnar-gray/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-sm text-legnar-gray">
          Arrastra los JPG aquí o <span className="text-legnar-white underline">haz clic para seleccionar</span>
        </p>
        <p className="mt-1 text-xs text-legnar-gray/50">Solo archivos .jpg</p>
      </div>

      {archivos.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {archivos.map((a, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-legnar-border bg-legnar-black px-3 py-2"
            >
              <span className="shrink-0">
                {a.estado === 'ok' && (
                  <svg className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {a.estado === 'error' && (
                  <svg className="h-4 w-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                {(a.estado === 'pendiente' || a.estado === 'subiendo') && (
                  <svg className="h-4 w-4 text-legnar-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </span>

              <span className="flex-1 truncate font-mono text-xs text-legnar-white">
                {a.file.name}
              </span>

              {a.estado === 'subiendo' && (
                <div className="h-1 w-20 overflow-hidden rounded-full bg-legnar-border">
                  <div
                    className="h-full rounded-full bg-legnar-red transition-all"
                    style={{ width: `${a.progreso}%` }}
                  />
                </div>
              )}

              {a.estado === 'error' && (
                <span className="text-xs text-red-400">{a.error}</span>
              )}

              {a.estado === 'pendiente' && (
                <button
                  onClick={() => removerArchivo(i)}
                  className="text-legnar-gray/50 transition-colors hover:text-legnar-gray"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}

          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-legnar-gray">
              {completados > 0 && <span className="text-green-400">{completados} ok </span>}
              {errores > 0 && <span className="text-red-400">{errores} con error </span>}
              {pendientes > 0 && <span>{pendientes} pendientes</span>}
            </p>
            {pendientes > 0 && (
              <button
                onClick={iniciarSubida}
                disabled={!lugarId || subiendo}
                className="rounded-full bg-legnar-red px-5 py-2 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-legnar-fire disabled:cursor-not-allowed disabled:opacity-40"
              >
                {subiendo ? 'Subiendo...' : `Subir ${pendientes} foto${pendientes > 1 ? 's' : ''}`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
