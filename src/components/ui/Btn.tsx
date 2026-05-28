import type { ReactNode } from 'react'
import Link from 'next/link'
import Arrow from './Arrow'

type Variant = 'dark' | 'ghost' | 'accent'

interface BtnProps {
  children: ReactNode
  variant?: Variant
  href?: string
  prefetch?: boolean
  onClick?: () => void
  arrow?: boolean
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
}

export default function Btn({
  children,
  variant = 'dark',
  href,
  prefetch,
  onClick,
  arrow = true,
  type = 'button',
  disabled,
  className,
}: BtnProps) {
  const cls = `btn btn-${variant}${className ? ` ${className}` : ''}`
  const inner = (
    <>
      <span>{children}</span>
      {arrow && <Arrow />}
    </>
  )

  if (href) {
    return <Link href={href} prefetch={prefetch} className={cls}>{inner}</Link>
  }

  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {inner}
    </button>
  )
}
