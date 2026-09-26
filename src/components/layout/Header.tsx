"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoMark from "@/components/ui/LogoMark";
import R2Image from "@/components/ui/R2Image";
import { NAV_ITEMS } from "@/lib/nav";
import type { R2Image as R2ImageType } from "@/lib/types";

interface HeaderProps {
  logo?: R2ImageType | null;
}

export default function Header({ logo }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Chiude il menu al cambio pagina. Il confronto avviene durante il render
  // invece che in un effect, così si evita un render in più.
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Con il menu aperto: Escape chiude, Tab resta dentro il drawer.
  // Il focus va sul primo elemento all'apertura e torna al burger alla chiusura.
  useEffect(() => {
    const drawer = drawerRef.current;
    if (!open || !drawer) return;
    const burger = burgerRef.current;
    const focusables = () =>
      Array.from(drawer.querySelectorAll<HTMLElement>("button, a[href]"));
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      burger?.focus();
    };
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header className="nav">
        <div className="shell nav-inner">
          <Link
            href="/"
            className="nav-logo"
            aria-label="Misericordia di Gello — home"
          >
            {logo?.src ? (
              <R2Image image={logo} className="h-9 w-auto" />
            ) : (
              <LogoMark />
            )}
            <div className="flex flex-col leading-none">
              <span className="text-[18px] tracking-[-0.01em]">
                Misericordia
              </span>
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-on-dark mt-1">
                di Gello · dal 1994
              </span>
            </div>
          </Link>

          <nav className="nav-links" aria-label="Navigazione principale">
            {NAV_ITEMS.filter((item) => item.href !== "/volontariato").map(
              (item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link${isActive(item.href) ? " active" : ""}`}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="nav-cta">
            <button
              ref={burgerRef}
              className="nav-burger"
              aria-expanded={open}
              aria-controls="nav-drawer"
              aria-label={open ? "Chiudi menu" : "Apri menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <span
                aria-hidden="true"
                className="flex flex-col justify-center items-center w-5 h-5 gap-1"
              >
                <span
                  className={`nav-bar-top block h-px bg-current transition-transform duration-200 w-full${open ? " open" : ""}`}
                />
                <span
                  className={`nav-bar-mid block h-px bg-current transition-opacity duration-200 w-full${open ? " open" : ""}`}
                />
                <span
                  className={`nav-bar-bot block h-px bg-current transition-transform duration-200 w-full${open ? " open" : ""}`}
                />
              </span>
              <span>{open ? "Chiudi" : "Menu"}</span>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`nav-scrim${open ? " open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="nav-drawer"
        className={`nav-drawer${open ? " open" : ""}`}
        ref={drawerRef}
        inert={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Menu di navigazione"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            {logo?.src ? (
              <R2Image image={logo} className="h-9 w-auto" />
            ) : (
              <LogoMark size={36} />
            )}
            <span className="kicker no-rule text-bg/60">Menu</span>
          </div>
          <button
            className="p-1 opacity-60 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer text-bg text-2xl leading-none"
            onClick={() => setOpen(false)}
            aria-label="Chiudi menu"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 py-4" aria-label="Menu mobile">
          {NAV_ITEMS.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={`flex items-center justify-between px-6 py-4 border-b border-white/10 text-bg no-underline hover:bg-white/5 transition-colors${isActive(item.href) ? " bg-white/10" : ""}`}
            >
              <span className="text-base">{item.label}</span>
              <span aria-hidden="true" className="num text-bg/40">
                0{i + 1}
              </span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
