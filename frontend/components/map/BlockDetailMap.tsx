"use client";

import { useRef, useEffect, useState } from "react";
import { select } from "d3-selection";
import { geoOrthographic, geoPath, geoCentroid, geoBounds, geoGraticule } from "d3-geo";
import { feature as topoFeature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { GeoPermissibleObjects } from "d3-geo";
import { getCssVar } from "@/lib/theme-utils";

interface BlockDetailMapProps {
  blockId: string;
}

export default function BlockDetailMap({ blockId }: BlockDetailMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const svgEl = svgRef.current;
    if (!container || !svgEl) return;

    let cancelled = false;

    Promise.all([
      fetch("/data/blocks.geojson").then((r) => r.json()),
      fetch("/data/indonesia-10m.json").then((r) => r.json()),
    ]).then(([blocksGeo, world]: [GeoJSON.FeatureCollection, Topology]) => {
      if (cancelled) return;

      const feature = blocksGeo.features.find(
        (f: GeoJSON.Feature) => f.id === blockId || f.properties?.id === blockId
      );
      if (!feature) return;

      setLoaded(true);

      // Pre-compute land once (avoid re-parsing topology on every render)
      const land = topoFeature(world, world.objects.land as GeometryCollection);
      let resizeRafId: number | null = null;

      function render() {
        const s = getComputedStyle(document.documentElement);
        const v = (name: string) => s.getPropertyValue(name).trim();
        const tc = {
          tealBlue: v("--color-primary"),
          amber: v("--color-accent"),
          n950: v("--color-bg"),
          n900: v("--color-bg-subtle"),
          n700: v("--color-surface-hover"),
          n600: v("--color-border"),
        };
        const width = container!.clientWidth;
        const height = container!.clientHeight;
        const svgSel = select(svgEl!);
        svgSel.attr("viewBox", `0 0 ${width} ${height}`);
        svgSel.selectAll("*").remove();

        const [clon, clat] = geoCentroid(feature!);
        const bbox = geoBounds(feature!);
        const lonSpan = bbox[1][0] - bbox[0][0];
        const latSpan = bbox[1][1] - bbox[0][1];
        const maxSpan = Math.max(lonSpan, latSpan, 2);

        // Scale so the block fills ~60% of the smaller dimension
        const fitDim = Math.min(width, height) * 0.6;
        const angularRad = maxSpan * (Math.PI / 180);
        const scale = fitDim / angularRad;

        const projection = geoOrthographic()
          .clipAngle(90)
          .scale(scale)
          .rotate([-clon, -clat, 0])
          .translate([width / 2, height / 2]);

        const path = geoPath(projection);

        const defs = svgSel.append("defs");

        // Atmosphere glow
        const atmosGradient = defs
          .append("radialGradient")
          .attr("id", "detail-atmos")
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("cx", width / 2)
          .attr("cy", height / 2)
          .attr("r", scale + 40);
        atmosGradient.append("stop").attr("offset", "75%").attr("stop-color", tc.tealBlue).attr("stop-opacity", 0.06);
        atmosGradient.append("stop").attr("offset", "90%").attr("stop-color", tc.tealBlue).attr("stop-opacity", 0.12);
        atmosGradient.append("stop").attr("offset", "100%").attr("stop-color", tc.tealBlue).attr("stop-opacity", 0);

        // Block glow filter
        const blockGlow = defs.append("filter").attr("id", "detail-block-glow").attr("x", "-30%").attr("y", "-30%").attr("width", "160%").attr("height", "160%");
        blockGlow.append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", "6").attr("result", "blur");
        blockGlow.append("feMerge").selectAll("feMergeNode").data(["blur", "SourceGraphic"]).join("feMergeNode").attr("in", (d) => d);

        // Atmosphere
        if (scale + 40 < Math.max(width, height)) {
          svgSel.append("circle")
            .attr("cx", width / 2).attr("cy", height / 2)
            .attr("r", scale + 40)
            .attr("fill", "url(#detail-atmos)")
            .attr("pointer-events", "none");
        }

        // Globe disc
        svgSel.append("circle")
          .attr("cx", width / 2).attr("cy", height / 2)
          .attr("r", scale)
          .attr("fill", tc.n950);

        // Graticule
        const graticule = geoGraticule().step([2, 2]);
        svgSel.append("path")
          .datum(graticule())
          .attr("d", path)
          .attr("fill", "none")
          .attr("stroke", tc.n700)
          .attr("stroke-width", 0.3)
          .attr("stroke-opacity", 0.35);

        // Land
        svgSel.append("path")
          .datum(land as GeoPermissibleObjects)
          .attr("d", path)
          .attr("fill", tc.n900)
          .attr("stroke", tc.n600)
          .attr("stroke-width", 0.6);

        // Block polygon
        svgSel.append("path")
          .datum(feature!)
          .attr("d", path)
          .attr("fill-rule", "evenodd")
          .attr("fill", tc.amber)
          .attr("fill-opacity", 0.25)
          .attr("stroke", tc.tealBlue)
          .attr("stroke-width", 2)
          .attr("stroke-opacity", 0.9)
          .attr("filter", "url(#detail-block-glow)");
      }

      render();

      // Coalesce resize events via rAF
      const resizeObserver = new ResizeObserver(() => {
        if (resizeRafId !== null) cancelAnimationFrame(resizeRafId);
        resizeRafId = requestAnimationFrame(() => {
          resizeRafId = null;
          render();
        });
      });
      resizeObserver.observe(container!);

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
        if (resizeRafId !== null) cancelAnimationFrame(resizeRafId);
        resizeObserver.disconnect();
        themeObserver.disconnect();
      };
    });

    return () => {
      cancelled = true;
    };
  }, [blockId]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p
            className="text-fg-muted font-body animate-pulse text-small"
          >
            Loading map&hellip;
          </p>
        </div>
      )}
      <svg
        ref={svgRef}
        className={`w-full h-full ${!loaded ? "hidden" : ""}`}
        role="img"
        aria-label="Map showing exploration block location"
      />
    </div>
  );
}
