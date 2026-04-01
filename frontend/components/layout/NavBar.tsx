"use client";

import Button from "@/components/ui/Button";
import { useTheme } from "@/components/providers/ThemeProvider";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/projects" },
];

export default function NavBar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const navRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme } = useTheme();
  const whiteLogoRef = useRef<HTMLImageElement>(null);
  const blackLogoRef = useRef<HTMLImageElement>(null);

  // ─── Scroll-linked opacity + logo crossfade for home page ───
  useEffect(() => {
    const nav = navRef.current;
    const whiteLogo = whiteLogoRef.current;
    const blackLogo = blackLogoRef.current;
    if (!nav) return;

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

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isHome || prefersReduced) {
      nav.style.opacity = "1";
      nav.style.pointerEvents = "auto";
      nav.removeAttribute("aria-hidden");
      setLogos(1);
      return;
    }

    const applyState = (progress: number) => {
      nav.style.opacity = String(progress);
      nav.style.pointerEvents = progress < 0.1 ? "none" : "auto";
      if (progress < 0.1) {
        nav.setAttribute("aria-hidden", "true");
      } else {
        nav.removeAttribute("aria-hidden");
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
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
      className="fixed top-0 left-0 right-0 z-50 bg-bg-subtle/85 backdrop-blur-[12px] border-b border-border-subtle/40"
      role="navigation"
      aria-label="Main navigation"
    >
      <div
        className="mx-auto flex items-center justify-between px-4 py-3"
        style={{ maxWidth: "var(--container-xl)" }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
        >
          <div className="relative w-6 h-6 shrink-0">
            <img
              ref={whiteLogoRef}
              src="/images/logos/astrolabe_white.svg"
              alt=""
              className="absolute inset-0 w-full h-full"
              aria-hidden="true"
            />
            <img
              ref={blackLogoRef}
              src="/images/logos/astrolabe_black.svg"
              alt=""
              className="absolute inset-0 w-full h-full"
              aria-hidden="true"
            />
            <img
              src="/images/logos/astrolabe_blue.svg"
              alt=""
              className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-hidden="true"
            />
          </div>
          <span className="font-sans font-bold text-fg group-hover:text-secondary transition-colors duration-200 text-h4">
            AEI
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-fg-secondary hover:text-fg transition-colors font-body text-small"
            >
              {link.label}
            </Link>
          ))}
          {/* TODO: re-enable ThemeToggle when dark mode is ready */}
          <Button href="/contact" size="sm">
            Contact Us
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          ref={hamburgerRef}
          className="md:hidden text-fg p-2 rounded focus-visible:outline-2 focus-visible:outline-primary"
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
          {/* TODO: re-enable ThemeToggle when dark mode is ready */}
          <Button href="/contact" size="lg" onClick={closeMobileMenu}>
            Contact Us
          </Button>
        </div>
      )}
    </nav>
  );
}
