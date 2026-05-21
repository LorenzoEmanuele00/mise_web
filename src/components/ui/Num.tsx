import type { ReactNode } from 'react'

export default function Num({ children }: { children: ReactNode }) {
  return <span className="num">{children}</span>
}
