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
  { name: "MI Gaea B.V.", src: "/images/partner_logos/mi-gaea.png", aspectRatio: 6.44 },
];

const ROW_1 = LOGOS.slice(0, 4);
const ROW_2 = LOGOS.slice(4, 7);
const MI_GAEA = LOGOS[7];

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

function renderLogo(logo: PartnerLogo, isMiGaea = false) {
  const size = isMiGaea
    ? { width: Math.round(56 * logo.aspectRatio), height: 56 }
    : computeLogoSize(logo.aspectRatio);

  const image = (
    <Image
      src={logo.src}
      alt={logo.name}
      width={size.width}
      height={size.height}
      className="object-contain"
      unoptimized={logo.src.endsWith(".svg")}
    />
  );

  return (
    <div key={logo.name} data-logo>
      <div
        className="flex items-center justify-center p-4
          hover:scale-105 focus-within:scale-105
          transition-transform duration-300 ease-out"
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

      const logos = sectionRef.current?.querySelectorAll("[data-logo]");
      if (!logos?.length) return;

      gsap.fromTo(
        logos,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 bg-bg-subtle"
      aria-label="Partners and stakeholders"
    >
      <div
        className="mx-auto text-center"
        style={{ maxWidth: "var(--container-xl)" }}
      >
        <h2 className="font-sans-header font-semibold text-fg mb-3 text-h2">
          Our Partners &amp; Stakeholders
        </h2>
        <p className="text-fg-muted font-sans-body mb-12 text-body">
          Working alongside world-class operators and institutional partners.
        </p>

        {/* Logo rows — weighted flex layout */}
        <div className="flex flex-col items-center gap-8 lg:gap-10">
          {/* Row 1: BP, Mitsui, CNOOC, LNG Japan */}
          <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-12">
            {ROW_1.map((logo) => renderLogo(logo))}
          </div>

          {/* Row 2: EnQuest, ENEOS, Mecon */}
          <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-12">
            {ROW_2.map((logo) => renderLogo(logo))}
          </div>

          {/* Row 3: MI Gaea (ultra-wide, own row) */}
          <div className="flex justify-center items-center">
            {renderLogo(MI_GAEA, true)}
          </div>
        </div>
      </div>
    </section>
  );
}
