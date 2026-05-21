import type { CSSProperties, ReactNode } from 'react'

interface KickerProps {
  children: ReactNode
  noRule?: boolean
  style?: CSSProperties
}

export default function Kicker({ children, noRule, style }: KickerProps) {
  return (
    <span className={`kicker${noRule ? ' no-rule' : ''}`} style={style}>
      {children}
    </span>
  )
}
