import type { CSSProperties, ReactNode } from 'react'

interface KickerProps {
  children: ReactNode
  noRule?: boolean
  className?: string
  style?: CSSProperties
}

export default function Kicker({ children, noRule, className, style }: KickerProps) {
  return (
    <span className={`kicker${noRule ? ' no-rule' : ''}${className ? ` ${className}` : ''}`} style={style}>
      {children}
    </span>
  )
}
