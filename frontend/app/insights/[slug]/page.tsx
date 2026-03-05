import type { Metadata } from "next";

// TODO: Implement MDX rendering with next-mdx-remote
// import { compileMDX } from "next-mdx-remote/rsc";
// import matter from "gray-matter";
// import fs from "fs";
// import path from "path";

interface InsightPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: InsightPageProps): Promise<Metadata> {
  const { slug } = await params;

  // TODO: Read MDX frontmatter for real metadata
  return {
    title: slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    description: `Read our analysis on ${slug.replace(/-/g, " ")}.`,
  };
}

export default async function InsightArticlePage({
  params,
}: InsightPageProps) {
  const { slug } = await params;

  // TODO: Load MDX from content/insights/{slug}.mdx
  // Parse frontmatter with gray-matter
  // Compile MDX with next-mdx-remote/rsc
  // Pass custom components (InsightChart, PullQuote, etc.)

  return (
    <main className="pt-20">
      <article className="py-24 px-4">
        <div className="mx-auto" style={{ maxWidth: "var(--container-md)" }}>
          <header className="mb-12">
            <h1
              className="font-sans-header font-bold text-neutral-50"
              style={{ fontSize: "var(--text-h1)", lineHeight: 1.2 }}
            >
              {slug
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ")}
            </h1>
            {/* TODO: Date, category tag, reading time */}
          </header>

          <div className="prose prose-invert max-w-none font-sans-body text-neutral-200">
            <p>
              Article content for &ldquo;{slug.replace(/-/g, " ")}&rdquo; will
              be rendered here from MDX.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
