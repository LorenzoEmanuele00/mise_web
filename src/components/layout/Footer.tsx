import Link from 'next/link'
import type { Settings } from '@/lib/types'
import Btn from '@/components/ui/Btn'
import Kicker from '@/components/ui/Kicker'
import LogoMark from '@/components/ui/LogoMark'
import { NAV_ITEMS } from '@/lib/nav'

interface FooterProps {
  settings: Settings | null
}

export default function Footer({ settings }: FooterProps) {
  const year = new Date().getFullYear()
  const phone = settings?.phone ?? '050 000 0000'
  const email = settings?.email ?? 'info@misericordiadigello.it'
  const address = settings?.address ?? 'Via di Gello, 12 — 56017 Gello (PI)'
  const cf = settings?.codiceFiscale ?? '00000000000'

  return (
    <footer className="dark-band py-[clamp(4rem,7vw,6rem)]">
      <div className="shell">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12 mb-20">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3.5 mb-6">
              <LogoMark size={44} />
              <span className="serif text-xl text-bg">Misericordia di Gello</span>
            </div>
            <p className="body text-bg/70 max-w-sm">
              Associazione di volontariato fondata nel 1947. Trasporto sanitario, assistenza alla persona, protezione civile e formazione per la comunità di Gello e dintorni.
            </p>
            <div className="mt-7">
              <Btn href="/volontariato" variant="accent">Diventa volontario</Btn>
            </div>
          </div>

          {/* Nav */}
          <div>
            <Kicker noRule className="text-bg/50">Naviga</Kicker>
            <ul className="mt-6 list-none p-0 space-y-1.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="body-sm text-bg/70 no-underline hover:text-bg transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contatti */}
          <div>
            <Kicker noRule className="text-bg/50">Contatti</Kicker>
            <div className="mt-6 body text-bg/70 space-y-0.5">
              {address.split('—').map((line, i) => (
                <p key={i}>{line.trim()}</p>
              ))}
              <p className="mt-3">
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-bg/70 no-underline hover:text-bg transition-colors">
                  {phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${email}`} className="text-bg/70 no-underline hover:text-bg transition-colors">
                  {email}
                </a>
              </p>
            </div>
          </div>

          {/* Emergenze */}
          <div>
            <Kicker noRule className="text-bg/50">Emergenze</Kicker>
            <div className="mt-6">
              <div className="serif text-bg leading-none" style={{ fontSize: 48 }}>118</div>
              <p className="body-sm text-bg/50 mt-2">Pronto soccorso sanitario</p>
            </div>
            <div className="mt-7">
              <p className="body-sm text-bg/50">Centralino sede</p>
              <div className="serif text-bg mt-1 text-2xl">{phone}</div>
            </div>
          </div>
        </div>

        <div className="rule" />

        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <p className="body-sm text-bg/50">© {year} Misericordia di Gello — C.F. {cf}</p>
          <div className="flex gap-6 body-sm text-bg/50">
            <Link href="/privacy" className="text-bg/50 no-underline hover:text-bg/80 transition-colors">Privacy</Link>
            <Link href="/trasparenza" className="text-bg/50 no-underline hover:text-bg/80 transition-colors">Trasparenza</Link>
            <Link href="/cookie" className="text-bg/50 no-underline hover:text-bg/80 transition-colors">Cookie</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
