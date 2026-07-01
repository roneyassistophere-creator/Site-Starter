'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SearchIcon } from 'lucide-react'
import clsx from 'clsx'
import siteConfig from '@/config/site'

export const HeaderNav: React.FC = () => {
  const pathname = usePathname()

  return (
    <nav className="flex gap-3 items-center">
      {siteConfig.nav.map(({ label, href }) => (
        <Link
          key={href}
          href={href}
          className={clsx(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === href ? 'text-primary' : 'text-foreground/80',
          )}
        >
          {label}
        </Link>
      ))}
      <Link href="/search" aria-label="Search">
        <SearchIcon className="w-5 text-primary" />
      </Link>
    </nav>
  )
}
