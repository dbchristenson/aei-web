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
      // Over the dark hero (progress≈0): white logo on dark background.
      // Scrolled past hero (progress≈1): theme-appropriate logo.
      if (theme === "dark") {
        // Dark mode bg is always dark — white logo throughout
        whiteLogo.style.opacity = "1";
        blackLogo.style.opacity = "0";
      } else {
        // Light mode: crossfade white→black as navbar bg becomes light
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

  // ─── Lock body scroll when mobile menu is open ───
  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // ─── Focus trap + close handler for mobile menu ───
  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
    hamburgerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const overlay = overlayRef.current;
    if (!overlay) return;

    const firstLink = overlay.querySelector<HTMLElement>("a[href]");
    firstLink?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeMobileMenu();
        return;
      }

      if (e.key !== "Tab") return;

      const overlayFocusable = Array.from(
        overlay!.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const focusable = hamburgerRef.current
        ? [hamburgerRef.current, ...overlayFocusable]
        : overlayFocusable;
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

      {/* Logo left | links center | hamburger right */}
      <div className="relative flex items-center justify-between px-4 md:px-8 py-3 md:grid md:grid-cols-[1fr_auto_1fr]">
        {/* Left column — logo */}
        <div className="md:justify-self-start">
          <Link
            href="/"
            className="group/logo flex items-center gap-2.5"
          >
            <div className="relative w-9 h-9 shrink-0">
              <img
                ref={whiteLogoRef}
                src="/images/logos/astrolabe_white.svg"
                alt=""
                className="absolute inset-0 w-full h-full transition-opacity duration-300"
                aria-hidden="true"
              />
              <img
                ref={blackLogoRef}
                src="/images/logos/astrolabe_black.svg"
                alt=""
                className="absolute inset-0 w-full h-full transition-opacity duration-300"
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

        {/* Right column — mobile hamburger (z-60 to stay above the overlay) */}
        <div className="ml-auto md:hidden relative z-60">
          <button
            ref={hamburgerRef}
            className={`relative transition-colors duration-300 p-3 rounded-lg focus-visible:outline-2 focus-visible:outline-primary ${
              mobileOpen
                ? "text-palette-white"
                : "text-fg group-data-[hero]:text-white"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {/* Square backdrop behind the icon */}
            <div
              className="absolute inset-0 rounded-lg bg-palette-neutral-600 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
              style={{
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? "scale(1)" : "scale(0.8)",
              }}
              aria-hidden="true"
            />
            <svg
              className="relative overflow-visible"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {/* All 3 lines are centered at (12,12). Hamburger: spread apart vertically. Asterisk: rotate from center. */}
              <line
                x1="3" y1="12" x2="21" y2="12"
                className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                style={{
                  transformOrigin: "12px 12px",
                  transform: mobileOpen
                    ? "rotate(60deg)"
                    : "translateY(-6px)",
                }}
              />
              <line
                x1="3" y1="12" x2="21" y2="12"
                className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                style={{
                  transformOrigin: "12px 12px",
                  transform: mobileOpen
                    ? "rotate(0deg)"
                    : "translateY(0)",
                }}
              />
              <line
                x1="3" y1="12" x2="21" y2="12"
                className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                style={{
                  transformOrigin: "12px 12px",
                  transform: mobileOpen
                    ? "rotate(-60deg)"
                    : "translateY(6px)",
                }}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile sidebar with backdrop + focus trap */}
      <div
        ref={overlayRef}
        className="md:hidden fixed inset-0 z-50"
        role={mobileOpen ? "dialog" : undefined}
        aria-modal={mobileOpen ? "true" : undefined}
        aria-hidden={mobileOpen ? undefined : "true"}
        aria-label={mobileOpen ? "Navigation menu" : undefined}
        style={{ pointerEvents: mobileOpen ? "auto" : "none" }}
      >
        {/* Semi-transparent backdrop — click to close */}
        <div
          className="absolute inset-0 bg-bg/80 backdrop-blur-[8px] transition-opacity duration-200"
          style={{ opacity: mobileOpen ? 1 : 0 }}
          onClick={closeMobileMenu}
          aria-hidden="true"
        />

        {/* Sidebar panel */}
        <div
          className="absolute top-0 right-0 h-full w-[min(75vw,280px)] bg-surface/95 backdrop-blur-[12px] border-l border-border-subtle/40 shadow-[-8px_0_24px_rgba(0,0,0,0.08)] overflow-y-auto flex flex-col px-8 pt-20 gap-8"
          style={{
            transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
            transition: "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${isActive ? 'text-secondary' : 'text-fg'} hover:text-secondary transition-colors font-sans font-semibold text-h4`}
                aria-current={isActive ? "page" : undefined}
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
