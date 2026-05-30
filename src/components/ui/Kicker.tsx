import type { ReactNode } from "react";

interface KickerProps {
  children: ReactNode;
  noRule?: boolean;
  className?: string;
}

export default function Kicker({ children, noRule, className }: KickerProps) {
  return (
    <span
      className={`kicker${noRule ? " no-rule" : ""}${className ? ` ${className}` : ""}`}
    >
      {children}
    </span>
  );
}
