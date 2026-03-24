"use client";

import dynamic from "next/dynamic";

const ExplorationMap = dynamic(
  () => import("@/components/map/ExplorationMap"),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex items-center justify-center"
        style={{ minHeight: "600px" }}
      >
        <p className="text-fg-muted font-body animate-pulse text-small">
          Loading exploration data&hellip;
        </p>
      </div>
    ),
  }
);

interface ExplorationMapLoaderProps {
  blocksEndpoint?: string;
}

export default function ExplorationMapLoader({
  blocksEndpoint,
}: ExplorationMapLoaderProps) {
  return <ExplorationMap blocksEndpoint={blocksEndpoint} />;
}
