"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { select } from "d3-selection";
import "d3-transition";
import gsap from "gsap";
import BlockInfoPanel from "./BlockInfoPanel";
import type { Topology } from "topojson-specification";
import type { BlockFeature, BlocksGeoJSON, MapState, UIState, DragBounds } from "./globe/types";
import { INITIAL_ROTATION, LAMBDA_BOUNDS, PHI_BOUNDS, RUBBER_BAND_DIM } from "./globe/constants";
import useGlobeRenderer from "./globe/useGlobeRenderer";
import useBlockZoom from "./globe/useBlockZoom";
import { getThemeColors } from "@/lib/theme-utils";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

interface ExplorationMapProps {
  blocksEndpoint?: string;
}

export default function ExplorationMap({
  blocksEndpoint = "/data/blocks.geojson",
}: ExplorationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef<[number, number, number]>(INITIAL_ROTATION);
  const rawRotationRef = useRef<[number, number]>([INITIAL_ROTATION[0], INITIAL_ROTATION[1]]);
  const tooltipBlockRef = useRef<BlockFeature | null>(null);
  const bounceAnimRef = useRef<gsap.core.Tween | null>(null);
  const zoomAnimRef = useRef<gsap.core.Tween | null>(null);
  const scaleMultiplierRef = useRef<number>(1.0);
  const dragBoundsRef = useRef<DragBounds>({
    lambda: LAMBDA_BOUNDS,
    phi: PHI_BOUNDS,
    rubberBandDim: RUBBER_BAND_DIM,
  });

  const [mapState, setMapState] = useState<MapState>("loading");
  const [uiState, setUiState] = useState<UIState>({ blockId: null, mode: "idle" });
  const uiStateRef = useRef<UIState>(uiState);
  useEffect(() => {
    uiStateRef.current = uiState;
  }, [uiState]);
  const [geoData, setGeoData] = useState<BlocksGeoJSON | null>(null);
  const [worldData, setWorldData] = useState<Topology | null>(null);

  const prefersReducedMotion = usePrefersReducedMotion();

  const allBlocks = useMemo(
    () => geoData?.features.map((f) => f.properties) ?? [],
    [geoData]
  );

  // ─── Data fetching via IntersectionObserver ───
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();

          // Load blocks + land (essential for map render).
          Promise.all([
            fetch(blocksEndpoint).then((r) => {
              if (!r.ok) throw new Error(`Blocks fetch failed: ${r.status}`);
              return r.json() as Promise<BlocksGeoJSON>;
            }),
            fetch("/data/indonesia-10m.json").then((r) => {
              if (!r.ok) throw new Error(`Land fetch failed: ${r.status}`);
              return r.json() as Promise<Topology>;
            }),
          ])
            .then(([blocks, world]) => {
              if (cancelled) return;
              if (!blocks.features.length) {
                setMapState("empty");
                return;
              }
              setGeoData(blocks);
              setWorldData(world);
              setMapState("active");
            })
            .catch(() => {
              if (!cancelled) setMapState("error");
            });

        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(container);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [blocksEndpoint]);

  // ─── Block interaction handlers ───
  const handleBlockHover = useCallback(
    (blockId: string | null) => {
      if (uiState.mode === "selected") return;
      setUiState(
        blockId ? { blockId, mode: "hovered" } : { blockId: null, mode: "idle" }
      );
    },
    [uiState.mode]
  );

  const handleBlockClick = useCallback(
    (blockId: string) => {
      setUiState((prev) => {
        if (prev.blockId === blockId && prev.mode === "selected") {
          return { blockId: null, mode: "idle" };
        }
        return { blockId, mode: "selected" };
      });
    },
    []
  );

  const handleDeselect = useCallback(() => {
    setUiState({ blockId: null, mode: "idle" });
    tooltipBlockRef.current = null;
    if (tooltipRef.current) {
      tooltipRef.current.style.opacity = "0";
    }
  }, []);

  // ─── D3 globe rendering + drag behavior ───
  const { renderRef, showTooltipRef, hideTooltipRef } = useGlobeRenderer({
    svgRef, canvasRef, containerRef, tooltipRef,
    geoData, worldData, mapState,
    rotationRef, rawRotationRef, scaleMultiplierRef, dragBoundsRef,
    tooltipBlockRef, bounceAnimRef, zoomAnimRef,
    uiStateRef,
    handleBlockHover, handleBlockClick, handleDeselect,
    prefersReducedMotion,
  });

  // ─── Zoom on select / deselect ───
  useBlockZoom({
    uiState, geoData, mapState,
    containerRef,
    rotationRef, rawRotationRef, scaleMultiplierRef, dragBoundsRef,
    bounceAnimRef, zoomAnimRef, renderRef,
    prefersReducedMotion,
  });

  // ─── Sync selected dot visual state + tooltip ───
  useEffect(() => {
    if (!svgRef.current || mapState !== "active" || !geoData) return;
    const svg = select(svgRef.current);
    const tc = getThemeColors();
    const dur = prefersReducedMotion ? 0 : 200;

    if (uiState.mode === "selected" && uiState.blockId) {
      const feature = geoData.features.find((f) => f.id === uiState.blockId);
      if (feature) {
        showTooltipRef.current?.(feature);
      }
    } else if (uiState.mode === "idle") {
      hideTooltipRef.current?.();
    }

    geoData.features.forEach((feature) => {
      const isActive = feature.id === uiState.blockId;
      const isSelected = isActive && uiState.mode === "selected";

      svg.selectAll<SVGPathElement, BlockFeature>(".block-area")
        .filter((d) => d.id === feature.id)
        .transition().duration(dur)
        .attr("fill-opacity", isSelected ? 0.25 : isActive ? 0.2 : 0.08)
        .attr("stroke", isSelected ? tc.tealBlue : tc.amber)
        .attr("stroke-opacity", isSelected ? 0.9 : isActive ? 0.7 : 0.3)
        .attr("stroke-width", isSelected ? 2 : isActive ? 1.5 : 0.8)
        .attr("filter", isSelected ? "url(#block-glow)" : "none");

      svg.select(`.dot-${feature.id}`)
        .transition().duration(dur)
        .attr("r", isSelected ? 10 : isActive ? 8 : 6)
        .attr("fill", isSelected ? tc.coralGlow : tc.amber)
        .attr("fill-opacity", isActive ? 1 : 0.85);

      svg.select(`.dot-glow-${feature.id}`)
        .transition().duration(dur)
        .attr("r", isSelected ? 22 : isActive ? 16 : 12)
        .attr("fill-opacity", isSelected ? 0.35 : isActive ? 0.25 : 0.15);
    });
  }, [uiState, mapState, geoData, prefersReducedMotion, showTooltipRef, hideTooltipRef]);

  // ─── Keyboard escape ───
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && uiState.mode === "selected") {
        handleDeselect();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [uiState.mode, handleDeselect]);

  return (
    <div className="relative overflow-hidden" style={{ minHeight: "600px" }}>
      {/* Content overlay — left side, pointer-events pass through to globe */}
      <div className="relative z-10 flex items-start py-4 md:py-6 px-4 md:px-8 pointer-events-none" style={{ minHeight: "600px" }}>
        <div className="w-full md:max-w-[420px] pointer-events-auto">
          <BlockInfoPanel
            blocks={allBlocks}
            selectedBlockId={uiState.blockId}
            isLocked={uiState.mode === "selected"}
            onBlockClick={handleBlockClick}
          />
        </div>
      </div>

      {/* Globe container — fills entire section, behind content */}
      <div
        ref={containerRef}
        className="absolute inset-0"
      >
        {mapState === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-full h-full opacity-15"
              viewBox="0 0 800 600"
              aria-hidden="true"
            >
              <g className="animate-grid-pulse">
                {Array.from({ length: 14 }, (_, i) => (
                  <line key={`h-${i}`} x1={0} x2={800} y1={i * 45} y2={i * 45} stroke="var(--color-border)" strokeWidth={0.5} />
                ))}
                {Array.from({ length: 18 }, (_, i) => (
                  <line key={`v-${i}`} x1={i * 50} x2={i * 50} y1={0} y2={600} stroke="var(--color-border)" strokeWidth={0.5} />
                ))}
              </g>
            </svg>
            <p className="absolute text-fg-muted font-body animate-pulse text-small">
              Loading exploration data&hellip;
            </p>
          </div>
        )}

        {mapState === "error" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-fg-muted font-body text-body">
              Unable to load map data. Please try again later.
            </p>
          </div>
        )}

        {mapState === "empty" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-fg-muted font-body text-body">
              Exploration block data coming soon.
            </p>
          </div>
        )}

        {/* Canvas: non-interactive background layers (globe, land) */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 ${mapState !== "active" ? "hidden" : ""}`}
          aria-hidden="true"
        />

        {/* SVG: interactive layers (block polygons, dots, glow filters) */}
        <svg
          ref={svgRef}
          className={`absolute inset-0 ${mapState !== "active" ? "hidden" : ""}`}
          style={{ background: "transparent" }}
          role="img"
          aria-label="Interactive orthographic globe map showing AEI exploration blocks in Indonesia"
        />

        {/* Hover tooltip */}
        <div
          ref={tooltipRef}
          className="absolute pointer-events-none z-20 px-3 py-1.5 rounded-[var(--radius-button)] font-body text-fg whitespace-nowrap transition-opacity duration-150 text-small"
          style={{
            opacity: 0,
            background: "color-mix(in srgb, var(--color-bg-subtle) 85%, transparent)",
            backdropFilter: "blur(8px)",
            border: "1px solid var(--glass-border)",
          }}
          aria-hidden="true"
        />

        {/* Keyboard-accessible buttons */}
        <div
          className={`absolute inset-0 pointer-events-none ${mapState !== "active" ? "hidden" : ""}`}
          aria-label="Block selection controls"
        >
          {mapState === "active" && geoData?.features
            .slice()
            .sort((a, b) => a.properties.name.localeCompare(b.properties.name))
            .map((feature) => (
              <button
                key={feature.id}
                aria-label={`${feature.properties.name} — ${feature.properties.basin}`}
                aria-pressed={uiState.blockId === feature.id && uiState.mode === "selected"}
                className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 pointer-events-auto focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-primary/20"
                style={{
                  left: "-999px",
                  top: "-999px",
                }}
                data-block-id={feature.id}
                onFocus={() => handleBlockHover(feature.id)}
                onBlur={() => handleBlockHover(null)}
                onClick={() => handleBlockClick(feature.id)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    handleDeselect();
                    (e.target as HTMLButtonElement).blur();
                  }
                }}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
