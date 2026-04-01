"use client";

import { useEffect, useRef } from "react";
import { select } from "d3-selection";
import { geoOrthographic, geoPath, geoGraticule, geoDistance } from "d3-geo";
import { drag } from "d3-drag";
import "d3-transition";
import { feature as topoFeature } from "topojson-client";
import gsap from "gsap";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { D3DragEvent } from "d3-drag";
import type { GeoPermissibleObjects } from "d3-geo";
import type { BlockFeature, BlocksGeoJSON, MapState, UIState, DragBounds } from "./types";
import {
  REGIONAL_GRATICULE_STEP,
  ZOOMED_GRATICULE_STEP,
  GLOBE_RADIUS_FACTOR,
  MIN_GLOBE_RADIUS,
  DOT_RADIUS,
  DOT_GLOW_RADIUS,
  DOT_HOVER_RADIUS,
  DOT_HOVER_GLOW_RADIUS,
  DOT_TRANSITION_MS,
} from "./constants";
import { rubberBand, geoCentroid } from "./geo-utils";
import { getThemeColors } from "@/lib/theme-utils";

export interface UseGlobeRendererParams {
  svgRef: React.RefObject<SVGSVGElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  tooltipRef: React.RefObject<HTMLDivElement | null>;
  geoData: BlocksGeoJSON | null;
  worldData: Topology | null;
  mapState: MapState;
  rotationRef: React.MutableRefObject<[number, number, number]>;
  rawRotationRef: React.MutableRefObject<[number, number]>;
  scaleMultiplierRef: React.MutableRefObject<number>;
  dragBoundsRef: React.MutableRefObject<DragBounds>;
  tooltipBlockRef: React.MutableRefObject<BlockFeature | null>;
  bounceAnimRef: React.MutableRefObject<gsap.core.Tween | null>;
  zoomAnimRef: React.MutableRefObject<gsap.core.Tween | null>;
  uiStateRef: React.MutableRefObject<UIState>;
  handleBlockHover: (blockId: string | null) => void;
  handleBlockClick: (blockId: string) => void;
  handleDeselect: () => void;
  prefersReducedMotion: boolean;
}

export interface UseGlobeRendererReturn {
  renderRef: React.MutableRefObject<(() => void) | null>;
  showTooltipRef: React.MutableRefObject<((feature: BlockFeature) => void) | null>;
  hideTooltipRef: React.MutableRefObject<(() => void) | null>;
}

/** Parse an rgb(r, g, b) string and return rgba(r, g, b, a). */
function withAlpha(color: string, alpha: number): string {
  const m = color.match(/(\d+),\s*(\d+),\s*(\d+)/);
  if (m) return `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${alpha})`;
  return color;
}

export default function useGlobeRenderer({
  svgRef, canvasRef, containerRef, tooltipRef,
  geoData, worldData, mapState,
  rotationRef, rawRotationRef, scaleMultiplierRef, dragBoundsRef,
  tooltipBlockRef, bounceAnimRef, zoomAnimRef,
  uiStateRef,
  handleBlockHover, handleBlockClick, handleDeselect,
  prefersReducedMotion,
}: UseGlobeRendererParams): UseGlobeRendererReturn {
  const renderRef = useRef<(() => void) | null>(null);
  const showTooltipRef = useRef<((feature: BlockFeature) => void) | null>(null);
  const hideTooltipRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (mapState !== "active" || !geoData || !worldData || !svgRef.current) return;

    const svgSel = select(svgRef.current);
    const container = containerRef.current;
    if (!container) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let tc = getThemeColors();
    let initialized = false;
    let dragRafId: number | null = null;
    let resizeRafId: number | null = null;

    const projection = geoOrthographic().clipAngle(90);

    // Pre-compute land topology once
    const landFeature = topoFeature(
      worldData,
      worldData.objects.land as GeometryCollection
    );

    function updateProjection() {
      const width = container!.clientWidth;
      const height = container!.clientHeight;

      const baseRadius = Math.max(height * GLOBE_RADIUS_FACTOR, MIN_GLOBE_RADIUS);
      const globeRadius = baseRadius * scaleMultiplierRef.current;

      projection
        .scale(globeRadius)
        .rotate(rotationRef.current)
        .translate([width * 0.55, height * 0.5]);

      return { width, height, globeRadius, baseRadius };
    }

    // ─── HiDPI canvas sizing ───
    function sizeCanvas(width: number, height: number) {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
    }

    // ─── Canvas render: non-interactive background layers ───
    function renderCanvasLayers(width: number, height: number, globeRadius: number) {
      const dpr = window.devicePixelRatio || 1;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, width, height);

      const [cx, cy] = projection.translate();
      const canvasPath = geoPath(projection, ctx!);

      // Layer 1: Atmosphere halo (radial gradient)
      if (globeRadius + 40 < Math.max(width, height)) {
        const atmosGrad = ctx!.createRadialGradient(cx, cy, globeRadius * 0.75, cx, cy, globeRadius + 40);
        atmosGrad.addColorStop(0.75, withAlpha(tc.tealBlue, 0.06));
        atmosGrad.addColorStop(0.90, withAlpha(tc.tealBlue, 0.12));
        atmosGrad.addColorStop(1.0,  withAlpha(tc.tealBlue, 0));
        ctx!.beginPath();
        ctx!.arc(cx, cy, globeRadius + 40, 0, 2 * Math.PI);
        ctx!.fillStyle = atmosGrad;
        ctx!.fill();
      }

      // Layer 2: Globe disc (ocean)
      ctx!.beginPath();
      ctx!.arc(cx, cy, globeRadius, 0, 2 * Math.PI);
      ctx!.fillStyle = tc.white;
      ctx!.fill();

      // Layer 3: Graticule
      const zoomT = Math.min((scaleMultiplierRef.current - 1) / 4, 1);
      const gratStep: [number, number] = [
        REGIONAL_GRATICULE_STEP[0] + zoomT * (ZOOMED_GRATICULE_STEP[0] - REGIONAL_GRATICULE_STEP[0]),
        REGIONAL_GRATICULE_STEP[1] + zoomT * (ZOOMED_GRATICULE_STEP[1] - REGIONAL_GRATICULE_STEP[1]),
      ];
      ctx!.beginPath();
      canvasPath(geoGraticule().step(gratStep)());
      ctx!.strokeStyle = tc.n700;
      ctx!.lineWidth = 0.3;
      ctx!.globalAlpha = 0.35;
      ctx!.stroke();
      ctx!.globalAlpha = 1.0;

      // Layer 4: Land masses (base fill)
      ctx!.beginPath();
      canvasPath(landFeature as GeoPermissibleObjects);
      ctx!.fillStyle = tc.n900;
      ctx!.fill();
      ctx!.strokeStyle = tc.n600;
      ctx!.lineWidth = 0.6;
      ctx!.stroke();

    }

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

      const dist = geoDistance(center, [
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

    showTooltipRef.current = showTooltip;
    hideTooltipRef.current = hideTooltip;

    // ─── Full render: canvas background + SVG interactive elements ───
    function renderFull() {
      tc = getThemeColors();
      const { width, height, globeRadius } = updateProjection();
      const svgPath = geoPath(projection);

      // ── Canvas background layers ──
      sizeCanvas(width, height);
      renderCanvasLayers(width, height, globeRadius);

      // ── SVG interactive layers ──
      svgSel.attr("viewBox", `0 0 ${width} ${height}`);
      svgSel.selectAll("*").remove();

      const defs = svgSel.append("defs");

      // Dot glow filter
      const dotGlow = defs.append("filter").attr("id", "dot-glow").attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
      dotGlow.append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", "3").attr("result", "blur");
      dotGlow.append("feMerge").selectAll("feMergeNode").data(["blur", "SourceGraphic"]).join("feMergeNode").attr("in", (d) => d);

      // Block outline glow filter
      const blockGlow = defs.append("filter").attr("id", "block-glow").attr("x", "-30%").attr("y", "-30%").attr("width", "160%").attr("height", "160%");
      blockGlow.append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", "6").attr("result", "blur");
      blockGlow.append("feMerge").selectAll("feMergeNode").data(["blur", "SourceGraphic"]).join("feMergeNode").attr("in", (d) => d);

      // Block polygons
      const currentUi = uiStateRef.current;
      const blocksGroup = svgSel.append("g").attr("class", "blocks-layer");
      blocksGroup.selectAll<SVGPathElement, BlockFeature>(".block-area")
        .data(geoData!.features, (d) => d.id)
        .join("path")
        .attr("class", "block-area")
        .attr("d", svgPath)
        .attr("fill-rule", "evenodd")
        .each(function (d) {
          const el = select(this);
          const isActive = d.id === currentUi.blockId;
          const isSelected = isActive && currentUi.mode === "selected";

          el.attr("fill", tc.amber)
            .attr("fill-opacity", isSelected ? 0.25 : isActive ? 0.2 : 0.08)
            .attr("stroke", isSelected ? tc.tealBlue : tc.amber)
            .attr("stroke-width", isSelected ? 2 : isActive ? 1.5 : 1.0)
            .attr("stroke-opacity", isSelected ? 0.9 : isActive ? 0.7 : 0.4)
            .attr("filter", isSelected ? "url(#block-glow)" : "none");
        });

      updateTooltipPosition();

      // Centroid dots
      const dotsGroup = svgSel.append("g").attr("class", "dots-layer");

      geoData!.features.forEach((feature) => {
        const center = geoCentroid(feature);
        const projected = projection(center);
        const dist = geoDistance(center, [
          -rotationRef.current[0],
          -rotationRef.current[1],
        ]);
        const visible = dist <= Math.PI / 2 && projected != null;
        const px = visible ? projected![0] : 0;
        const py = visible ? projected![1] : 0;

        dotsGroup.append("circle")
          .attr("class", `dot-glow dot-glow-${feature.id}`)
          .attr("cx", px).attr("cy", py)
          .attr("r", DOT_GLOW_RADIUS)
          .attr("fill", tc.amber)
          .attr("fill-opacity", 0.15)
          .attr("filter", "url(#dot-glow)")
          .attr("pointer-events", "none")
          .attr("display", visible ? null : "none");

        dotsGroup.append("circle")
          .attr("class", `dot dot-${feature.id}`)
          .attr("cx", px).attr("cy", py)
          .attr("r", DOT_RADIUS)
          .attr("fill", tc.amber)
          .attr("fill-opacity", 0.85)
          .attr("stroke", tc.amber)
          .attr("stroke-width", 1)
          .attr("stroke-opacity", 0.5)
          .attr("cursor", "pointer")
          .attr("display", visible ? null : "none")
          .on("mouseenter", function () {
            handleBlockHover(feature.id);
            showTooltip(feature);
            select(this)
              .transition().duration(prefersReducedMotion ? 0 : DOT_TRANSITION_MS)
              .attr("r", DOT_HOVER_RADIUS)
              .attr("fill-opacity", 1);
            svgSel.select(`.dot-glow-${feature.id}`)
              .transition().duration(prefersReducedMotion ? 0 : DOT_TRANSITION_MS)
              .attr("r", DOT_HOVER_GLOW_RADIUS)
              .attr("fill-opacity", 0.3);
          })
          .on("mouseleave", function () {
            handleBlockHover(null);
            hideTooltip();
            select(this)
              .transition().duration(prefersReducedMotion ? 0 : DOT_TRANSITION_MS)
              .attr("r", DOT_RADIUS)
              .attr("fill-opacity", 0.85);
            svgSel.select(`.dot-glow-${feature.id}`)
              .transition().duration(prefersReducedMotion ? 0 : DOT_TRANSITION_MS)
              .attr("r", DOT_GLOW_RADIUS)
              .attr("fill-opacity", 0.15);
          })
          .on("click", function () {
            handleBlockClick(feature.id);
          });
      });

      initialized = true;
    }

    // ─── Transform render: canvas redraw + SVG position update (drag, zoom) ───
    function renderTransform() {
      if (!initialized) { renderFull(); return; }

      const { width, height, globeRadius } = updateProjection();
      const svgPath = geoPath(projection);

      // Canvas: full redraw
      renderCanvasLayers(width, height, globeRadius);

      // SVG: only block polygons + dots (~435 coords)
      svgSel.attr("viewBox", `0 0 ${width} ${height}`);
      svgSel.selectAll<SVGPathElement, BlockFeature>(".block-area").attr("d", svgPath);

      // Update dot positions + visibility
      geoData!.features.forEach((feature) => {
        const center = geoCentroid(feature);
        const projected = projection(center);
        const dist = geoDistance(center, [
          -rotationRef.current[0],
          -rotationRef.current[1],
        ]);
        const visible = dist <= Math.PI / 2 && projected != null;
        const px = visible ? projected![0] : 0;
        const py = visible ? projected![1] : 0;

        svgSel.select(`.dot-${feature.id}`)
          .attr("cx", px).attr("cy", py)
          .attr("display", visible ? null : "none");

        svgSel.select(`.dot-glow-${feature.id}`)
          .attr("cx", px).attr("cy", py)
          .attr("display", visible ? null : "none");
      });

      updateTooltipPosition();
    }

    // External callers (useBlockZoom) get the fast path
    renderRef.current = renderTransform;

    // ─── Drag-to-rotate with elastic bounded drag + rAF throttle ───
    const containerSel = select(container);
    const dragBehavior = drag<HTMLDivElement, unknown>()
      .on("start", () => {
        if (zoomAnimRef.current) return;
        if (bounceAnimRef.current) {
          bounceAnimRef.current.kill();
          bounceAnimRef.current = null;
        }
        rawRotationRef.current = [rotationRef.current[0], rotationRef.current[1]];
        containerSel.style("cursor", "grabbing");
      })
      .on("drag", (event: D3DragEvent<HTMLDivElement, unknown, unknown>) => {
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
        // Coalesce multiple drag events into a single frame render
        if (dragRafId === null) {
          dragRafId = requestAnimationFrame(() => {
            dragRafId = null;
            renderTransform();
          });
        }
      })
      .on("end", () => {
        if (zoomAnimRef.current) return;
        containerSel.style("cursor", "grab");

        // Cancel any pending drag frame — we'll render in bounce or immediately
        if (dragRafId !== null) {
          cancelAnimationFrame(dragRafId);
          dragRafId = null;
        }

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
            renderTransform();
          } else {
            const animTarget = { lambda: rotationRef.current[0], phi: rotationRef.current[1] };
            bounceAnimRef.current = gsap.to(animTarget, {
              lambda: clampedLambda,
              phi: clampedPhi,
              duration: 0.4,
              ease: "back.out(1.7)",
              onUpdate: () => {
                rotationRef.current = [animTarget.lambda, animTarget.phi, 0];
                renderTransform();
              },
              onComplete: () => {
                rawRotationRef.current = [clampedLambda, clampedPhi];
                bounceAnimRef.current = null;
                renderTransform();
              },
            });
          }
        } else {
          // Ensure final frame is rendered at rest position
          renderTransform();
        }
      });

    containerSel.call(dragBehavior);
    containerSel.style("cursor", "grab");

    containerSel.on("dblclick", () => {
      handleDeselect();
    });

    // Initial full render
    renderFull();

    // Resize → full render (coalesced via rAF to prevent resize storm)
    const resizeObserver = new ResizeObserver(() => {
      if (resizeRafId !== null) cancelAnimationFrame(resizeRafId);
      resizeRafId = requestAnimationFrame(() => {
        resizeRafId = null;
        renderFull();
      });
    });
    resizeObserver.observe(container);

    // Theme change → full render (colors changed)
    const themeObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "data-theme") {
          renderFull();
          break;
        }
      }
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      if (dragRafId !== null) cancelAnimationFrame(dragRafId);
      if (resizeRafId !== null) cancelAnimationFrame(resizeRafId);
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
      // Clear canvas
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      }
    };
  }, [mapState, geoData, worldData, handleBlockHover, handleBlockClick, handleDeselect, prefersReducedMotion,
      svgRef, canvasRef, containerRef, tooltipRef, rotationRef, rawRotationRef, scaleMultiplierRef, dragBoundsRef,
      tooltipBlockRef, bounceAnimRef, zoomAnimRef, uiStateRef]);

  return { renderRef, showTooltipRef, hideTooltipRef };
}
