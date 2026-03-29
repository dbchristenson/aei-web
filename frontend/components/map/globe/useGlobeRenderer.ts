"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import gsap from "gsap";
import type { Topology, GeometryCollection } from "topojson-specification";
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
  containerRef: React.RefObject<HTMLDivElement | null>;
  tooltipRef: React.RefObject<HTMLDivElement | null>;
  geoData: BlocksGeoJSON | null;
  worldData: Topology | null;
  terrainData: Topology | null;
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

export default function useGlobeRenderer({
  svgRef, containerRef, tooltipRef,
  geoData, worldData, terrainData, mapState,
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

    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    if (!container) return;

    let tc = getThemeColors();
    let initialized = false;

    const projection = d3.geoOrthographic().clipAngle(90);

    // Pre-compute land topology once
    const landFeature = topojson.feature(
      worldData,
      worldData.objects.land as GeometryCollection
    );

    // Pre-compute terrain elevation bands as merged FeatureCollections.
    // Each band becomes a single <path> (3 total) for fast drag re-projection.
    // The land clipPath prevents any orthographic clipping artifacts from showing.
    const terrainBands = terrainData ? (() => {
      const allFeatures = topojson.feature(
        terrainData,
        terrainData.objects.data as GeometryCollection
      ) as GeoJSON.FeatureCollection;

      const byBand = (band: string): GeoJSON.FeatureCollection => ({
        type: "FeatureCollection",
        features: allFeatures.features.filter((f) => f.properties?.band === band),
      });

      return {
        low: byBand("low"),
        medium: byBand("medium"),
        high: byBand("high"),
      };
    })() : null;

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

    showTooltipRef.current = showTooltip;
    hideTooltipRef.current = hideTooltip;

    // ─── Full render: creates all DOM elements (initial, resize, theme change) ───
    function renderFull() {
      tc = getThemeColors();
      const { width, height, globeRadius } = updateProjection();
      const path = d3.geoPath(projection);

      svg.attr("viewBox", `0 0 ${width} ${height}`);
      svg.selectAll("*").remove();

      const defs = svg.append("defs");

      // Atmosphere glow gradient
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

      // Layer 1: Atmosphere halo (always created, hidden when globe overflows)
      svg.append("circle")
        .attr("class", "atmos-halo")
        .attr("cx", cx).attr("cy", cy)
        .attr("r", globeRadius + 40)
        .attr("fill", "url(#atmos-glow)")
        .attr("pointer-events", "none")
        .attr("display", globeRadius + 40 < Math.max(width, height) ? null : "none");

      // Layer 2: Globe disc (ocean)
      svg.append("circle")
        .attr("class", "globe-disc")
        .attr("cx", cx).attr("cy", cy)
        .attr("r", globeRadius)
        .attr("fill", tc.n950);

      // Layer 3: Graticule
      const zoomT = Math.min((scaleMultiplierRef.current - 1) / 4, 1);
      const gratStep: [number, number] = [
        REGIONAL_GRATICULE_STEP[0] + zoomT * (ZOOMED_GRATICULE_STEP[0] - REGIONAL_GRATICULE_STEP[0]),
        REGIONAL_GRATICULE_STEP[1] + zoomT * (ZOOMED_GRATICULE_STEP[1] - REGIONAL_GRATICULE_STEP[1]),
      ];
      const graticule = d3.geoGraticule().step(gratStep);
      svg.append("path")
        .attr("class", "graticule-path")
        .datum(graticule())
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", tc.n700)
        .attr("stroke-width", 0.3)
        .attr("stroke-opacity", 0.35);

      // Layer 4: Land masses (base fill, visible where terrain has gaps)
      svg.append("path")
        .attr("class", "land-path")
        .datum(landFeature)
        .attr("d", path)
        .attr("fill", tc.n900)
        .attr("stroke", tc.n600)
        .attr("stroke-width", 0.6);

      // Layer 4b: Terrain elevation bands (low → medium → high, painted bottom-up).
      // Each polygon is its own <path> to avoid D3 orthographic clipping artefacts.
      // Terrain is clipped to the land boundary so it never bleeds into ocean.
      if (terrainBands) {
        // Create clipPath from land geometry so terrain stays within coastlines
        const landClip = defs.append("clipPath").attr("id", "land-clip");
        landClip.append("path").datum(landFeature).attr("d", path);

        const terrainGroup = svg.append("g")
          .attr("class", "terrain-layer")
          .attr("clip-path", "url(#land-clip)");

        // One <path> per band (3 total) — fast to re-project during drag
        terrainGroup.append("path")
          .attr("class", "terrain-low")
          .datum(terrainBands.low)
          .attr("d", path)
          .attr("fill", tc.terrainLow)
          .attr("stroke", "none");
        terrainGroup.append("path")
          .attr("class", "terrain-medium")
          .datum(terrainBands.medium)
          .attr("d", path)
          .attr("fill", tc.terrainMed)
          .attr("stroke", "none");
        terrainGroup.append("path")
          .attr("class", "terrain-high")
          .datum(terrainBands.high)
          .attr("d", path)
          .attr("fill", tc.terrainHigh)
          .attr("stroke", "none");
      }

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

      updateTooltipPosition();

      // Layer 6: Centroid dots — create ALL dots (hidden ones get display:none)
      const dotsGroup = svg.append("g").attr("class", "dots-layer");

      geoData!.features.forEach((feature) => {
        const center = geoCentroid(feature);
        const projected = projection(center);
        const dist = d3.geoDistance(center, [
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
            d3.select(this)
              .transition().duration(prefersReducedMotion ? 0 : DOT_TRANSITION_MS)
              .attr("r", DOT_HOVER_RADIUS)
              .attr("fill-opacity", 1);
            svg.select(`.dot-glow-${feature.id}`)
              .transition().duration(prefersReducedMotion ? 0 : DOT_TRANSITION_MS)
              .attr("r", DOT_HOVER_GLOW_RADIUS)
              .attr("fill-opacity", 0.3);
          })
          .on("mouseleave", function () {
            handleBlockHover(null);
            hideTooltip();
            d3.select(this)
              .transition().duration(prefersReducedMotion ? 0 : DOT_TRANSITION_MS)
              .attr("r", DOT_RADIUS)
              .attr("fill-opacity", 0.85);
            svg.select(`.dot-glow-${feature.id}`)
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

    // ─── Transform render: updates positions only (drag, zoom frames) ───
    // Skips DOM teardown/rebuild — only updates projection-dependent attributes.
    function renderTransform() {
      if (!initialized) { renderFull(); return; }

      const { width, height, globeRadius } = updateProjection();
      const path = d3.geoPath(projection);
      const [cx, cy] = projection.translate();

      svg.attr("viewBox", `0 0 ${width} ${height}`);

      // Update gradient position + radius
      svg.select("#atmos-glow")
        .attr("cx", cx).attr("cy", cy).attr("r", globeRadius + 40);

      // Update atmosphere halo
      svg.select(".atmos-halo")
        .attr("cx", cx).attr("cy", cy).attr("r", globeRadius + 40)
        .attr("display", globeRadius + 40 < Math.max(width, height) ? null : "none");

      // Update globe disc
      svg.select(".globe-disc")
        .attr("cx", cx).attr("cy", cy).attr("r", globeRadius);

      // Update graticule (step changes with zoom level)
      const zoomT = Math.min((scaleMultiplierRef.current - 1) / 4, 1);
      const gratStep: [number, number] = [
        REGIONAL_GRATICULE_STEP[0] + zoomT * (ZOOMED_GRATICULE_STEP[0] - REGIONAL_GRATICULE_STEP[0]),
        REGIONAL_GRATICULE_STEP[1] + zoomT * (ZOOMED_GRATICULE_STEP[1] - REGIONAL_GRATICULE_STEP[1]),
      ];
      svg.select<SVGPathElement>(".graticule-path")
        .datum(d3.geoGraticule().step(gratStep)())
        .attr("d", path);

      // Update land — datum already bound from renderFull, just re-project
      svg.select(".land-path").attr("d", path as unknown as null);

      // Update land clip mask + terrain bands (4 paths total — fast)
      svg.select("#land-clip path").attr("d", path as unknown as null);
      if (terrainBands) {
        svg.select(".terrain-low").attr("d", path as unknown as null);
        svg.select(".terrain-medium").attr("d", path as unknown as null);
        svg.select(".terrain-high").attr("d", path as unknown as null);
      }

      // Update block polygons (geometry only — styling managed by ExplorationMap uiState effect)
      svg.selectAll<SVGPathElement, BlockFeature>(".block-area").attr("d", path);

      // Update dot positions + visibility
      geoData!.features.forEach((feature) => {
        const center = geoCentroid(feature);
        const projected = projection(center);
        const dist = d3.geoDistance(center, [
          -rotationRef.current[0],
          -rotationRef.current[1],
        ]);
        const visible = dist <= Math.PI / 2 && projected != null;
        const px = visible ? projected![0] : 0;
        const py = visible ? projected![1] : 0;

        svg.select(`.dot-${feature.id}`)
          .attr("cx", px).attr("cy", py)
          .attr("display", visible ? null : "none");

        svg.select(`.dot-glow-${feature.id}`)
          .attr("cx", px).attr("cy", py)
          .attr("display", visible ? null : "none");
      });

      updateTooltipPosition();
    }

    // External callers (useBlockZoom) get the fast path
    renderRef.current = renderTransform;

    // ─── Drag-to-rotate with elastic bounded drag ───
    const containerSel = d3.select(container);
    const dragBehavior = d3.drag<HTMLDivElement, unknown>()
      .on("start", () => {
        if (zoomAnimRef.current) return;
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
        renderTransform();
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
              },
            });
          }
        }
      });

    containerSel.call(dragBehavior);
    containerSel.style("cursor", "grab");

    containerSel.on("dblclick", () => {
      handleDeselect();
    });

    // Initial full render
    renderFull();

    // Resize → full render (container dimensions changed)
    const resizeObserver = new ResizeObserver(() => {
      renderFull();
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
  }, [mapState, geoData, worldData, terrainData, handleBlockHover, handleBlockClick, handleDeselect, prefersReducedMotion,
      svgRef, containerRef, tooltipRef, rotationRef, rawRotationRef, scaleMultiplierRef, dragBoundsRef,
      tooltipBlockRef, bounceAnimRef, zoomAnimRef, uiStateRef]);

  return { renderRef, showTooltipRef, hideTooltipRef };
}
