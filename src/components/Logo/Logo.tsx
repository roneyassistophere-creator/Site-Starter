import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'
import siteConfig from '@/config/site'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = ({ className, loading, priority }: Props) => {
  const { logo, name } = siteConfig

  if (logo.imagePath) {
    return (
      <Image
        alt={name}
        src={logo.imagePath}
        width={160}
        height={36}
        loading={loading ?? 'lazy'}
        fetchPriority={priority ?? 'low'}
        className={clsx('h-9 w-auto', className)}
      />
    )
  }

  // Text logo fallback — styled to look sharp in both light and dark modes
  return (
    <span
      className={clsx(
        'font-bold text-xl tracking-tight leading-none select-none',
        className,
      )}
      aria-label={name}
    >
      {logo.text ?? name}
    </span>
  )
}
