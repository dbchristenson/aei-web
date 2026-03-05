import type { Metadata } from "next";

interface GovernancePolicyPageProps {
  params: Promise<{ policy: string }>;
}

const policyTitles: Record<string, string> = {
  "anti-corruption": "Anti-Corruption Policy",
  "code-of-conduct": "Code of Conduct",
  communications: "Communications Policy",
  "drugs-alcohol": "Drugs & Alcohol Policy",
};

export async function generateMetadata({
  params,
}: GovernancePolicyPageProps): Promise<Metadata> {
  const { policy } = await params;
  const title = policyTitles[policy] ?? "Governance";

  return {
    title,
    robots: { index: false, follow: false },
  };
}

export default async function GovernancePolicyPage({
  params,
}: GovernancePolicyPageProps) {
  const { policy } = await params;
  const title = policyTitles[policy] ?? "Governance Policy";

  return (
    <main className="pt-20">
      <article className="py-24 px-4">
        <div className="mx-auto" style={{ maxWidth: "var(--container-sm)" }}>
          <h1
            className="font-sans-header font-bold text-neutral-50 mb-8"
            style={{ fontSize: "var(--text-h1)", lineHeight: 1.2 }}
          >
            {title}
          </h1>

          <div className="font-sans-body text-neutral-200 space-y-4" style={{ fontSize: "var(--text-body)", lineHeight: 1.6 }}>
            {/* TODO: Replace with actual policy content from client */}
            <p>
              This governance policy document is pending content from the
              client. It will contain the full text of the {title.toLowerCase()}{" "}
              as required for Indonesian business compliance.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
