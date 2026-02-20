"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSplash() {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

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
        return () => mm.revert();
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
        return () => mm.revert();
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center min-h-screen overflow-hidden"
      aria-label="Hero splash"
    >
      {/* Animated ocean gradient background */}
      <div className="absolute inset-0 bg-neutral-950" aria-hidden="true" />

      {/* Teal-blue glow blob — upper-left */}
      <div
        className="absolute rounded-full animate-blob-1 pointer-events-none"
        style={{
          width: "65%",
          height: "60%",
          left: "-15%",
          top: "-15%",
          background: "radial-gradient(ellipse, rgba(6,123,194,0.14) 0%, transparent 70%)",
          filter: "blur(72px)",
        }}
        aria-hidden="true"
      />

      {/* Sky-reflection glow blob — lower-right */}
      <div
        className="absolute rounded-full animate-blob-2 pointer-events-none"
        style={{
          width: "55%",
          height: "55%",
          right: "-10%",
          bottom: "-10%",
          background:
            "radial-gradient(ellipse, rgba(132,188,218,0.09) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
        aria-hidden="true"
      />

      {/* Vignette: dark gradient overlay from bottom */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-neutral-950/10 via-transparent to-neutral-950/90 pointer-events-none"
        aria-hidden="true"
      />

      {/* Centered logo — animated to dock in nav on scroll */}
      <div ref={logoRef} className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Placeholder logo mark (client to provide SVG) */}
        <div className="mb-8" aria-hidden="true">
          <svg
            width="72"
            height="72"
            viewBox="0 0 72 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="36" cy="36" r="34" stroke="rgba(6,123,194,0.55)" strokeWidth="1.5" />
            <circle cx="36" cy="36" r="24" stroke="rgba(132,188,218,0.35)" strokeWidth="1" />
            <line
              x1="36"
              y1="4"
              x2="36"
              y2="68"
              stroke="rgba(132,188,218,0.25)"
              strokeWidth="0.75"
            />
            <line
              x1="4"
              y1="36"
              x2="68"
              y2="36"
              stroke="rgba(132,188,218,0.25)"
              strokeWidth="0.75"
            />
          </svg>
        </div>

        {/* AEI wordmark — Lora serif, logo-splash size */}
        <h1
          className="font-serif font-bold text-neutral-50 leading-none tracking-tight"
          style={{ fontSize: "var(--text-logo-splash)" }}
        >
          AEI
        </h1>

        {/* Company name */}
        <p
          className="mt-5 text-sky-reflection font-sans-body tracking-[0.22em] uppercase"
          style={{ fontSize: "var(--text-xs)" }}
        >
          PT Agra Energi Indonesia
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span
          className="text-neutral-400 font-sans-body tracking-widest uppercase"
          style={{ fontSize: "var(--text-xs)" }}
        >
          Scroll
        </span>
        <div className="animate-scroll-bounce">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 8l5 5 5-5"
              stroke="rgba(132,188,218,0.6)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
