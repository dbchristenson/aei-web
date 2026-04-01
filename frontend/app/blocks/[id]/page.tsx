import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlockDetail, getAllBlockIds } from "@/data/blocks";
import type { NewsItem } from "@/data/blocks";
import type { Metadata } from "next";
import BlockDetailMapLoader from "@/components/map/BlockDetailMapLoader";

interface BlockPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getAllBlockIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: BlockPageProps): Promise<Metadata> {
  const { id } = await params;
  const block = getBlockDetail(id);
  if (!block) return { title: "Block Not Found" };
  return {
    title: `${block.name} Block`,
    description: block.summary.slice(0, 160),
  };
}

function NewsCard({ item }: { item: NewsItem }) {
  const content = (
    <div className="glass-card p-5 transition-all duration-200 hover:border-primary/30">
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`inline-block px-2 py-0.5 rounded-[var(--radius-button)] font-body text-xs ${
            item.type === "memo"
              ? "bg-secondary/12 border border-secondary/20"
              : "bg-accent/12 border border-accent/20"
          }`}
        >
          {item.type === "memo" ? "Internal Memo" : "External"}
        </span>
        <span className="text-fg-muted font-body text-xs">
          {item.date}
        </span>
      </div>
      <h3 className="font-sans font-medium text-fg-secondary text-body">
        {item.title}
      </h3>
      <p className="text-fg-muted font-body mt-1 text-small">
        {item.source}
      </p>
    </div>
  );

  if (item.href) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
}

export default async function BlockPage({ params }: BlockPageProps) {
  const { id } = await params;
  const block = getBlockDetail(id);
  if (!block) notFound();

  return (
    <main className="bg-bg min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Back link */}
        <Link
          href="/#exploration"
          className="inline-flex items-center gap-1.5 text-fg-muted hover:text-primary font-body transition-colors mb-8 text-small"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Exploration Blocks
        </Link>

        {/* Header + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Left: Block info */}
          <div className="flex flex-col justify-center">
            <p className="text-primary font-body uppercase tracking-wider mb-3 text-small">
              {block.basin}
            </p>
            <h1 className="font-sans font-bold text-fg mb-6 text-h1">
              {block.name}
            </h1>
            <p className="text-fg-secondary font-body text-body">
              {block.summary}
            </p>
          </div>

          {/* Right: Zoomed map */}
          <div className="aspect-square lg:aspect-auto lg:min-h-[480px] rounded-[var(--radius-card)] overflow-hidden border border-border-subtle/50">
            <BlockDetailMapLoader blockId={id} />
          </div>
        </div>

        {/* News Feed */}
        <section>
          <h2 className="font-sans font-bold text-fg mb-6 text-h2">
            News &amp; Updates
          </h2>

          {block.news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {block.news.map((item, i) => (
                <NewsCard key={i} item={item} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <p className="text-fg-muted font-body text-body">
                No news or updates for this block yet.
              </p>
              <p className="text-fg-muted font-body mt-2 text-small">
                Check back for internal memos and external publications.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
