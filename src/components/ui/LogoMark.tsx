import type { CSSProperties } from "react";

export default function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <div
      className="nav-logo-mark"
      style={{ "--size": `${size}px` } as CSSProperties}
    >
      M
    </div>
  );
}
