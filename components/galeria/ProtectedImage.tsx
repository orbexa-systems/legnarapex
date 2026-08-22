'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface Props {
  src: string
  alt: string
  sizes?: string
  quality?: number
  className?: string
  onLoad?: () => void
}

type Mode = 'detecting' | 'video' | 'img'

/**
 * On Android, renders the image via canvas→captureStream→<video> so the OS
 * media pipeline marks it as protected content, showing black in screenshots.
 * Falls back to a regular <Image> on non-Android or if the stream API fails.
 */
export default function ProtectedImage({ src, alt, sizes, quality, className, onLoad }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mode, setMode] = useState<Mode>('detecting')

  useEffect(() => {
    const isAndroid = /android/i.test(navigator.userAgent)

    if (!isAndroid) {
      setMode('img')
      return
    }

    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) { setMode('img'); return }

    const img = new window.Image()

    img.onload = () => {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) { setMode('img'); return }
      ctx.drawImage(img, 0, 0)

      try {
        const stream = canvas.captureStream(30)
        video.srcObject = stream
        video.play()
          .then(() => { setMode('video'); onLoad?.() })
          .catch(() => { setMode('img') })
      } catch {
        setMode('img')
      }
    }

    img.onerror = () => setMode('img')
    img.src = src
  }, [src, onLoad])

  return (
    <>
      <canvas ref={canvasRef} className="hidden" aria-hidden />

      {/* Android: video stream — shows black in screenshots */}
      <video
        ref={videoRef}
        muted
        playsInline
        aria-label={alt}
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${
          mode === 'video' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } ${className ?? ''}`}
      />

      {/* Non-Android or fallback */}
      {mode === 'img' && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={quality}
          draggable={false}
          onLoad={onLoad}
          className={className}
        />
      )}
    </>
  )
}
