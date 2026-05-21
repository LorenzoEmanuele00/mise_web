type Dir = 'right' | 'left' | 'up' | 'down'

const ROT: Record<Dir, number> = { right: 0, left: 180, up: -90, down: 90 }

export default function Arrow({ size = 14, dir = 'right' as Dir }: { size?: number; dir?: Dir }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: `rotate(${ROT[dir]}deg)`, flexShrink: 0 }}
      aria-hidden="true"
    >
      <path d="M2 8h12M9 3l5 5-5 5" />
    </svg>
  )
}
