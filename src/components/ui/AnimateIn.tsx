"use client";

import {
  useRef,
  useEffect,
  useState,
  type ReactNode,
  type CSSProperties,
  type ElementType,
} from "react";

type Animation = "fade-up" | "fade-in";

interface AnimateInProps {
  children: ReactNode;
  animation?: Animation;
  delay?: number;
  threshold?: number;
  className?: string;
  as?: ElementType;
}

export default function AnimateIn({
  children,
  animation = "fade-up",
  delay = 0,
  threshold = 0.12,
  className,
  as: Tag = "div",
}: AnimateInProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  const style: CSSProperties = delay
    ? ({ "--anim-delay": `${delay}ms` } as CSSProperties)
    : {};

  return (
    <Tag
      ref={ref}
      className={`${visible ? `animate-${animation}` : "opacity-0"} ${className ?? ""}`}
      style={style}
    >
      {children}
    </Tag>
  );
}
