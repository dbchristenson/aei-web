"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import gsap from "gsap";
import BlockInfoPanel from "./BlockInfoPanel";
import type { BlockProperties } from "./BlockInfoPanel";
import type { Topology, GeometryCollection } from "topojson-specification";

/** Read resolved CSS custom property values at runtime */
function getCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function getThemeColors() {
  return {
    tealBlue: getCssVar("--color-primary"),
    amber: getCssVar("--color-accent"),
    coralGlow: getCssVar("--color-accent-alt"),
    n950: getCssVar("--color-bg"),
    n900: getCssVar("--color-bg-subtle"),
    n800: getCssVar("--color-surface"),
    n700: getCssVar("--color-surface-hover"),
    n600: getCssVar("--color-border"),
    n400: getCssVar("--color-fg-muted"),
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

// ─── Regional view constants ───
const INITIAL_ROTATION: [number, number, number] = [-118, -2, 0];
const LAMBDA_BOUNDS: [number, number] = [-128, -108];
const PHI_BOUNDS: [number, number] = [-6, 4];
const RUBBER_BAND_DIM = 18;
const MAX_OVERSHOOT = 15;

// ─── Zoom-to-block constants ───
const ZOOM_DURATION = 1.0;
const ZOOM_EASE = "power2.inOut";
const REGIONAL_GRATICULE_STEP: [number, number] = [10, 10];
const ZOOMED_GRATICULE_STEP: [number, number] = [2, 2];
const ZOOMED_RUBBER_BAND_DIM = 8;
const ZOOMED_DRAG_PADDING = 5;

/** iOS-style rubber-band clamping */
function rubberBand(value: number, min: number, max: number, dim: number): number {
  if (value > max) {
    const overshoot = Math.min(value - max, MAX_OVERSHOOT);
    return max + dim * (1 - 1 / (overshoot / dim + 1));
  }
  if (value < min) {
    const overshoot = Math.min(min - value, MAX_OVERSHOOT);
    return min - dim * (1 - 1 / (overshoot / dim + 1));
  }
  return value;
}

/** Compute the centroid of a GeoJSON feature in [lon, lat] */
function geoCentroid(feature: GeoJSON.Feature): [number, number] {
  return d3.geoCentroid(feature);
}

/** Compute per-block zoom parameters: rotation, scale multiplier, and tightened drag bounds */
function getBlockZoomParams(
  feature: BlockFeature,
  baseScale: number
): {
  rotation: [number, number, number];
  scaleMultiplier: number;
  lambdaBounds: [number, number];
  phiBounds: [number, number];
} {
  const [clon, clat] = geoCentroid(feature);
  const rotation: [number, number, number] = [-clon, -clat, 0];

  const bbox = d3.geoBounds(feature);
  const lonSpan = bbox[1][0] - bbox[0][0];
  const latSpan = bbox[1][1] - bbox[0][1];
  const maxSpan = Math.max(lonSpan, latSpan);

  // Target: block polygon ~200px across in viewport
  const targetPixels = 200;
  const angularRad = maxSpan * (Math.PI / 180);
  const idealScale = targetPixels / angularRad;
  const multiplier = Math.min(Math.max(idealScale / baseScale, 3), 8);

  // Tighten drag bounds around block center (in rotation-space)
  const pad = ZOOMED_DRAG_PADDING;
  const lb: [number, number] = [-(clon + pad), -(clon - pad)];
  const pb: [number, number] = [-(clat + pad), -(clat - pad)];

  return {
    rotation,
    scaleMultiplier: multiplier,
    lambdaBounds: [Math.min(lb[0], lb[1]), Math.max(lb[0], lb[1])],
    phiBounds: [Math.min(pb[0], pb[1]), Math.max(pb[0], pb[1])],
  };
}

export default function ExplorationMap({
  blocksEndpoint = "/data/blocks.geojson",
}: ExplorationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef<[number, number, number]>(INITIAL_ROTATION);
  const rawRotationRef = useRef<[number, number]>([INITIAL_ROTATION[0], INITIAL_ROTATION[1]]);
  const tooltipBlockRef = useRef<BlockFeature | null>(null);
  const bounceAnimRef = useRef<gsap.core.Tween | null>(null);
  const zoomAnimRef = useRef<gsap.core.Tween | null>(null);
  const scaleMultiplierRef = useRef<number>(1.0);
  const dragBoundsRef = useRef<{
    lambda: [number, number];
    phi: [number, number];
    rubberBandDim: number;
  }>({
    lambda: LAMBDA_BOUNDS,
    phi: PHI_BOUNDS,
    rubberBandDim: RUBBER_BAND_DIM,
  });
  const renderRef = useRef<(() => void) | null>(null);
  const showTooltipRef = useRef<((feature: BlockFeature) => void) | null>(null);
  const hideTooltipRef = useRef<(() => void) | null>(null);

  const [mapState, setMapState] = useState<MapState>("loading");
  const [uiState, setUiState] = useState<UIState>({ blockId: null, mode: "idle" });
  const uiStateRef = useRef<UIState>(uiState);
  uiStateRef.current = uiState;
  const [geoData, setGeoData] = useState<BlocksGeoJSON | null>(null);
  const [worldData, setWorldData] = useState<Topology | null>(null);

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const allBlocks = geoData?.features.map((f) => f.properties) ?? [];

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
    // Clear tooltip immediately
    tooltipBlockRef.current = null;
    if (tooltipRef.current) {
      tooltipRef.current.style.opacity = "0";
    }
  }, []);

  // ─── D3 rendering — zoomed draggable globe ───
  useEffect(() => {
    if (mapState !== "active" || !geoData || !worldData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    if (!container) return;

    let tc = getThemeColors();

    const projection = d3
      .geoOrthographic()
      .clipAngle(90);

    function updateProjection() {
      const width = container!.clientWidth;
      const height = container!.clientHeight;

      const baseRadius = Math.max(height * 2.5, 1200);
      const globeRadius = baseRadius * scaleMultiplierRef.current;

      projection
        .scale(globeRadius)
        .rotate(rotationRef.current)
        .translate([width * 0.55, height * 0.5]);

      return { width, height, globeRadius, baseRadius };
    }

    function render() {
      tc = getThemeColors();
      const { width, height, globeRadius } = updateProjection();
      const path = d3.geoPath(projection);

      svg.attr("viewBox", `0 0 ${width} ${height}`);
      svg.selectAll("*").remove();

      const defs = svg.append("defs");

      // Atmosphere glow
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

      // Block outline glow filter
      const blockGlow = defs.append("filter").attr("id", "block-glow").attr("x", "-30%").attr("y", "-30%").attr("width", "160%").attr("height", "160%");
      blockGlow.append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", "6").attr("result", "blur");
      blockGlow.append("feMerge").selectAll("feMergeNode").data(["blur", "SourceGraphic"]).join("feMergeNode").attr("in", (d) => d);

      // Layer 1: Atmosphere halo — skip when globe overflows viewport
      if (globeRadius + 40 < Math.max(width, height)) {
        svg.append("circle")
          .attr("cx", cx).attr("cy", cy)
          .attr("r", globeRadius + 40)
          .attr("fill", "url(#atmos-glow)")
          .attr("pointer-events", "none");
      }

      // Layer 2: Globe disc (ocean)
      svg.append("circle")
        .attr("cx", cx).attr("cy", cy)
        .attr("r", globeRadius)
        .attr("fill", tc.n950);

      // Layer 3: Graticule — interpolate density with zoom level
      const zoomT = Math.min((scaleMultiplierRef.current - 1) / 4, 1);
      const gratStep: [number, number] = [
        REGIONAL_GRATICULE_STEP[0] + zoomT * (ZOOMED_GRATICULE_STEP[0] - REGIONAL_GRATICULE_STEP[0]),
        REGIONAL_GRATICULE_STEP[1] + zoomT * (ZOOMED_GRATICULE_STEP[1] - REGIONAL_GRATICULE_STEP[1]),
      ];
      const graticule = d3.geoGraticule().step(gratStep);
      svg.append("path")
        .datum(graticule())
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", tc.n700)
        .attr("stroke-width", 0.3)
        .attr("stroke-opacity", 0.35);

      // Layer 4: Land masses
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

      // Layer 5: Block polygons
      const currentUi = uiStateRef.current;
      const blocksGroup = svg.append("g").attr("class", "blocks-layer");
      blocksGroup.selectAll<SVGPathElement, BlockFeature>(".block-area")
        .data(geoData!.features, (d) => d.id)
        .join("path")
        .attr("class", "block-area")
        .attr("d", path)
        .attr("fill-rule", "evenodd")
        .each(function (d) {
          const el = d3.select(this);
          const isActive = d.id === currentUi.blockId;
          const isSelected = isActive && currentUi.mode === "selected";

          el.attr("fill", tc.amber)
            .attr("fill-opacity", isSelected ? 0.25 : isActive ? 0.2 : 0.08)
            .attr("stroke", isSelected ? tc.tealBlue : tc.amber)
            .attr("stroke-width", isSelected ? 2 : isActive ? 1.5 : 1.0)
            .attr("stroke-opacity", isSelected ? 0.9 : isActive ? 0.7 : 0.4)
            .attr("filter", isSelected ? "url(#block-glow)" : "none");
        });

      // Update tooltip to track block's projected position
      updateTooltipPosition();

      // Layer 7: Centroid dots
      const dotsGroup = svg.append("g").attr("class", "dots-layer");

      geoData!.features.forEach((feature) => {
        const center = geoCentroid(feature);
        const projected = projection(center);
        if (!projected) return;

        const dist = d3.geoDistance(center, [
          -rotationRef.current[0],
          -rotationRef.current[1],
        ]);
        if (dist > Math.PI / 2) return;

        const [px, py] = projected;

        dotsGroup.append("circle")
          .attr("class", `dot-glow-${feature.id}`)
          .attr("cx", px).attr("cy", py)
          .attr("r", 12)
          .attr("fill", tc.amber)
          .attr("fill-opacity", 0.15)
          .attr("filter", "url(#dot-glow)")
          .attr("pointer-events", "none");

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
          .on("mouseenter", function () {
            handleBlockHover(feature.id);
            showTooltip(feature);
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
          .on("click", function () {
            handleBlockClick(feature.id);
          });
      });
    }

    // Expose render to other effects via ref
    renderRef.current = render;

    // ─── Tooltip helpers ───
    function updateTooltipPosition() {
      const tip = tooltipRef.current;
      const feature = tooltipBlockRef.current;
      if (!tip || !feature) return;

      const center = geoCentroid(feature);
      const projected = projection(center);
      if (!projected) {
        tip.style.opacity = "0";
        return;
      }

      // Check if centroid is on the visible hemisphere
      const dist = d3.geoDistance(center, [
        -rotationRef.current[0],
        -rotationRef.current[1],
      ]);
      if (dist > Math.PI / 2) {
        tip.style.opacity = "0";
        return;
      }

      tip.style.opacity = "1";
      tip.style.left = `${projected[0] + 14}px`;
      tip.style.top = `${projected[1] - 10}px`;
    }

    function showTooltip(feature: BlockFeature) {
      const tip = tooltipRef.current;
      if (!tip) return;
      tooltipBlockRef.current = feature;
      tip.textContent = feature.properties.name;
      updateTooltipPosition();
    }

    function hideTooltip() {
      const tip = tooltipRef.current;
      if (!tip) return;
      tooltipBlockRef.current = null;
      tip.style.opacity = "0";
    }

    // Expose tooltip helpers to other effects
    showTooltipRef.current = showTooltip;
    hideTooltipRef.current = hideTooltip;

    // ─── Drag-to-rotate with elastic bounded drag ───
    const containerSel = d3.select(container);
    const dragBehavior = d3.drag<HTMLDivElement, unknown>()
      .on("start", () => {
        // Don't drag during zoom animation
        if (zoomAnimRef.current) return;
        // Kill any in-flight bounce animation
        if (bounceAnimRef.current) {
          bounceAnimRef.current.kill();
          bounceAnimRef.current = null;
        }
        rawRotationRef.current = [rotationRef.current[0], rotationRef.current[1]];
        containerSel.style("cursor", "grabbing");
      })
      .on("drag", (event: d3.D3DragEvent<HTMLDivElement, unknown, unknown>) => {
        if (zoomAnimRef.current) return;
        const sensitivity = 0.08 / scaleMultiplierRef.current;
        const bounds = dragBoundsRef.current;
        rawRotationRef.current = [
          rawRotationRef.current[0] + event.dx * sensitivity,
          rawRotationRef.current[1] - event.dy * sensitivity,
        ];
        rotationRef.current = [
          rubberBand(rawRotationRef.current[0], bounds.lambda[0], bounds.lambda[1], bounds.rubberBandDim),
          rubberBand(rawRotationRef.current[1], bounds.phi[0], bounds.phi[1], bounds.rubberBandDim),
          0,
        ];
        render();
      })
      .on("end", () => {
        if (zoomAnimRef.current) return;
        containerSel.style("cursor", "grab");

        const bounds = dragBoundsRef.current;
        const clampedLambda = Math.max(bounds.lambda[0], Math.min(bounds.lambda[1], rawRotationRef.current[0]));
        const clampedPhi = Math.max(bounds.phi[0], Math.min(bounds.phi[1], rawRotationRef.current[1]));

        const isOutOfBounds =
          rawRotationRef.current[0] !== clampedLambda ||
          rawRotationRef.current[1] !== clampedPhi;

        if (isOutOfBounds) {
          if (prefersReducedMotion) {
            rotationRef.current = [clampedLambda, clampedPhi, 0];
            rawRotationRef.current = [clampedLambda, clampedPhi];
            render();
          } else {
            const animTarget = { lambda: rotationRef.current[0], phi: rotationRef.current[1] };
            bounceAnimRef.current = gsap.to(animTarget, {
              lambda: clampedLambda,
              phi: clampedPhi,
              duration: 0.4,
              ease: "back.out(1.7)",
              onUpdate: () => {
                rotationRef.current = [animTarget.lambda, animTarget.phi, 0];
                render();
              },
              onComplete: () => {
                rawRotationRef.current = [clampedLambda, clampedPhi];
                bounceAnimRef.current = null;
              },
            });
          }
        }
      });

    containerSel.call(dragBehavior);
    containerSel.style("cursor", "grab");

    // Double-click anywhere on the map to deselect
    containerSel.on("dblclick", () => {
      handleDeselect();
    });

    // Initial render
    render();

    // Responsive
    const resizeObserver = new ResizeObserver(() => {
      render();
    });
    resizeObserver.observe(container);

    // Re-render when theme changes
    const themeObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "data-theme") {
          render();
          break;
        }
      }
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      resizeObserver.disconnect();
      themeObserver.disconnect();
      containerSel.on("dblclick", null);
      renderRef.current = null;
      if (bounceAnimRef.current) {
        bounceAnimRef.current.kill();
        bounceAnimRef.current = null;
      }
      if (zoomAnimRef.current) {
        zoomAnimRef.current.kill();
        zoomAnimRef.current = null;
      }
    };
  }, [mapState, geoData, worldData, handleBlockHover, handleBlockClick, handleDeselect, prefersReducedMotion]);

  // ─── Zoom on select / deselect ───
  useEffect(() => {
    if (mapState !== "active" || !geoData || !containerRef.current) return;

    const doRender = () => renderRef.current?.();

    function killAnimations() {
      if (zoomAnimRef.current) {
        zoomAnimRef.current.kill();
        zoomAnimRef.current = null;
      }
      if (bounceAnimRef.current) {
        bounceAnimRef.current.kill();
        bounceAnimRef.current = null;
      }
    }

    if (uiState.mode === "selected" && uiState.blockId) {
      const feature = geoData.features.find((f) => f.id === uiState.blockId);
      if (!feature) return;

      killAnimations();

      const height = containerRef.current.clientHeight;
      const baseRadius = Math.max(height * 2.5, 1200);
      const params = getBlockZoomParams(feature, baseRadius);

      if (prefersReducedMotion) {
        rotationRef.current = params.rotation;
        rawRotationRef.current = [params.rotation[0], params.rotation[1]];
        scaleMultiplierRef.current = params.scaleMultiplier;
        dragBoundsRef.current = {
          lambda: params.lambdaBounds,
          phi: params.phiBounds,
          rubberBandDim: ZOOMED_RUBBER_BAND_DIM,
        };
        doRender();
        return;
      }

      const animState = {
        lambda: rotationRef.current[0],
        phi: rotationRef.current[1],
        scale: scaleMultiplierRef.current,
        lbMin: dragBoundsRef.current.lambda[0],
        lbMax: dragBoundsRef.current.lambda[1],
        pbMin: dragBoundsRef.current.phi[0],
        pbMax: dragBoundsRef.current.phi[1],
        rbDim: dragBoundsRef.current.rubberBandDim,
      };

      zoomAnimRef.current = gsap.to(animState, {
        lambda: params.rotation[0],
        phi: params.rotation[1],
        scale: params.scaleMultiplier,
        lbMin: params.lambdaBounds[0],
        lbMax: params.lambdaBounds[1],
        pbMin: params.phiBounds[0],
        pbMax: params.phiBounds[1],
        rbDim: ZOOMED_RUBBER_BAND_DIM,
        duration: ZOOM_DURATION,
        ease: ZOOM_EASE,
        onUpdate: () => {
          rotationRef.current = [animState.lambda, animState.phi, 0];
          scaleMultiplierRef.current = animState.scale;
          dragBoundsRef.current = {
            lambda: [animState.lbMin, animState.lbMax],
            phi: [animState.pbMin, animState.pbMax],
            rubberBandDim: animState.rbDim,
          };
          doRender();
        },
        onComplete: () => {
          rawRotationRef.current = [params.rotation[0], params.rotation[1]];
          zoomAnimRef.current = null;
        },
      });
    } else if (uiState.mode === "idle" && scaleMultiplierRef.current > 1.05) {
      killAnimations();

      if (prefersReducedMotion) {
        rotationRef.current = INITIAL_ROTATION;
        rawRotationRef.current = [INITIAL_ROTATION[0], INITIAL_ROTATION[1]];
        scaleMultiplierRef.current = 1.0;
        dragBoundsRef.current = {
          lambda: LAMBDA_BOUNDS,
          phi: PHI_BOUNDS,
          rubberBandDim: RUBBER_BAND_DIM,
        };
        doRender();
        return;
      }

      const animState = {
        lambda: rotationRef.current[0],
        phi: rotationRef.current[1],
        scale: scaleMultiplierRef.current,
        lbMin: dragBoundsRef.current.lambda[0],
        lbMax: dragBoundsRef.current.lambda[1],
        pbMin: dragBoundsRef.current.phi[0],
        pbMax: dragBoundsRef.current.phi[1],
        rbDim: dragBoundsRef.current.rubberBandDim,
      };

      zoomAnimRef.current = gsap.to(animState, {
        lambda: INITIAL_ROTATION[0],
        phi: INITIAL_ROTATION[1],
        scale: 1.0,
        lbMin: LAMBDA_BOUNDS[0],
        lbMax: LAMBDA_BOUNDS[1],
        pbMin: PHI_BOUNDS[0],
        pbMax: PHI_BOUNDS[1],
        rbDim: RUBBER_BAND_DIM,
        duration: ZOOM_DURATION,
        ease: ZOOM_EASE,
        onUpdate: () => {
          rotationRef.current = [animState.lambda, animState.phi, 0];
          scaleMultiplierRef.current = animState.scale;
          dragBoundsRef.current = {
            lambda: [animState.lbMin, animState.lbMax],
            phi: [animState.pbMin, animState.pbMax],
            rubberBandDim: animState.rbDim,
          };
          doRender();
        },
        onComplete: () => {
          rawRotationRef.current = [INITIAL_ROTATION[0], INITIAL_ROTATION[1]];
          zoomAnimRef.current = null;
        },
      });
    }
  }, [uiState.mode, uiState.blockId, mapState, geoData, prefersReducedMotion]);

  // ─── Sync selected dot visual state + tooltip ───
  useEffect(() => {
    if (!svgRef.current || mapState !== "active" || !geoData) return;
    const svg = d3.select(svgRef.current);
    const tc = getThemeColors();
    const dur = prefersReducedMotion ? 0 : 200;

    // Show tooltip for selected block, hide if nothing selected
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
            <p className="absolute text-fg-muted font-sans-body animate-pulse" style={{ fontSize: "var(--text-small)" }}>
              Loading exploration data&hellip;
            </p>
          </div>
        )}

        {mapState === "error" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-fg-muted font-sans-body" style={{ fontSize: "var(--text-body)" }}>
              Unable to load map data. Please try again later.
            </p>
          </div>
        )}

        {mapState === "empty" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-fg-muted font-sans-body" style={{ fontSize: "var(--text-body)" }}>
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
          className="absolute pointer-events-none z-20 px-3 py-1.5 rounded-[var(--radius-button)] font-sans-body text-fg whitespace-nowrap transition-opacity duration-150"
          style={{
            fontSize: "var(--text-small)",
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
