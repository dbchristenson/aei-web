import type { Metadata } from "next";
import StatCounter from "@/components/ui/StatCounter";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Market research, energy trends, and analysis from PT Agra Energi Indonesia.",
};

export default function InsightsPage() {
  return (
    <main className="pt-20">
      {/* Stat strip */}
      <section className="py-16 px-4 bg-neutral-950 border-b border-neutral-800">
        <div
          className="mx-auto grid grid-cols-2 md:grid-cols-4 gap-8"
          style={{ maxWidth: "var(--container-xl)" }}
        >
          <StatCounter value={270} suffix="B" prefix="$" label="Indonesian O&G market value" />
          <StatCounter value={23} suffix="GW" label="Geothermal potential" />
          <StatCounter value={8} suffix="+" label="Active exploration blocks" />
          <StatCounter value={2015} label="Year established" />
        </div>
      </section>

      {/* Article grid */}
      <section className="py-24 px-4 bg-neutral-900">
        <div className="mx-auto" style={{ maxWidth: "var(--container-xl)" }}>
          <h1
            className="font-sans-header font-bold text-neutral-50 mb-16"
            style={{ fontSize: "var(--text-h1)", lineHeight: 1.2 }}
          >
            Insights
          </h1>

          {/* TODO: Replace with InsightCard grid populated from MDX frontmatter */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-card-dark p-8 text-center">
              <p className="text-neutral-400 font-sans-body">
                Articles coming soon. Check back for market research and energy
                trend analysis.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
