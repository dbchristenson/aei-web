import type { Metadata } from "next";
import GlassCard from "@/components/ui/GlassCard";
import PullQuote from "@/components/ui/PullQuote";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about PT Agra Energi Indonesia — our history, mission, and commitment to high-impact energy exploration.",
};

export default function AboutPage() {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="py-24 px-4 bg-neutral-950">
        <div className="mx-auto" style={{ maxWidth: "var(--container-lg)" }}>
          <h1
            className="font-sans-header font-bold text-neutral-50"
            style={{ fontSize: "var(--text-h1)", lineHeight: 1.2 }}
          >
            About AEI
          </h1>
          <p
            className="mt-6 text-neutral-200 font-sans-body max-w-2xl"
            style={{ fontSize: "var(--text-body-lg)", lineHeight: 1.6 }}
          >
            {/* TODO: Replace with actual company history from client */}
            PT Agra Energi Indonesia was established in 2015 with a focus on
            high-impact oil and gas exploration. We acquire exploration blocks
            from the Indonesian government, connect major operators and state
            enterprises, and invest alongside our partners.
          </p>
        </div>
      </section>

      {/* History / Mission */}
      <section className="py-24 px-4 bg-neutral-900">
        <div className="mx-auto" style={{ maxWidth: "var(--container-lg)" }}>
          <GlassCard variant="dark" className="p-8 md:p-12">
            <h2
              className="font-sans-header font-semibold text-neutral-50 mb-6"
              style={{ fontSize: "var(--text-h2)" }}
            >
              Our Mission
            </h2>
            <p
              className="text-neutral-200 font-sans-body"
              style={{ fontSize: "var(--text-body)", lineHeight: 1.6 }}
            >
              {/* TODO: Replace with actual mission statement */}
              We believe in the potential of Indonesia&apos;s energy resources.
              Our mission is to responsibly develop these resources while
              creating lasting value for our investors, partners, and the
              communities where we operate.
            </p>
          </GlassCard>

          <div className="mt-16">
            <PullQuote
              quote="The meek shall inherit the Earth, but not its mineral rights."
              attribution="J. Paul Getty"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
