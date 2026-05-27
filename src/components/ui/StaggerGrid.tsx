"use client";

import { useRef, useEffect, type ReactNode } from "react";

interface StaggerGridProps {
  className?: string;
  children: ReactNode;
}

export default function StaggerGrid({ className, children }: StaggerGridProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = ref.current;
    if (!grid) return;

    const items = Array.from(grid.querySelectorAll<HTMLElement>(":scope > *"));
    const observers: IntersectionObserver[] = [];

    items.forEach((item) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            item.classList.add("stagger-ready");
            obs.disconnect();
          }
        },
        { rootMargin: "0px 0px -30% 0px" },
      );
      obs.observe(item);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
