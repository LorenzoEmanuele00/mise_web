'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Arrow from '@/components/ui/Arrow'

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/storia', label: 'Storia' },
  { href: '/servizi', label: 'Servizi' },
  { href: '/servizio-civile', label: 'Servizio Civile' },
  { href: '/galleria', label: 'Galleria' },
  { href: '/news', label: 'News' },
  { href: '/contatti', label: 'Contatti' },
]

function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <div
      className="nav-logo-mark"
      style={{ width: size, height: size, fontSize: size * 0.6 }}
    >
      M
    </div>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <header className="nav">
        <div className="shell nav-inner">
          <Link href="/" className="nav-logo" aria-label="Misericordia di Gello — home">
            <LogoMark />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontSize: 18, letterSpacing: '-0.01em' }}>Misericordia</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted)', marginTop: 4 }}>
                di Gello · dal 1947
              </span>
            </div>
          </Link>

          <nav className="nav-links" aria-label="Navigazione principale">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link${isActive(item.href) ? ' active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="nav-cta">
            <a
              href="tel:118"
              className="hidden md:flex items-center gap-1.5 text-sm"
              aria-label="Chiama emergenze 118"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" aria-hidden="true" />
              <span className="font-medium">118</span>
            </a>

            <Link href="/volontariato" className="btn btn-dark hidden md:inline-flex">
              <span>Unisciti</span>
              <Arrow />
            </Link>

            <button
              className="nav-burger"
              aria-expanded={open}
              aria-controls="nav-drawer"
              aria-label={open ? 'Chiudi menu' : 'Apri menu'}
              onClick={() => setOpen((o) => !o)}
            >
              <span
                aria-hidden="true"
                className="flex flex-col justify-center items-center w-5 h-5 gap-1"
              >
                <span
                  className="block h-px bg-current transition-transform duration-200 w-full"
                  style={{ transform: open ? 'rotate(45deg) translateY(4px)' : undefined }}
                />
                <span
                  className="block h-px bg-current transition-opacity duration-200 w-full"
                  style={{ opacity: open ? 0 : 1 }}
                />
                <span
                  className="block h-px bg-current transition-transform duration-200 w-full"
                  style={{ transform: open ? 'rotate(-45deg) translateY(-4px)' : undefined }}
                />
              </span>
              <span>{open ? 'Chiudi' : 'Menu'}</span>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`nav-scrim${open ? ' open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="nav-drawer"
        className={`nav-drawer${open ? ' open' : ''}`}
        aria-hidden={!open}
        role="dialog"
        aria-label="Menu di navigazione"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <LogoMark size={32} />
            <span className="kicker no-rule text-bg/60">Menu</span>
          </div>
          <button
            className="p-1 opacity-60 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer text-bg text-2xl leading-none"
            onClick={() => setOpen(false)}
            aria-label="Chiudi menu"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 py-4" aria-label="Menu mobile">
          {NAV_ITEMS.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-6 py-4 border-b border-white/10 text-bg no-underline hover:bg-white/5 transition-colors${isActive(item.href) ? ' bg-white/10' : ''}`}
            >
              <span className="text-base">{item.label}</span>
              <span className="num text-bg/40">0{i + 1}</span>
            </Link>
          ))}
          <Link
            href="/volontariato"
            className={`flex items-center justify-between px-6 py-4 border-b border-white/10 text-bg no-underline hover:bg-white/5 transition-colors${pathname === '/volontariato' ? ' bg-white/10' : ''}`}
          >
            <span className="text-base">Volontariato</span>
            <span className="num text-bg/40">08</span>
          </Link>
        </nav>

        <div className="px-6 py-6 mt-auto flex flex-col gap-4 border-t border-white/10">
          <a
            href="tel:118"
            className="flex items-center gap-2 text-bg/80 no-underline"
            aria-label="Chiama emergenze 118"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" aria-hidden="true" />
            <span className="text-sm">Emergenze · 118</span>
          </a>
          <Link href="/volontariato" className="btn btn-dark self-start" onClick={() => setOpen(false)}>
            <span>Unisciti</span>
            <Arrow />
          </Link>
        </div>
      </aside>
    </>
  )
}
