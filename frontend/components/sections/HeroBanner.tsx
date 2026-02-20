"use client";

import GlassCard from "@/components/ui/GlassCard";

export default function HeroBanner() {
  const handleViewProjects = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("exploration-map");
    if (!target) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
  };

  return (
    <section
      className="relative py-24 px-4 bg-neutral-950"
      aria-label="Company overview"
    >
      {/* Subtle continuation of the ocean gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 80% at 70% 50%, rgba(6,123,194,0.07) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div
        className="relative mx-auto"
        style={{ maxWidth: "var(--container-lg)" }}
      >
        <GlassCard className="p-8 md:p-12 lg:p-16">
          {/* Section label */}
          <p
            className="font-sans-body text-sky-reflection tracking-[0.18em] uppercase mb-6"
            style={{ fontSize: "var(--text-xs)" }}
          >
            About AEI
          </p>

          {/* Headline — exact spec */}
          <h2
            className="font-sans-header font-bold text-neutral-50 leading-tight"
            style={{ fontSize: "var(--text-hero)", lineHeight: 1.1 }}
          >
            High Impact Deep Water Oil &amp; Gas Exploration.
          </h2>

          {/* Subheadline — exact spec */}
          <p
            className="mt-6 text-neutral-200 font-sans-body leading-relaxed max-w-2xl"
            style={{ fontSize: "var(--text-body-lg)", lineHeight: 1.6 }}
          >
            PT Agra Energi Indonesia — privately held, operating at the frontier
            of Indonesian energy.
          </p>

          {/* CTA — "View Projects" scrolls to the exploration map */}
          <div className="mt-10">
            <a
              href="#exploration-map"
              onClick={handleViewProjects}
              className="inline-flex items-center gap-2 font-sans-body font-medium text-white bg-teal-blue hover:bg-primary-hover hover:-translate-y-0.5 transition-all rounded-[var(--radius-button)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-blue"
              style={{
                fontSize: "var(--text-body-lg)",
                padding: "1rem 2rem",
              }}
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
    </section>
  );
}
