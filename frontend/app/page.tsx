import HeroSplash from "@/components/sections/HeroSplash";
import HeroBanner from "@/components/sections/HeroBanner";
import SectionDivider from "@/components/ui/SectionDivider";

// Heavy components — lazy-loaded when their section enters the viewport
// import dynamic from "next/dynamic";
// const ExplorationMap = dynamic(() => import("@/components/map/ExplorationMap"), { ssr: false });

export default function Home() {
  return (
    <main>
      {/* Section 1 — Hero / Splash Screen */}
      <HeroSplash />

      {/* Section 2 — Hero Banner (no divider — continuous hero experience) */}
      <HeroBanner />

      {/* Section 3 — Partner Logos */}
      <SectionDivider
        fromColor="var(--color-neutral-950)"
        toColor="var(--color-neutral-900)"
      />
      <section className="py-24 px-4 bg-neutral-900" aria-label="Partners and stakeholders">
        <div
          className="mx-auto text-center"
          style={{ maxWidth: "var(--container-xl)" }}
        >
          <h2
            className="font-sans-header font-semibold text-neutral-50 mb-3"
            style={{ fontSize: "var(--text-h2)" }}
          >
            Our Partners &amp; Stakeholders
          </h2>
          <p
            className="text-neutral-400 font-sans-body mb-12"
            style={{ fontSize: "var(--text-body)" }}
          >
            Working alongside world-class operators and institutional partners.
          </p>
          {/* TODO: Replace with <PartnerLogoGrid logos={partnersData} /> */}
          <p className="text-neutral-600 font-sans-body italic" style={{ fontSize: "var(--text-small)" }}>
            Partner logos coming soon.
          </p>
        </div>
      </section>

      {/* Section 4 — Leadership Team */}
      <SectionDivider
        fromColor="var(--color-neutral-900)"
        toColor="var(--color-neutral-950)"
      />
      <section className="py-24 px-4 bg-neutral-950" aria-label="Leadership team">
        <div
          className="mx-auto text-center"
          style={{ maxWidth: "var(--container-xl)" }}
        >
          <h2
            className="font-sans-header font-semibold text-neutral-50 mb-3"
            style={{ fontSize: "var(--text-h2)" }}
          >
            Meet the Team
          </h2>
          <p
            className="text-neutral-400 font-sans-body mb-12"
            style={{ fontSize: "var(--text-body)" }}
          >
            Over 100 years of combined experience in Indonesian energy.
          </p>
          {/* TODO: Replace with <TeamCarousel members={teamData} /> */}
          <p className="text-neutral-600 font-sans-body italic" style={{ fontSize: "var(--text-small)" }}>
            Team profiles coming soon.
          </p>
        </div>
      </section>

      {/* Section 5 — Interactive Exploration Map */}
      <SectionDivider
        fromColor="var(--color-neutral-950)"
        toColor="var(--color-neutral-900)"
      />
      <section
        id="exploration-map"
        className="py-24 px-4 bg-neutral-900"
        aria-label="Exploration blocks map"
      >
        <div className="mx-auto" style={{ maxWidth: "var(--container-xl)" }}>
          <h2
            className="text-center font-sans-header font-semibold text-neutral-50 mb-3"
            style={{ fontSize: "var(--text-h2)" }}
          >
            Exploration Blocks
          </h2>
          <p
            className="text-center text-neutral-400 font-sans-body mb-12"
            style={{ fontSize: "var(--text-body)" }}
          >
            Active exploration across Southeast Asia.
          </p>
          <div
            className="bg-neutral-950 rounded-[var(--radius-card)] flex items-center justify-center"
            style={{ minHeight: "520px" }}
          >
            {/* TODO: Replace with <ExplorationMap blocksEndpoint="/api/blocks" /> */}
            <p className="text-neutral-600 font-sans-body italic" style={{ fontSize: "var(--text-small)" }}>
              Interactive map coming soon.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6 — Footer (in layout) */}
    </main>
  );
}
