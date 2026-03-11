"use client";

import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";

function getCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

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

      const tc = {
        tealBlue: getCssVar("--color-teal-blue"),
        amber: getCssVar("--color-bright-amber"),
        n950: getCssVar("--color-neutral-950"),
        n900: getCssVar("--color-neutral-900"),
        n700: getCssVar("--color-neutral-700"),
        n600: getCssVar("--color-neutral-600"),
      };

      function render() {
        const width = container!.clientWidth;
        const height = container!.clientHeight;
        const svg = d3.select(svgEl!);
        svg.attr("viewBox", `0 0 ${width} ${height}`);
        svg.selectAll("*").remove();

        const [clon, clat] = d3.geoCentroid(feature!);
        const bbox = d3.geoBounds(feature!);
        const lonSpan = bbox[1][0] - bbox[0][0];
        const latSpan = bbox[1][1] - bbox[0][1];
        const maxSpan = Math.max(lonSpan, latSpan, 2);

        // Scale so the block fills ~60% of the smaller dimension
        const fitDim = Math.min(width, height) * 0.6;
        const angularRad = maxSpan * (Math.PI / 180);
        const scale = fitDim / angularRad;

        const projection = d3
          .geoOrthographic()
          .clipAngle(90)
          .scale(scale)
          .rotate([-clon, -clat, 0])
          .translate([width / 2, height / 2]);

        const path = d3.geoPath(projection);

        const defs = svg.append("defs");

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
          svg.append("circle")
            .attr("cx", width / 2).attr("cy", height / 2)
            .attr("r", scale + 40)
            .attr("fill", "url(#detail-atmos)")
            .attr("pointer-events", "none");
        }

        // Globe disc
        svg.append("circle")
          .attr("cx", width / 2).attr("cy", height / 2)
          .attr("r", scale)
          .attr("fill", tc.n950);

        // Graticule
        const graticule = d3.geoGraticule().step([2, 2]);
        svg.append("path")
          .datum(graticule())
          .attr("d", path)
          .attr("fill", "none")
          .attr("stroke", tc.n700)
          .attr("stroke-width", 0.3)
          .attr("stroke-opacity", 0.35);

        // Land
        const land = topojson.feature(world, world.objects.land as GeometryCollection);
        svg.append("path")
          .datum(land)
          .attr("d", path)
          .attr("fill", tc.n900)
          .attr("stroke", tc.n600)
          .attr("stroke-width", 0.6);

        // Block polygon
        svg.append("path")
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

      const resizeObserver = new ResizeObserver(() => render());
      resizeObserver.observe(container!);

      return () => resizeObserver.disconnect();
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
            className="text-neutral-400 font-sans-body animate-pulse"
            style={{ fontSize: "var(--text-small)" }}
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
