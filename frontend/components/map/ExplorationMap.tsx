"use client";

import { useRef } from "react";
// TODO: Import d3 and implement orthographic projection map
// import * as d3 from "d3";

interface ExplorationMapProps {
  blocksEndpoint?: string;
}

// TODO: Change to "loading" once fetch logic is implemented
type MapState = "loading" | "error" | "empty" | "active";
const _state: MapState = "empty";

export default function ExplorationMap({
  blocksEndpoint = "/api/blocks",
}: ExplorationMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const state = _state;

  // TODO: useEffect to fetch GeoJSON from blocksEndpoint when map section enters viewport
  // TODO: Render D3 orthographic projection of Southeast Asia
  // TODO: Add block polygons with hover/click interaction
  // TODO: Keyboard navigation (Tab through blocks, Enter to select)
  void blocksEndpoint;

  return (
    <div className="relative w-full bg-neutral-950 rounded-[var(--radius-card)] overflow-hidden" style={{ minHeight: "500px" }}>
      {state === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-neutral-400 font-sans-body animate-pulse">
            Loading exploration data&hellip;
          </p>
        </div>
      )}

      {state === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <p className="text-neutral-400 font-sans-body">
            Unable to load map data. Please try again later.
          </p>
        </div>
      )}

      {state === "empty" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-neutral-400 font-sans-body">
            Exploration block data coming soon.
          </p>
        </div>
      )}

      <svg
        ref={svgRef}
        className="w-full h-full"
        role="img"
        aria-label="Interactive exploration map of Indonesian oil and gas blocks"
      />
    </div>
  );
}
