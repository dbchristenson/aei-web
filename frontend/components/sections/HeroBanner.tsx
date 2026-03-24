import GlassCard from "@/components/ui/GlassCard";
import VideoBackground from "@/components/ui/VideoBackground";
import { HERO_BANNER_VIDEO } from "@/lib/media";

export default function HeroBanner() {
  return (
    <section
      className="relative py-24 px-4 bg-bg overflow-hidden"
      aria-label="Company overview"
    >
      <VideoBackground videoKey={HERO_BANNER_VIDEO} overlay="darken" />

      <div
        className="relative mx-auto"
        style={{ maxWidth: "var(--container-lg)" }}
      >
        <GlassCard className="p-8 md:p-12 lg:p-16">
          {/* Section label */}
          <p className="font-sans-body text-secondary tracking-[0.18em] uppercase mb-6 text-xs">
            About AEI
          </p>

          {/* Headline */}
          <h2 className="font-sans-header font-bold text-fg text-hero">
            High Impact Energy Projects.
          </h2>

          {/* Subheadline */}
          <p className="mt-6 text-fg-secondary font-sans-body max-w-2xl text-body-lg">
            PT Agra Energi Indonesia — privately held, providing security and reliability to Indonesia&apos;s grid.
          </p>

          {/* CTA — native anchor with CSS smooth scroll */}
          <div className="mt-10">
            <a
              href="#exploration-map"
              className="inline-flex items-center gap-2 px-8 py-4 font-sans-body font-medium text-fg-inverse bg-primary hover:bg-primary-hover hover:-translate-y-0.5 transition-all rounded-[var(--radius-button)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary text-body-lg"
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
