"use client";

import dynamic from "next/dynamic";

const BlockDetailMap = dynamic(() => import("./BlockDetailMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <p
        className="text-neutral-400 font-sans-body animate-pulse"
        style={{ fontSize: "var(--text-small)" }}
      >
        Loading map&hellip;
      </p>
    </div>
  ),
});

export default function BlockDetailMapLoader({ blockId }: { blockId: string }) {
  return <BlockDetailMap blockId={blockId} />;
}
