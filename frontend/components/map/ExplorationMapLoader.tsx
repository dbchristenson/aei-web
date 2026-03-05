"use client";

import dynamic from "next/dynamic";

const ExplorationMap = dynamic(
  () => import("@/components/map/ExplorationMap"),
  { ssr: false }
);

interface ExplorationMapLoaderProps {
  blocksEndpoint?: string;
}

export default function ExplorationMapLoader({
  blocksEndpoint,
}: ExplorationMapLoaderProps) {
  return <ExplorationMap blocksEndpoint={blocksEndpoint} />;
}
