"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import BlockInfoPanel from "./BlockInfoPanel";
import type { BlockProperties } from "./BlockInfoPanel";
import type { Topology, GeometryCollection } from "topojson-specification";

/** Read resolved CSS custom property values at runtime */
function getCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function getThemeColors() {
  return {
    tealBlue: getCssVar("--color-teal-blue"),
    amber: getCssVar("--color-bright-amber"),
    coralGlow: getCssVar("--color-coral-glow"),
    n950: getCssVar("--color-neutral-950"),
    n900: getCssVar("--color-neutral-900"),
    n800: getCssVar("--color-neutral-800"),
    n700: getCssVar("--color-neutral-700"),
    n600: getCssVar("--color-neutral-600"),
    n400: getCssVar("--color-neutral-400"),
  };
}

interface ExplorationMapProps {
  blocksEndpoint?: string;
}

type MapState = "loading" | "error" | "empty" | "active";
type InteractionMode = "idle" | "hovered" | "selected";

interface UIState {
  blockId: string | null;
  mode: InteractionMode;
}

interface BlockFeature extends GeoJSON.Feature<GeoJSON.MultiPolygon | GeoJSON.Polygon> {
  id: string;
  properties: BlockProperties;
}

interface BlocksGeoJSON {
  type: "FeatureCollection";
  features: BlockFeature[];
}

/** Compute the centroid of a GeoJSON feature in [lon, lat] */
function geoCentroid(feature: GeoJSON.Feature): [number, number] {
  return d3.geoCentroid(feature);
}

export default function ExplorationMap({
  blocksEndpoint = "/data/blocks.geojson",
}: ExplorationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef<[number, number, number]>([-117, 5, -15]);
  const autoRotateRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  const [mapState, setMapState] = useState<MapState>("loading");
  const [uiState, setUiState] = useState<UIState>({ blockId: null, mode: "idle" });
  const [geoData, setGeoData] = useState<BlocksGeoJSON | null>(null);
  const [worldData, setWorldData] = useState<Topology | null>(null);

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const activeBlock = geoData?.features.find((f) => f.id === uiState.blockId)?.properties ?? null;

  // ─── Data fetching via IntersectionObserver ───
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          Promise.all([
            fetch(blocksEndpoint).then((r) => {
              if (!r.ok) throw new Error(`Blocks fetch failed: ${r.status}`);
              return r.json() as Promise<BlocksGeoJSON>;
            }),
            fetch("/data/land-110m.json").then((r) => {
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
  }, []);

  // ─── D3 rendering — oversized draggable globe ───
  useEffect(() => {
    if (mapState !== "active" || !geoData || !worldData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    if (!container) return;

    const tc = getThemeColors();

    // Projection — oversized globe, centered to bleed off right edge
    const projection = d3
      .geoOrthographic()
      .clipAngle(90);

    function updateProjection() {
      const width = container!.clientWidth;
      const height = container!.clientHeight;

      // Globe is 120% of the container height — it bleeds off the edges
      const globeRadius = Math.max(height * 0.6, 280);

      projection
        .scale(globeRadius)
        .rotate(rotationRef.current)
        // Center the globe toward the right — 66% from left edge
        .translate([width * 0.66, height * 0.5]);

      return { width, height, globeRadius };
    }

    function render() {
      const { width, height, globeRadius } = updateProjection();
      const path = d3.geoPath(projection);

      svg.attr("viewBox", `0 0 ${width} ${height}`);
      svg.selectAll("*").remove();

      const defs = svg.append("defs");

      // Atmosphere glow — multi-stop radial gradient
      const [cx, cy] = projection.translate();
      const atmosGradient = defs
        .append("radialGradient")
        .attr("id", "atmos-glow")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", globeRadius + 40);
      atmosGradient.append("stop").attr("offset", "75%").attr("stop-color", tc.tealBlue).attr("stop-opacity", 0.06);
      atmosGradient.append("stop").attr("offset", "90%").attr("stop-color", tc.tealBlue).attr("stop-opacity", 0.12);
      atmosGradient.append("stop").attr("offset", "100%").attr("stop-color", tc.tealBlue).attr("stop-opacity", 0);

      // Dot glow filter
      const dotGlow = defs.append("filter").attr("id", "dot-glow").attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
      dotGlow.append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", "3").attr("result", "blur");
      dotGlow.append("feMerge").selectAll("feMergeNode").data(["blur", "SourceGraphic"]).join("feMergeNode").attr("in", (d) => d);

      // Layer 1: Atmosphere halo
      svg.append("circle")
        .attr("cx", cx).attr("cy", cy)
        .attr("r", globeRadius + 40)
        .attr("fill", "url(#atmos-glow)")
        .attr("pointer-events", "none");

      // Layer 2: Globe disc (ocean)
      svg.append("circle")
        .attr("cx", cx).attr("cy", cy)
        .attr("r", globeRadius)
        .attr("fill", tc.n950)
        .attr("stroke", tc.n700)
        .attr("stroke-width", 0.5)
        .attr("stroke-opacity", 0.6);

      // Layer 3: Graticule — subtle curved grid
      const graticule = d3.geoGraticule().step([20, 20]);
      svg.append("path")
        .datum(graticule())
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", tc.n700)
        .attr("stroke-width", 0.3)
        .attr("stroke-opacity", 0.35);

      // Layer 4: Land masses — ghostly outlines (like the reference)
      const land = topojson.feature(
        worldData!,
        worldData!.objects.land as GeometryCollection
      );
      svg.append("path")
        .datum(land)
        .attr("d", path)
        .attr("fill", tc.n900)
        .attr("stroke", tc.n600)
        .attr("stroke-width", 0.6);

      // Layer 5: Country borders — very subtle
      const countries = topojson.feature(
        worldData!,
        worldData!.objects.countries as GeometryCollection
      );
      svg.selectAll(".country-border")
        .data((countries as GeoJSON.FeatureCollection).features)
        .join("path")
        .attr("class", "country-border")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", tc.n600)
        .attr("stroke-width", 0.25)
        .attr("stroke-opacity", 0.5);

      // Layer 6: Block polygons — very subtle fill
      const blocksGroup = svg.append("g").attr("class", "blocks-layer");
      blocksGroup.selectAll<SVGPathElement, BlockFeature>(".block-area")
        .data(geoData!.features, (d) => d.id)
        .join("path")
        .attr("class", "block-area")
        .attr("d", path)
        .attr("fill", tc.amber)
        .attr("fill-opacity", 0.08)
        .attr("stroke", tc.amber)
        .attr("stroke-width", 0.8)
        .attr("stroke-opacity", 0.3);

      // Layer 7: Centroid dots — the main interactive elements (like reference)
      const dotsGroup = svg.append("g").attr("class", "dots-layer");

      geoData!.features.forEach((feature) => {
        const center = geoCentroid(feature);
        const projected = projection(center);
        if (!projected) return;

        // Check if point is on visible side of globe
        const dist = d3.geoDistance(center, [
          -rotationRef.current[0],
          -rotationRef.current[1],
        ]);
        if (dist > Math.PI / 2) return;

        const [px, py] = projected;

        // Outer glow ring
        dotsGroup.append("circle")
          .attr("class", `dot-glow-${feature.id}`)
          .attr("cx", px).attr("cy", py)
          .attr("r", 12)
          .attr("fill", tc.amber)
          .attr("fill-opacity", 0.15)
          .attr("filter", "url(#dot-glow)")
          .attr("pointer-events", "none");

        // Main dot
        dotsGroup.append("circle")
          .attr("class", `dot dot-${feature.id}`)
          .attr("cx", px).attr("cy", py)
          .attr("r", 6)
          .attr("fill", tc.amber)
          .attr("fill-opacity", 0.85)
          .attr("stroke", tc.amber)
          .attr("stroke-width", 1)
          .attr("stroke-opacity", 0.5)
          .attr("cursor", "pointer")
          .on("mouseenter", function (event: MouseEvent) {
            handleBlockHover(feature.id);
            showTooltip(event, feature.properties.name);
            // Enlarge on hover
            d3.select(this)
              .transition().duration(prefersReducedMotion ? 0 : 150)
              .attr("r", 9)
              .attr("fill-opacity", 1);
            d3.select(`.dot-glow-${feature.id}`)
              .transition().duration(prefersReducedMotion ? 0 : 150)
              .attr("r", 18)
              .attr("fill-opacity", 0.3);
          })
          .on("mouseleave", function () {
            handleBlockHover(null);
            hideTooltip();
            d3.select(this)
              .transition().duration(prefersReducedMotion ? 0 : 150)
              .attr("r", 6)
              .attr("fill-opacity", 0.85);
            d3.select(`.dot-glow-${feature.id}`)
              .transition().duration(prefersReducedMotion ? 0 : 150)
              .attr("r", 12)
              .attr("fill-opacity", 0.15);
          })
          .on("mousemove", function (event: MouseEvent) {
            moveTooltip(event);
          })
          .on("click", function () {
            handleBlockClick(feature.id);
          });
      });
    }

    // ─── Tooltip helpers ───
    function showTooltip(event: MouseEvent, text: string) {
      const tip = tooltipRef.current;
      if (!tip) return;
      tip.textContent = text;
      tip.style.opacity = "1";
      moveTooltip(event);
    }

    function moveTooltip(event: MouseEvent) {
      const tip = tooltipRef.current;
      if (!tip || !container) return;
      const rect = container.getBoundingClientRect();
      tip.style.left = `${event.clientX - rect.left + 14}px`;
      tip.style.top = `${event.clientY - rect.top - 10}px`;
    }

    function hideTooltip() {
      const tip = tooltipRef.current;
      if (!tip) return;
      tip.style.opacity = "0";
    }

    // ─── Drag-to-rotate (applied to container div, not SVG) ───
    const containerSel = d3.select(container);
    const dragBehavior = d3.drag<HTMLDivElement, unknown>()
      .on("start", () => {
        isDraggingRef.current = true;
        if (autoRotateRef.current !== null) {
          cancelAnimationFrame(autoRotateRef.current);
          autoRotateRef.current = null;
        }
        containerSel.style("cursor", "grabbing");
      })
      .on("drag", (event: d3.D3DragEvent<HTMLDivElement, unknown, unknown>) => {
        const sensitivity = 0.4;
        const [lambda, phi, gamma] = rotationRef.current;
        rotationRef.current = [
          lambda + event.dx * sensitivity,
          Math.max(-60, Math.min(60, phi - event.dy * sensitivity)),
          gamma,
        ];
        render();
      })
      .on("end", () => {
        isDraggingRef.current = false;
        containerSel.style("cursor", "grab");
        if (!prefersReducedMotion) startAutoRotate();
      });

    containerSel.call(dragBehavior);
    containerSel.style("cursor", "grab");

    // ─── Slow auto-rotation ───
    function startAutoRotate() {
      if (prefersReducedMotion) return;
      let lastTime = performance.now();

      function tick(now: number) {
        if (isDraggingRef.current) return;
        const delta = now - lastTime;
        lastTime = now;
        const [lambda, phi, gamma] = rotationRef.current;
        // Very slow rotation — ~3 degrees per second
        rotationRef.current = [lambda + delta * 0.003, phi, gamma];
        render();
        autoRotateRef.current = requestAnimationFrame(tick);
      }

      autoRotateRef.current = requestAnimationFrame(tick);
    }

    // Initial render
    render();

    // Start auto-rotation
    if (!prefersReducedMotion) {
      startAutoRotate();
    }

    // Responsive
    const resizeObserver = new ResizeObserver(() => {
      render();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (autoRotateRef.current !== null) {
        cancelAnimationFrame(autoRotateRef.current);
      }
    };
  }, [mapState, geoData, worldData, handleBlockHover, handleBlockClick, prefersReducedMotion]);

  // ─── Sync selected dot visual state ───
  useEffect(() => {
    if (!svgRef.current || mapState !== "active" || !geoData) return;
    const svg = d3.select(svgRef.current);
    const tc = getThemeColors();
    const dur = prefersReducedMotion ? 0 : 200;

    geoData.features.forEach((feature) => {
      const isActive = feature.id === uiState.blockId;
      const isSelected = isActive && uiState.mode === "selected";

      // Block polygon highlight
      svg.selectAll<SVGPathElement, BlockFeature>(".block-area")
        .filter((d) => d.id === feature.id)
        .transition().duration(dur)
        .attr("fill-opacity", isActive ? 0.2 : 0.08)
        .attr("stroke-opacity", isActive ? 0.7 : 0.3)
        .attr("stroke-width", isActive ? 1.5 : 0.8);

      // Dot highlight
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
  }, [uiState, mapState, geoData, prefersReducedMotion]);

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
      <div className="relative z-10 flex items-start py-8 md:py-16 px-4 md:px-8 pointer-events-none" style={{ minHeight: "600px" }}>
        <div className="w-full md:max-w-[420px] pointer-events-auto">
          <BlockInfoPanel block={activeBlock} isLocked={uiState.mode === "selected"} />
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
                  <line key={`h-${i}`} x1={0} x2={800} y1={i * 45} y2={i * 45} stroke="var(--color-neutral-600)" strokeWidth={0.5} />
                ))}
                {Array.from({ length: 18 }, (_, i) => (
                  <line key={`v-${i}`} x1={i * 50} x2={i * 50} y1={0} y2={600} stroke="var(--color-neutral-600)" strokeWidth={0.5} />
                ))}
              </g>
            </svg>
            <p className="absolute text-neutral-400 font-sans-body animate-pulse" style={{ fontSize: "var(--text-small)" }}>
              Loading exploration data&hellip;
            </p>
          </div>
        )}

        {mapState === "error" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-neutral-400 font-sans-body" style={{ fontSize: "var(--text-body)" }}>
              Unable to load map data. Please try again later.
            </p>
          </div>
        )}

        {mapState === "empty" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-neutral-400 font-sans-body" style={{ fontSize: "var(--text-body)" }}>
              Exploration block data coming soon.
            </p>
          </div>
        )}

        {/* D3 renders into this SVG */}
        <svg
          ref={svgRef}
          className={`w-full h-full ${mapState !== "active" ? "hidden" : ""}`}
          role="img"
          aria-label="Interactive orthographic globe map showing AEI exploration blocks in Indonesia"
        />

        {/* Hover tooltip */}
        <div
          ref={tooltipRef}
          className="absolute pointer-events-none z-20 px-3 py-1.5 rounded-[var(--radius-button)] font-sans-body text-neutral-50 whitespace-nowrap transition-opacity duration-150"
          style={{
            fontSize: "var(--text-small)",
            opacity: 0,
            background: "rgba(22, 37, 33, 0.85)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(132, 188, 218, 0.2)",
          }}
          aria-hidden="true"
        />

        {/* Keyboard-accessible buttons — pointer-events pass through to SVG */}
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
                className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 pointer-events-auto focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-teal-blue focus-visible:bg-teal-blue/20"
                style={{
                  // Position will be updated by effect below
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
