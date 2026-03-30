"use client";

import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

/** Fine diagonal crosshatch — pure CSS, zero computation cost */
const TEXTURE_BG = [
  "repeating-linear-gradient(45deg, rgba(255,255,255,0.18) 0px, rgba(255,255,255,0.18) 1px, transparent 1px, transparent 4px)",
  "repeating-linear-gradient(-45deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 4px)",
].join(", ");

export default function HeroSplash() {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    setIsTouchDevice(
      "ontouchstart" in window || navigator.maxTouchPoints > 0,
    );
  }, []);

  // ── Cursor-following glow: pixel coords, opacity transition handles smoothing ──
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (prefersReduced || !glowRef.current || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glowRef.current.style.setProperty("--glow-x", `${x}px`);
      glowRef.current.style.setProperty("--glow-y", `${y}px`);
      glowRef.current.style.opacity = "0.22";
    },
    [prefersReduced],
  );

  const handleMouseLeave = useCallback(() => {
    if (!glowRef.current) return;
    glowRef.current.style.opacity = "0";
  }, []);

  useGSAP(
    () => {
      if (!logoRef.current || !sectionRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const mm = gsap.matchMedia();

      // Desktop: animate from 30vh → 50vh scroll
      mm.add("(min-width: 768px)", () => {
        gsap.to(logoRef.current, {
          opacity: 0,
          scale: 0.55,
          y: -130,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "30% top",
            end: "50% top",
            scrub: true,
          },
        });
      });

      // Mobile: animate from 40vh → 55vh scroll
      mm.add("(max-width: 767px)", () => {
        gsap.to(logoRef.current, {
          opacity: 0,
          scale: 0.55,
          y: -90,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "40% top",
            end: "55% top",
            scrub: true,
          },
        });
      });

      // ── Scroll indicator — delayed entrance with glow ──
      if (scrollRef.current) {
        gsap.set(scrollRef.current, { opacity: 0, y: 20 });

        // Fade in
        gsap.to(scrollRef.current, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          delay: 2,
        });

        // Pulsing glow on the text (starts after entrance)
        const textEl = scrollRef.current.querySelector("[data-scroll-text]");
        if (textEl) {
          gsap.fromTo(
            textEl,
            { textShadow: "0 0 0px transparent" },
            {
              textShadow: "0 0 18px var(--color-secondary)",
              duration: 2,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              delay: 3.2,
            },
          );
        }

        // Fade out on scroll — delayed start, longer range
        gsap.to(scrollRef.current, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "20% top",
            end: "35% top",
            scrub: true,
          },
        });
      }

      // Gentle chevron bob (starts after entrance completes)
      if (chevronRef.current) {
        gsap.to(chevronRef.current, {
          y: 10,
          duration: 1.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 3.2,
        });
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex items-start justify-center h-dvh overflow-hidden pt-[15dvh]"
      style={{ backgroundColor: "var(--color-palette-primary-dark)" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Hero splash"
    >
      {/* Embossed logo — parent clips all children to logo shape */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none emboss-logo-mask"
        aria-hidden="true"
      >
        {/* Base: crosshatch texture (always visible, low opacity) */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: TEXTURE_BG }}
        />
        {/* Glow: cursor spotlight (desktop only, fades in/out) */}
        {!prefersReduced && (
          <div ref={glowRef} className="emboss-glow" />
        )}
      </div>

      {/* Centered wordmark — animated to fade on scroll */}
      <div ref={logoRef} className="relative z-10 flex flex-col items-center text-center px-4">
        <h1
          className="font-serif font-extralight text-white leading-none m-0"
          style={{ fontSize: "calc(var(--text-logo-splash) * 2)", letterSpacing: "-0.06em" }}
        >
          Agra Energi
        </h1>
        <h1
          className="font-serif font-extralight text-white leading-none m-0"
          style={{ fontSize: "calc(var(--text-logo-splash) * 2)", letterSpacing: "-0.06em" }}
        >
          Indonesia
        </h1>
      </div>

      {/* Scroll indicator — delayed entrance with glow, fades on scroll */}
      <div
        ref={scrollRef}
        className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-4"
        aria-hidden="true"
      >
        <span
          data-scroll-text
          className="text-white font-body tracking-[0.3em] pl-[0.3em] uppercase text-body-lg font-medium"
        >
          {isTouchDevice ? "Swipe Down to Explore" : "Scroll to Explore"}
        </span>
        <div ref={chevronRef}>
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 14l9 9 9-9"
              stroke="var(--color-secondary)"
              strokeOpacity="0.8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
