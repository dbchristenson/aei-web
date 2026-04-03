"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

interface PartnerLogo {
  name: string;
  src: string;
  href?: string;
  aspectRatio: number;
  fullWidth?: boolean;
}

const LOGOS: PartnerLogo[] = [
  // Row 1: Tall + Near-square
  { name: "BP", src: "/images/partner_logos/bp.png", href: "https://www.bp.com", aspectRatio: 0.75 },
  { name: "Mitsui", src: "/images/partner_logos/mitsui.svg", href: "https://www.mitsui.com", aspectRatio: 0.82 },
  { name: "CNOOC", src: "/images/partner_logos/cnooc.svg", href: "https://www.cnoocltd.com", aspectRatio: 1.10 },
  { name: "LNG Japan", src: "/images/partner_logos/lng_japan.png", href: "https://www.lngjapan.com/en/", aspectRatio: 1.0 },
  // Row 2: Wide + Square
  { name: "EnQuest", src: "/images/partner_logos/enquest.png", href: "https://www.enquest.com", aspectRatio: 1.46 },
  { name: "ENEOS", src: "/images/partner_logos/eneos-2.png", href: "https://www.eneos.co.jp/english", aspectRatio: 1.72 },
  { name: "Mecon", src: "/images/partner_logos/mecon.png", aspectRatio: 0.99 },
  // Row 3: Ultra-wide
  { name: "MI Gaea B.V.", src: "/images/partner_logos/mi-gaea.png", aspectRatio: 6.44, fullWidth: true },
];

const ROW_1 = LOGOS.slice(0, 4);
const ROW_2 = LOGOS.slice(4, 7);
const FULL_WIDTH = LOGOS.filter((l) => l.fullWidth);

// Responsive sizing rationale: docs/partner-logo-grid-responsive.md
const TARGET_AREA = 40000;

function computeLogoSize(aspectRatio: number): { width: number; height: number } {
  let height = Math.sqrt(TARGET_AREA / aspectRatio);
  let width = aspectRatio * height;

  // Clamp height to [48, 200], then recalculate width to preserve ratio
  height = Math.max(48, Math.min(200, height));
  width = height * aspectRatio;

  // Cap width, recalculate height
  if (width > 360) {
    width = 360;
    height = width / aspectRatio;
  }

  return { width: Math.round(width), height: Math.round(height) };
}

function renderLogo(logo: PartnerLogo) {
  const size = logo.fullWidth
    ? { width: Math.round(56 * logo.aspectRatio), height: 56 }
    : computeLogoSize(logo.aspectRatio);

  // Mobile caps: 72px height keeps 4 logos visible within viewport width.
  // Full-width logos get tighter caps. Desktop lifts both via md:max-h-none.
  const mobileClass = logo.fullWidth
    ? "max-w-[200px] max-h-[31px] md:max-w-none md:max-h-none"
    : "max-h-[72px] md:max-h-none";

  const image = (
    <Image
      src={logo.src}
      alt={logo.name}
      width={size.width}
      height={size.height}
      className={`object-contain max-w-full h-auto ${mobileClass}`}
      unoptimized={logo.src.endsWith(".svg")}
    />
  );

  return (
    <div key={logo.name} data-logo>
      <div
        className="flex items-center justify-center p-2 md:p-4
          grayscale hover:grayscale-0 focus-within:grayscale-0
          hover:scale-105 focus-within:scale-105
          transition-[filter,transform] duration-300 ease-out"
      >
        {logo.href ? (
          <a
            href={logo.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[var(--radius-button)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            {image}
          </a>
        ) : (
          image
        )}
      </div>
    </div>
  );
}

export default function PartnerLogoGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const section = sectionRef.current;
      if (!section) return;

      const heading = section.querySelector("[data-heading]");
      const subheading = section.querySelector("[data-subheading]");
      const row1 = section.querySelector('[data-row="1"]');
      const row2 = section.querySelector('[data-row="2"]');
      const row3 = section.querySelector('[data-row="3"]');

      if (!heading || !subheading || !row1 || !row2 || !row3) return;

      const row1Logos = row1.querySelectorAll("[data-logo]");
      const row2Logos = row2.querySelectorAll("[data-logo]");
      const row3Logos = row3.querySelectorAll("[data-logo]");

      const duration = 0.6;
      const ease = "power3.out";

      // Set initial states
      gsap.set([heading, subheading], { opacity: 0, y: 24 });
      gsap.set(row1Logos, { opacity: 0, y: 20 });
      gsap.set(row2Logos, { opacity: 0, x: (i) => (i % 2 === 0 ? -30 : 30) });
      gsap.set(row3Logos, { opacity: 0, scale: 0.85 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
        },
      });

      // Phase 1: Heading and subheading fade up
      tl.to(heading, { opacity: 1, y: 0, duration, ease });
      tl.to(subheading, { opacity: 1, y: 0, duration: duration * 0.8, ease }, "-=0.35");

      // Phase 2: Row 1 — fade up with stagger
      tl.to(
        row1Logos,
        { opacity: 1, y: 0, duration, ease, stagger: 0.08 },
        "-=0.2",
      );

      // Phase 3: Row 2 — slide in from sides
      tl.to(
        row2Logos,
        { opacity: 1, x: 0, duration, ease, stagger: 0.08 },
        "-=0.3",
      );

      // Phase 4: Row 3 (MI Gaea) — scale up from center
      tl.to(
        row3Logos,
        { opacity: 1, scale: 1, duration: duration * 0.8, ease },
        "-=0.2",
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 px-4 bg-bg-subtle overflow-hidden"
      aria-label="Partners and stakeholders"
    >
      <div
        className="mx-auto text-center"
        style={{ maxWidth: "var(--container-xl)" }}
      >
        <h2 data-heading className="font-serif font-semibold text-fg mb-3 text-h2">
          Our Partners & Stakeholders
        </h2>
        <p data-subheading className="text-fg-muted font-body mb-12 text-body">
          Working alongside world-class operators and institutional partners.
        </p>

        {/* Logo rows
             Mobile: CSS grid matching desktop row structure (4, 3, 1).
             Desktop (md+): flex layout with computed sizes from TARGET_AREA. */}
        <div className="flex flex-col items-center gap-4 md:gap-8 lg:gap-10 overflow-hidden">
          {/* Row 1: BP, Mitsui, CNOOC, LNG Japan */}
          <div data-row="1" className="grid grid-cols-4 place-items-center gap-2 md:flex md:flex-wrap md:justify-center md:items-center md:gap-6 lg:gap-12">
            {ROW_1.map((logo) => renderLogo(logo))}
          </div>

          {/* Row 2: EnQuest, ENEOS, Mecon */}
          <div data-row="2" className="grid grid-cols-3 place-items-center gap-2 md:flex md:flex-wrap md:justify-center md:items-center md:gap-6 lg:gap-12">
            {ROW_2.map((logo) => renderLogo(logo))}
          </div>

          {/* Row 3: Full-width logos (ultra-wide, own row each) */}
          <div data-row="3" className="flex justify-center items-center">
            {FULL_WIDTH.map((logo) => renderLogo(logo))}
          </div>
        </div>
      </div>
    </section>
  );
}
