import HeroSplash from "@/components/sections/HeroSplash";
import HeroBanner from "@/components/sections/HeroBanner";
import PartnerLogoGrid from "@/components/sections/PartnerLogoGrid";
import SectionDivider from "@/components/ui/SectionDivider";
import TeamCarousel from "@/components/sections/TeamCarousel";

// Heavy components — lazy-loaded client-side only
import ExplorationMapLoader from "@/components/map/ExplorationMapLoader";

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

      {/* Section 3 — Partner Logos (seamless continuation from banner gradient) */}
      <PartnerLogoGrid />

      {/* Section 4 — Leadership Team */}
      <SectionDivider
        fromColor="var(--color-bg-subtle)"
        toColor="var(--color-bg)"
      />
      <TeamCarousel members={teamMembers} />

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
