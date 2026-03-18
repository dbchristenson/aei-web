import type { Metadata } from "next";
import Link from "next/link";
import { POLICY_CARDS, type PolicyCard } from "@/data/governance";

export const metadata: Metadata = {
  title: "Governance",
  robots: { index: false, follow: false },
};

const CARD_HEIGHT = "240px";
const ANIM_DELAY_STEP = 120;

/* Cards in reading order: top-left, top-right, bottom-left, bottom-right */
const cards: Array<{ policy: PolicyCard; order: number; index: number }> = [
  { policy: POLICY_CARDS[0], order: 0, index: 1 },
  { policy: POLICY_CARDS[1], order: 1, index: 2 },
  { policy: POLICY_CARDS[2], order: 2, index: 3 },
  { policy: POLICY_CARDS[3], order: 3, index: 4 },
];

function GovernanceCard({
  policy,
  order,
  index,
  className = "",
}: {
  policy: PolicyCard;
  order: number;
  index: number;
  className?: string;
}) {
  return (
    <Link
      href={`/governance/${policy.slug}`}
      className={`governance-card group flex flex-col justify-between border border-border bg-surface p-8 ${className}`}
      style={{
        minHeight: CARD_HEIGHT,
        animationDelay: `${order * ANIM_DELAY_STEP}ms`,
      }}
    >
      <div>
        <span className="text-xs font-sans-body font-medium text-fg-muted tracking-widest uppercase">
          {String(index).padStart(2, "0")}
        </span>
        <h2 className="mt-3 font-sans-header font-semibold text-fg text-h3 group-hover:text-primary transition-colors">
          {policy.title}
        </h2>
        <p className="mt-2 text-fg-muted font-sans-body text-small">
          {policy.description}
        </p>
      </div>
      <svg
        className="self-end text-fg-muted group-hover:text-primary group-hover:translate-x-1 transition-all"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M5 12h14M13 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

export default function GovernancePage() {
  return (
    <main className="pt-20">
      <section className="py-24 px-4">
        <div className="mx-auto" style={{ maxWidth: "var(--container-lg)" }}>
          <h1 className="font-serif font-bold text-fg text-hero">
            Governance
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 mt-6">
            {cards.map(({ policy, order, index }) => (
              <GovernanceCard
                key={policy.slug}
                policy={policy}
                order={order}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes governance-fall-in {
          from {
            opacity: 0;
            transform: translateY(-24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .governance-card {
          opacity: 0;
          animation: governance-fall-in 0.5s ease-out both;
          border-top: 2px solid transparent;
          transition: background-color 200ms, border-color 200ms;
        }

        @media (min-width: 768px) {
          .governance-card:nth-child(even) {
            margin-left: -1px;
          }
        }

        .governance-card:hover {
          background-color: var(--color-surface-hover);
          border-top-color: var(--color-primary);
          z-index: 1;
        }

        @media (prefers-reduced-motion: reduce) {
          .governance-card {
            opacity: 1;
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
