'use client'

import Image from 'next/image'

interface Props {
  src: string
  alt: string
  sizes?: string
  quality?: number
  className?: string
  onLoad?: () => void
}

export default function ProtectedImage({ src, alt, sizes, quality, className, onLoad }: Props) {
  return (
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
  )
}
