"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlassCard from "@/components/ui/GlassCard";
import VideoBackground from "@/components/ui/VideoBackground";
import { HERO_BANNER_VIDEO } from "@/lib/media";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function HeroBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced || !sectionRef.current) return;

      // Subtle parallax zoom on the video as content slides over
      if (videoWrapRef.current) {
        gsap.to(videoWrapRef.current, {
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // GlassCard content fades + drifts up (holds 30%, then fades)
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          opacity: 0,
          y: -80,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "30% top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="sticky top-0 min-h-dvh flex items-center px-4 bg-bg-subtle overflow-hidden"
      style={{ zIndex: 0 }}
      aria-label="Company overview"
    >
      <div
        ref={videoWrapRef}
        className="absolute inset-0 will-change-transform"
      >
        <VideoBackground
          videoKey={HERO_BANNER_VIDEO}
          overlay="darken"
          priority
        />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 mx-auto w-full will-change-[transform,opacity]"
        style={{ maxWidth: "var(--container-lg)" }}
      >
        <GlassCard className="p-8 md:p-12 lg:p-16">
          {/* Section label */}
          <p className="font-sans text-secondary tracking-[0.18em] uppercase mb-6 text-xs">
            About AEI
          </p>

          {/* Headline */}
          <h2 className="font-serif font-bold text-fg text-hero">
            High Impact Energy Projects.
          </h2>

          {/* Subheadline */}
          <p className="mt-6 text-fg-secondary font-body max-w-2xl text-body-lg">
            PT Agra Energi Indonesia — privately held, providing security and
            reliability to Indonesia&apos;s grid.
          </p>

          {/* CTA — native anchor with CSS smooth scroll */}
          <div className="mt-10">
            <a
              href="#exploration-map"
              className="inline-flex items-center gap-2 px-8 py-4 font-sans font-medium text-fg-inverse bg-primary hover:bg-primary-hover hover:-translate-y-0.5 transition-all rounded-[var(--radius-button)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary text-body-lg"
            >
              View Projects
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M9 3l6 6-6 6M3 9h12"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </GlassCard>
      </div>

      {/* Bottom gradient — cinematic fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-44 md:h-56 pointer-events-none z-[1]"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--color-bg-subtle))",
        }}
      />
    </section>
  );
}
