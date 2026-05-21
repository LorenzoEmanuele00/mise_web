import type { ReactNode } from 'react'
import Kicker from '@/components/ui/Kicker'
import Num from '@/components/ui/Num'

interface SectionLabelProps {
  num: string
  label: string
}

export function SectionLabel({ num, label }: SectionLabelProps) {
  return (
    <div className="flex items-center justify-between mb-14 pb-6 border-b border-hair">
      <Kicker>{label}</Kicker>
      <Num>{num}</Num>
    </div>
  )
}

interface SectionProps {
  children: ReactNode
  dark?: boolean
  tight?: boolean
  loose?: boolean
  id?: string
  className?: string
  noShell?: boolean
}

export default function Section({
  children,
  dark,
  tight,
  loose,
  id,
  className,
  noShell,
}: SectionProps) {
  const py = tight
    ? 'py-[clamp(3rem,4vw,4rem)]'
    : loose
      ? 'py-[clamp(7rem,10vw,10rem)]'
      : 'py-[clamp(5rem,8vw,7rem)]'

  const cls = [
    dark ? 'dark-band' : '',
    py,
    className ?? '',
  ].filter(Boolean).join(' ')

  return (
    <section id={id} className={cls}>
      {noShell ? children : <div className="shell">{children}</div>}
    </section>
  )
}
