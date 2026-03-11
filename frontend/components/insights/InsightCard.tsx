import Link from "next/link";

type InsightCategory = "O&G" | "Geothermal" | "Policy" | "Market";

interface InsightCardProps {
  title: string;
  excerpt: string;
  coverImage?: string;
  category: InsightCategory;
  date: string;
  slug: string;
}

const categoryStyles: Record<InsightCategory, { bg: string; text: string }> = {
  "O&G": { bg: "bg-palette-teal-blue/15", text: "text-palette-teal-blue" },
  Geothermal: { bg: "bg-palette-coral-glow/15", text: "text-palette-coral-glow" },
  Policy: { bg: "bg-palette-sky-reflection/15", text: "text-palette-sky-reflection" },
  Market: { bg: "bg-palette-bright-amber/15", text: "text-palette-bright-amber" },
};

export default function InsightCard({
  title,
  excerpt,
  coverImage,
  category,
  date,
  slug,
}: InsightCardProps) {
  const categoryStyle = categoryStyles[category];

  return (
    <Link
      href={`/insights/${slug}`}
      className="group block glass-card-dark overflow-hidden transition-transform hover:-translate-y-1"
    >
      {/* Cover image */}
      <div
        className="w-full bg-surface"
        style={{ aspectRatio: "16/9" }}
      >
        {coverImage ? (
          // TODO: Replace with Next.js <Image> component
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface to-bg-subtle" />
        )}
      </div>

      <div className="p-6">
        {/* Category tag */}
        <span
          className={`inline-block px-3 py-1 rounded-[var(--radius-pill)] font-sans-body font-medium text-xs ${categoryStyle.bg} ${categoryStyle.text}`}
        >
          {category}
        </span>

        <h3 className="mt-3 font-sans-header font-semibold text-fg group-hover:text-primary transition-colors text-h4">
          {title}
        </h3>

        <p className="mt-2 text-fg-muted font-sans-body line-clamp-2 text-small">
          {excerpt}
        </p>

        <time
          className="mt-4 block text-fg-muted font-sans-body text-xs"
          dateTime={date}
        >
          {date}
        </time>
      </div>
    </Link>
  );
}
