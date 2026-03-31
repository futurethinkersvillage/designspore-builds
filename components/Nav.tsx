'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

const links = [
  { href: '/stay',             label: 'Stay' },
  { href: '/play',             label: 'Play' },
  { href: '/explore',          label: 'Explore' },
  { href: '/seasonal-village', label: 'Village' },
  { href: '/venue',            label: 'Venue' },
]

export default function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  if (pathname === '/intelligence-report') return null

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-bark/95 backdrop-blur-sm border-b border-border' : 'bg-transparent'
        }`}
      >
        <div className="container-content flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/logo-white.png"
              alt="Wells Gray Golf & RV Resort"
              width={36}
              height={36}
              className="w-8 h-8 md:w-9 md:h-9 object-contain"
            />
            <span className="font-display text-parchment text-sm font-light tracking-wide hidden sm:block">
              Wells Gray Resort
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-body text-sm text-parchment/70 hover:text-parchment transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link href="/stay#book" className="btn-ember text-xs md:text-sm py-2 md:py-3 hidden sm:inline-flex">
              Book Now
            </Link>
            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="md:hidden flex flex-col gap-1.5 p-1"
            >
              <span className={`block w-5 h-px bg-parchment transition-transform duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-px bg-parchment transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-px bg-parchment transition-transform duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-bark/98 flex flex-col justify-center px-8 transition-all duration-400 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="font-display text-parchment text-4xl font-light"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/stay#book"
            onClick={() => setOpen(false)}
            className="btn-ember self-start mt-4"
          >
            Book Now
          </Link>
        </nav>
      </div>
    </>
  )
}
