import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPolicy, getAllPolicySlugs } from "@/data/governance";

interface GovernancePolicyPageProps {
  params: Promise<{ policy: string }>;
}

export function generateStaticParams() {
  return getAllPolicySlugs().map((policy) => ({ policy }));
}

export async function generateMetadata({
  params,
}: GovernancePolicyPageProps): Promise<Metadata> {
  const { policy: slug } = await params;
  const policy = getPolicy(slug);

  return {
    title: policy?.title ?? "Governance",
    robots: { index: false, follow: false },
  };
}

export default async function GovernancePolicyPage({
  params,
}: GovernancePolicyPageProps) {
  const { policy: slug } = await params;
  const policy = getPolicy(slug);

  if (!policy) {
    notFound();
  }

  return (
    <main className="pt-20">
      <article className="py-24 px-4">
        <div className="mx-auto" style={{ maxWidth: "var(--container-sm)" }}>
          <Link
            href="/governance"
            className="inline-flex items-center gap-1.5 text-fg-muted hover:text-primary font-body transition-colors mb-8 text-small"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 12L6 8l4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Governance
          </Link>

          <h1 className="font-sans font-bold text-fg mb-8 text-h1">
            {policy.title}
          </h1>

          <div className="font-body text-fg-secondary space-y-0">
            {policy.preamble && (
              <p className="text-body mb-8">{policy.preamble}</p>
            )}

            {policy.sections.map((section, i) => (
              <section key={i} className="mb-10">
                <h2 className="font-sans font-semibold text-fg text-h3 mb-4">
                  {section.heading}
                </h2>
                {section.content.map((block, j) => {
                  switch (block.type) {
                    case "paragraph":
                      return (
                        <p key={j} className="text-body mb-4">
                          {block.text}
                        </p>
                      );
                    case "bullets":
                      return (
                        <ul
                          key={j}
                          className="list-disc list-outside ml-6 mb-4 space-y-2"
                        >
                          {block.items?.map((item, k) => (
                            <li key={k} className="text-body">
                              {item}
                            </li>
                          ))}
                        </ul>
                      );
                    case "numbered":
                      return (
                        <ol
                          key={j}
                          className="list-decimal list-outside ml-6 mb-4 space-y-2"
                        >
                          {block.items?.map((item, k) => (
                            <li key={k} className="text-body">
                              {item}
                            </li>
                          ))}
                        </ol>
                      );
                  }
                })}
              </section>
            ))}
          </div>

          <p className="text-fg-muted font-body text-small mt-12 pt-6 border-t border-border-subtle">
            Revision: {policy.revision}
          </p>
        </div>
      </article>
    </main>
  );
}
