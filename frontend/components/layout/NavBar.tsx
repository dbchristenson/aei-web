"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
];

export default function NavBar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const navRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ─── Scroll-linked opacity + aria-hidden for home page ───
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isHome || prefersReduced) {
      nav.style.opacity = "1";
      nav.style.pointerEvents = "auto";
      nav.removeAttribute("aria-hidden");
      return;
    }

    const applyOpacity = (opacity: number) => {
      nav.style.opacity = String(opacity);
      nav.style.pointerEvents = opacity < 0.1 ? "none" : "auto";
      if (opacity < 0.1) {
        nav.setAttribute("aria-hidden", "true");
      } else {
        nav.removeAttribute("aria-hidden");
      }
    };

    const handleScroll = () => {
      const isMobile = window.innerWidth < 768;
      const vh = window.innerHeight;
      const start = vh * (isMobile ? 0.4 : 0.3);
      const end = vh * (isMobile ? 0.55 : 0.5);
      const scrollY = window.scrollY;

      if (scrollY <= start) {
        applyOpacity(0);
      } else if (scrollY >= end) {
        applyOpacity(1);
      } else {
        applyOpacity((scrollY - start) / (end - start));
      }
    };

    applyOpacity(0);
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

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
          className="font-serif font-bold text-fg hover:text-secondary transition-colors text-h4"
        >
          AEI
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-fg-secondary hover:text-fg transition-colors font-sans-body text-small"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
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
              className="text-fg hover:text-secondary transition-colors font-sans-header font-semibold text-h3"
              onClick={closeMobileMenu}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
          <Button href="/contact" size="lg" onClick={closeMobileMenu}>
            Contact Us
          </Button>
        </div>
      )}
    </nav>
  );
}
