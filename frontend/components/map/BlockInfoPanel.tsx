import { forwardRef, useEffect, useRef } from "react";
import Link from "next/link";

export interface BlockProperties {
  id: string;
  name: string;
  basin: string;
  status: string;
  description: string;
}

interface BlockInfoPanelProps {
  blocks: BlockProperties[];
  selectedBlockId: string | null;
  isLocked: boolean;
  onBlockClick: (blockId: string) => void;
}

const BlockCard = forwardRef<HTMLButtonElement, {
  block: BlockProperties;
  isSelected: boolean;
  onClick: () => void;
}>(function BlockCard({ block, isSelected, onClick }, ref) {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className="w-full text-left transition-all duration-200"
      aria-pressed={isSelected}
    >
      <div
        className="glass-card-dark p-5 py-6 transition-all duration-200"
        style={{
          borderColor: isSelected ? "var(--color-primary)" : undefined,
          borderWidth: isSelected ? "1px" : undefined,
          boxShadow: isSelected ? "0 0 16px color-mix(in srgb, var(--color-secondary) 15%, transparent)" : undefined,
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <h3
            className="font-sans-header font-semibold text-fg truncate"
            style={{ fontSize: "var(--text-h4)" }}
          >
            {block.name}
          </h3>
        </div>
        <p
          className="text-secondary font-sans-body mt-1.5"
          style={{ fontSize: "var(--text-small)" }}
        >
          {block.basin}
        </p>

        {/* Expanded detail when selected */}
        <div
          className="overflow-hidden transition-all duration-300"
          style={{
            maxHeight: isSelected ? "200px" : "0",
            opacity: isSelected ? 1 : 0,
            marginTop: isSelected ? "8px" : "0",
          }}
        >
          <p
            className="text-fg-secondary font-sans-body leading-relaxed"
            style={{ fontSize: "var(--text-small)" }}
          >
            {block.description}
          </p>
          <Link
            href={`/blocks/${block.id}`}
            className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-[var(--radius-button)] font-sans-body font-medium text-primary border border-primary hover:bg-primary/10 transition-all"
            style={{ fontSize: "var(--text-small)" }}
            onClick={(e) => e.stopPropagation()}
          >
            Learn More
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </button>
  );
});

export default function BlockInfoPanel({
  blocks,
  selectedBlockId,
  isLocked,
  onBlockClick,
}: BlockInfoPanelProps) {
  const sorted = [...blocks].sort((a, b) => a.name.localeCompare(b.name));
  const cardRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Auto-scroll to selected block after the card expand animation completes
  useEffect(() => {
    if (isLocked && selectedBlockId) {
      const timer = setTimeout(() => {
        const el = cardRefs.current.get(selectedBlockId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 320);
      return () => clearTimeout(timer);
    }
  }, [isLocked, selectedBlockId]);

  return (
    <div className="flex flex-col gap-6">
      {/* Section heading */}
      <div>
        <h2
          className="font-sans-header font-bold text-fg mb-2 uppercase tracking-wider"
          style={{ fontSize: "var(--text-h1)" }}
        >
          Exploration Blocks
        </h2>
        <p
          className="text-fg-muted font-sans-body"
          style={{ fontSize: "var(--text-body)" }}
        >
          Active exploration across Indonesia.
        </p>
      </div>

      {/* Block cards list */}
      <div
        className="relative"
        style={{
          maxHeight: "420px",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 4%, black 90%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 4%, black 90%, transparent 100%)",
        }}
      >
      <div
        className="flex flex-col gap-2 overflow-y-auto pr-1 pt-2 pb-6 custom-scrollbar"
        style={{ maxHeight: "420px" }}
      >
        {sorted.map((block) => (
          <BlockCard
            key={block.id}
            ref={(el) => {
              if (el) cardRefs.current.set(block.id, el);
              else cardRefs.current.delete(block.id);
            }}
            block={block}
            isSelected={isLocked && selectedBlockId === block.id}
            onClick={() => onBlockClick(block.id)}
          />
        ))}
      </div>
      </div>

      {/* Hint when nothing selected */}
      {!isLocked && (
        <p
          className="text-fg-muted font-sans-body italic"
          style={{ fontSize: "var(--text-small)" }}
        >
          Select a block to explore.
        </p>
      )}
    </div>
  );
}
