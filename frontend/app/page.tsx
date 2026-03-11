import HeroSplash from "@/components/sections/HeroSplash";
import HeroBanner from "@/components/sections/HeroBanner";
import SectionDivider from "@/components/ui/SectionDivider";
import TeamCarousel from "@/components/sections/TeamCarousel";

// Heavy components — lazy-loaded client-side only
import ExplorationMapLoader from "@/components/map/ExplorationMapLoader";

const teamMembers = [
  {
    name: "Gary Christenson",
    title: "CEO",
    bio: "Gary is a seasoned Indonesian O&G explorationist who has held leadership roles at Chevron, Unocal, Niko, and Black Gold Energy.",
    photo: "/images/headshots/blank_headshot.png",
  },
  {
    name: "Sujud Sunawan",
    title: "CTO",
    bio: "Sujud is an IT savant that manages AEI\u2019s immense intelligence data sets.",
    photo: "/images/headshots/blank_headshot.png",
  },
  {
    name: "Yusak",
    title: "Senior Project Developer",
    bio: "Yusak\u2019s primary ideal is to enjoy the moment\u2014especially when it involves drilling for gas.",
    photo: "/images/headshots/blank_headshot.png",
  },
  {
    name: "Agung",
    title: "Senior Project Developer",
    bio: "Agung is a very personable individual who has extensive offshore operations experience in drilling and well development.",
    photo: "/images/headshots/blank_headshot.png",
  },
  {
    name: "DB Christenson",
    title: "Development Intern",
    bio: "DB received his MS in Energy from Northwestern University and is eager to hone his energy project development skills.",
    photo: "/images/headshots/blank_headshot.png",
  },
];

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
          toColor="var(--color-neutral-900)"
        />
      </div>
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
      <TeamCarousel members={teamMembers} />

      {/* Section 5 — Interactive Exploration Map */}
      <SectionDivider
        fromColor="var(--color-neutral-950)"
        toColor="var(--color-neutral-950)"
      />
      <section
        id="exploration-map"
        className="bg-neutral-950 overflow-hidden"
        aria-label="Exploration blocks map"
      >
        <ExplorationMapLoader blocksEndpoint="/data/blocks.geojson" />
      </section>

      {/* Section 6 — Footer (in layout) */}
    </main>
  );
}
