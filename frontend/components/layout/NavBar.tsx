"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

export default function NavBar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const navRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme } = useTheme();
  const whiteLogoRef = useRef<HTMLImageElement>(null);
  const blackLogoRef = useRef<HTMLImageElement>(null);

  // ─── Scroll-linked background fade + logo crossfade for home page ───
  useEffect(() => {
    const nav = navRef.current;
    const bg = bgRef.current;
    const whiteLogo = whiteLogoRef.current;
    const blackLogo = blackLogoRef.current;
    if (!nav || !bg) return;

    const setLogos = (progress: number) => {
      if (!whiteLogo || !blackLogo) return;
      if (theme === "dark") {
        whiteLogo.style.opacity = "1";
        blackLogo.style.opacity = "0";
      } else {
        whiteLogo.style.opacity = String(1 - progress);
        blackLogo.style.opacity = String(progress);
      }
    };

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!isHome || prefersReduced) {
      bg.style.opacity = "1";
      nav.removeAttribute("data-hero");
      setLogos(1);
      return;
    }

    const applyState = (progress: number) => {
      bg.style.opacity = String(progress);
      if (progress < 0.5) {
        nav.setAttribute("data-hero", "");
      } else {
        nav.removeAttribute("data-hero");
      }
      setLogos(progress);
    };

    const handleScroll = () => {
      const isMobile = window.innerWidth < 768;
      const vh = window.innerHeight;
      const start = vh * (isMobile ? 0.4 : 0.3);
      const end = vh * (isMobile ? 0.55 : 0.5);
      const scrollY = window.scrollY;

      if (scrollY <= start) {
        applyState(0);
      } else if (scrollY >= end) {
        applyState(1);
      } else {
        applyState((scrollY - start) / (end - start));
      }
    };

    applyState(0);
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome, theme]);

  // ─── Focus trap + close handler for mobile menu ───
  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
    hamburgerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const overlay = overlayRef.current;
    if (!overlay) return;

    const closeButton = overlay.querySelector<HTMLElement>("[data-close-menu]");
    closeButton?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeMobileMenu();
        return;
      }

      if (e.key !== "Tab") return;

      const focusable = overlay!.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, closeMobileMenu]);

  return (
    <nav
      ref={navRef}
      className="group fixed top-0 left-0 right-0 z-50"
      data-hero={isHome ? "" : undefined}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Background layer — fades in on scroll */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-bg-subtle/85 backdrop-blur-[12px] border-b border-border-subtle/40"
        style={{ opacity: isHome ? 0 : 1 }}
        aria-hidden="true"
      />

      {/* 3-column grid: logo left | links center | hamburger right */}
      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center px-4 md:px-8 py-3">
        {/* Left column — logo */}
        <div className="justify-self-start">
          <Link
            href="/"
            className="group/logo flex items-center gap-2.5"
          >
            <div className="relative w-9 h-9 shrink-0">
              <img
                ref={whiteLogoRef}
                src="/images/logos/astrolabe_white.svg"
                alt=""
                className="absolute inset-0 w-full h-full"
                style={{ opacity: isHome ? 1 : 0 }}
                aria-hidden="true"
              />
              <img
                ref={blackLogoRef}
                src="/images/logos/astrolabe_black.svg"
                alt=""
                className="absolute inset-0 w-full h-full"
                style={{ opacity: isHome ? 0 : 1 }}
                aria-hidden="true"
              />
              <img
                src="/images/logos/astrolabe_blue.svg"
                alt=""
                className="absolute inset-0 w-full h-full opacity-0 group-hover/logo:opacity-100 transition-opacity duration-200"
                aria-hidden="true"
              />
            </div>
            <span className="font-sans font-bold text-fg group-data-[hero]:text-white group-hover/logo:text-secondary group-data-[hero]:group-hover/logo:text-secondary transition-colors duration-300 text-h4">
              AEI
            </span>
          </Link>
        </div>

        {/* Center column — nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-fg-secondary group-data-[hero]:text-white/90 hover:text-secondary transition-colors duration-200 font-body font-semibold text-small after:content-[''] after:absolute after:bottom-[-3px] after:left-0 after:h-[1.5px] after:w-full after:bg-secondary after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:after:transition-none"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right column — mobile hamburger */}
        <div className="justify-self-end md:hidden">
          <button
            ref={hamburgerRef}
            className="text-fg group-data-[hero]:text-white transition-colors duration-300 p-2 rounded focus-visible:outline-2 focus-visible:outline-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile full-screen overlay with focus trap */}
      {mobileOpen && (
        <div
          ref={overlayRef}
          className="md:hidden fixed inset-0 bg-bg-subtle/95 flex flex-col items-center justify-center gap-10 z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <button
            data-close-menu
            className="absolute top-4 right-4 text-fg p-2 rounded focus-visible:outline-2 focus-visible:outline-primary"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-fg hover:text-secondary transition-colors font-sans font-semibold text-h3"
              onClick={closeMobileMenu}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
