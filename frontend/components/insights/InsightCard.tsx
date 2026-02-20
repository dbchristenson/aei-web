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
  "O&G": { bg: "bg-teal-blue/15", text: "text-teal-blue" },
  Geothermal: { bg: "bg-coral-glow/15", text: "text-coral-glow" },
  Policy: { bg: "bg-sky-reflection/15", text: "text-sky-reflection" },
  Market: { bg: "bg-bright-amber/15", text: "text-bright-amber" },
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
        className="w-full bg-neutral-800"
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
          <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900" />
        )}
      </div>

      <div className="p-6">
        {/* Category tag */}
        <span
          className={`inline-block px-3 py-1 rounded-[var(--radius-pill)] font-sans-body font-medium ${categoryStyle.bg} ${categoryStyle.text}`}
          style={{ fontSize: "var(--text-xs)" }}
        >
          {category}
        </span>

        <h3
          className="mt-3 font-sans-header font-semibold text-neutral-50 group-hover:text-teal-blue transition-colors"
          style={{ fontSize: "var(--text-h4)", lineHeight: 1.4 }}
        >
          {title}
        </h3>

        <p
          className="mt-2 text-neutral-400 font-sans-body line-clamp-2"
          style={{ fontSize: "var(--text-small)" }}
        >
          {excerpt}
        </p>

        <time
          className="mt-4 block text-neutral-600 font-sans-body"
          style={{ fontSize: "var(--text-xs)" }}
          dateTime={date}
        >
          {date}
        </time>
      </div>
    </Link>
  );
}
