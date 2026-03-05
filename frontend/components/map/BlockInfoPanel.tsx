export interface BlockProperties {
  id: string;
  name: string;
  basin: string;
  status: string;
  description: string;
}

interface BlockInfoPanelProps {
  block: BlockProperties | null;
  isLocked: boolean;
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status.toLowerCase().includes("active");
  return (
    <span className="inline-flex items-center gap-1.5 font-sans-body text-neutral-400" style={{ fontSize: "var(--text-xs)" }}>
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full ${isActive ? "bg-teal-blue" : "bg-bright-amber"}`}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}

export default function BlockInfoPanel({ block, isLocked }: BlockInfoPanelProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Section heading */}
      <div>
        <h2
          className="font-sans-header font-bold text-neutral-50 mb-2 uppercase tracking-wider"
          style={{ fontSize: "var(--text-h2)" }}
        >
          Exploration Blocks
        </h2>
        <p
          className="text-neutral-400 font-sans-body"
          style={{ fontSize: "var(--text-body)" }}
        >
          Active exploration across Indonesia.
        </p>
      </div>

      {/* Dynamic detail region */}
      <div
        aria-live="polite"
        className="glass-card-dark p-5 md:p-6 min-h-[140px] transition-opacity duration-300"
        style={{ opacity: block ? 1 : 0.6 }}
      >
        {block ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <h3
                className="font-sans-header font-semibold text-neutral-50"
                style={{ fontSize: "var(--text-h4)" }}
              >
                {block.name}
              </h3>
              <StatusBadge status={block.status} />
            </div>
            <p
              className="text-sky-reflection font-sans-body"
              style={{ fontSize: "var(--text-small)" }}
            >
              {block.basin}
            </p>
            <p
              className="text-neutral-200 font-sans-body leading-relaxed"
              style={{ fontSize: "var(--text-small)" }}
            >
              {block.description}
            </p>
            {isLocked && (
              <p
                className="text-neutral-400 font-sans-body italic mt-1"
                style={{ fontSize: "var(--text-xs)" }}
              >
                Click again or press Escape to deselect.
              </p>
            )}
          </div>
        ) : (
          <p
            className="text-neutral-400 font-sans-body italic"
            style={{ fontSize: "var(--text-small)" }}
          >
            Hover or click a point on the globe to explore.
          </p>
        )}
      </div>
    </div>
  );
}
