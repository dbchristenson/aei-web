import HeroSplash from "@/components/sections/HeroSplash";
import HeroBanner from "@/components/sections/HeroBanner";
import SectionDivider from "@/components/ui/SectionDivider";

// Heavy components — lazy-loaded client-side only
import ExplorationMapLoader from "@/components/map/ExplorationMapLoader";

export default function Home() {
  return (
    <main>
      {/* Section 1 — Hero / Splash Screen */}
      <HeroSplash />

      {/* Section 2 — Hero Banner (no divider — continuous hero experience) */}
      <HeroBanner />

      {/* Section 3 — Partner Logos */}
      <div className="relative -mt-[6vw] z-10">
        <SectionDivider
          fromColor="transparent"
          toColor="var(--color-bg-subtle)"
        />
      </div>
      <section className="py-24 px-4 bg-bg-subtle" aria-label="Partners and stakeholders">
        <div
          className="mx-auto text-center"
          style={{ maxWidth: "var(--container-xl)" }}
        >
          <h2
            className="font-sans-header font-semibold text-fg mb-3"
            style={{ fontSize: "var(--text-h2)" }}
          >
            Our Partners &amp; Stakeholders
          </h2>
          <p
            className="text-fg-muted font-sans-body mb-12"
            style={{ fontSize: "var(--text-body)" }}
          >
            Working alongside world-class operators and institutional partners.
          </p>
          {/* TODO: Replace with <PartnerLogoGrid logos={partnersData} /> */}
          <p className="text-fg-muted font-sans-body italic" style={{ fontSize: "var(--text-small)" }}>
            Partner logos coming soon.
          </p>
        </div>
      </section>

      {/* Section 4 — Leadership Team */}
      <SectionDivider
        fromColor="var(--color-bg-subtle)"
        toColor="var(--color-bg)"
      />
      <section className="py-24 px-4 bg-bg" aria-label="Leadership team">
        <div
          className="mx-auto text-center"
          style={{ maxWidth: "var(--container-xl)" }}
        >
          <h2
            className="font-sans-header font-semibold text-fg mb-3"
            style={{ fontSize: "var(--text-h2)" }}
          >
            Meet the Team
          </h2>
          <p
            className="text-fg-muted font-sans-body mb-12"
            style={{ fontSize: "var(--text-body)" }}
          >
            Over 100 years of combined experience in Indonesian energy.
          </p>
          {/* TODO: Replace with <TeamCarousel members={teamData} /> */}
          <p className="text-fg-muted font-sans-body italic" style={{ fontSize: "var(--text-small)" }}>
            Team profiles coming soon.
          </p>
        </div>
      </section>

      {/* Section 5 — Interactive Exploration Map */}
      <SectionDivider
        fromColor="var(--color-bg)"
        toColor="var(--color-bg)"
      />
      <section
        id="exploration-map"
        className="bg-bg overflow-hidden"
        aria-label="Exploration blocks map"
      >
        <ExplorationMapLoader blocksEndpoint="/data/blocks.geojson" />
      </section>

      {/* Section 6 — Footer (in layout) */}
    </main>
  );
}
