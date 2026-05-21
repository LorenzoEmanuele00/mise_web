export default function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <div
      className="nav-logo-mark"
      style={{ width: size, height: size, fontSize: size * 0.6 }}
    >
      M
    </div>
  )
}
