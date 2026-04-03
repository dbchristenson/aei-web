import HeroSplash from "@/components/sections/HeroSplash";
import HeroBanner from "@/components/sections/HeroBanner";
import PartnerLogoGrid from "@/components/sections/PartnerLogoGrid";
import TeamCarousel from "@/components/sections/TeamCarousel";

// Heavy components — lazy-loaded client-side only
import ExplorationMapLoader from "@/components/map/ExplorationMapLoader";

// Toggle to false to hide the Board of Directors section (e.g. pending legal clearance)
const SHOW_BOARD_OF_DIRECTORS = false;

const teamMembers = [
  {
    name: "GN Christenson",
    title: "Chief Executive",
    bio: "Gary is a seasoned O&G explorationist who has held leadership roles in the Indonesian exploration divisions at Unocal and Niko. Gary was also founder and chief executive of Black Gold Energy until its sale in 2010.",
    photo: "/images/headshots/gary_christenson.webp",
  },
  {
    name: "Amjad Bseisu",
    title: "Non-Executive Director",
    bio: "Amjad is an internationally recognized member of the energy community acting as the chairman of the independent energy community for the World Economic Forum since 2016 as well as the founder of Petrofac and EnQuest.",
    photo: "/images/headshots/amjad_bseisu.webp",
  },
  {
    name: "Ravi Shankar",
    title: "Non-Executive Director",
    bio: "Ravi established SP Oil & Gas across Southeast Asia, building a US$1.5B asset base. He brings deep experience in finance, shipping, and offshore operations from roles at Wilh. Wilhelmsen and Barber Ship Management.",
    photo: "/images/headshots/ravi_shankar.webp",
  },
  {
    name: "DB Christenson",
    title: "Development Intern",
    bio: "DB received his MS in Energy from Northwestern University and is eager to hone his energy project development skills.",
    photo: "/images/headshots/db_christenson.webp",
  },
];

export default function Home() {
  return (
    <main>
      {/* Section 1 — Hero / Splash Screen */}
      <HeroSplash />

      {/* Section 2 — Hero Banner (gradient fades into partners) */}
      <HeroBanner />

      {/* Sections 3–5 — slide up over the pinned HeroBanner */}
      <div
        className="relative bg-bg-subtle overflow-hidden"
        style={{
          zIndex: 1,
          borderTopLeftRadius: "var(--radius-card)",
          borderTopRightRadius: "var(--radius-card)",
          boxShadow: "0 -16px 60px rgba(0, 0, 0, 0.35)",
        }}
      >
        {/* Section 3 — Partner Logos */}
        <PartnerLogoGrid />

        {/* Section 4 — Leadership Team (continuous with partners) */}
        {SHOW_BOARD_OF_DIRECTORS && <TeamCarousel members={teamMembers} />}

        {/* Section 5 — Interactive Exploration Map (app-like breakout) */}
        <div
          className="relative bg-primary overflow-hidden"
          style={{
            borderTopLeftRadius: "var(--radius-card)",
            borderTopRightRadius: "var(--radius-card)",
            boxShadow: "0 -12px 48px rgba(0, 0, 0, 0.3)",
          }}
        >
          <section
            id="exploration-map"
            className="bg-gradient-to-b from-bg to-primary overflow-hidden scroll-mt-20"
            aria-label="Exploration blocks map"
          >
            <ExplorationMapLoader blocksEndpoint="/data/blocks.geojson" />
          </section>
        </div>
      </div>

      {/* Section 6 — Footer (in layout) */}
    </main>
  );
}
