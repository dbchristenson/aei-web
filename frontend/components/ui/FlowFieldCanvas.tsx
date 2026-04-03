"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  computeFlowField,
  DEFAULT_GASH_POINTS,
  BASE_ALPHA,
  GASH_ALPHA,
  type FlowFieldConfig,
  type TickMark,
} from "@/lib/flow-field";
import { getCssVar } from "@/lib/theme-utils";

interface FlowFieldCanvasProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  hoveredLogoIndex: number | null;
  logoPositions: { cx: number; cy: number; r: number }[];
}

const CELL_SIZE = 28;
const NOISE_FREQ = 0.004;
const GASH_INFLUENCE_RADIUS = 60;
const GASH_MOUTH_WIDTH = 50;
const OBSTACLE_PADDING = 20;
const HOVER_RADIUS = 80;
const HOVER_ALPHA_BOOST = 0.1; // alpha-only bump, no color change
const SEED = 42;
const MIN_WIDTH = 640; // hide on mobile

export default function FlowFieldCanvas({
  sectionRef,
  hoveredLogoIndex,
  logoPositions,
}: FlowFieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const marksRef = useRef<TickMark[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });

  const draw = useCallback(
    (hoveredIdx: number | null) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { w, h } = sizeRef.current;
      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const strokeColor = getCssVar("--color-border");

      const marks = marksRef.current;
      const hoveredPos =
        hoveredIdx !== null && logoPositions[hoveredIdx]
          ? logoPositions[hoveredIdx]
          : null;

      ctx.lineCap = "butt";
      ctx.lineWidth = 1;

      for (let i = 0; i < marks.length; i++) {
        const m = marks[i];
        const halfLen = m.length / 2;
        const cos = Math.cos(m.angle);
        const sin = Math.sin(m.angle);

        // Alpha: base interpolated toward gash alpha by proximity
        const gashSigma = GASH_INFLUENCE_RADIUS + GASH_MOUTH_WIDTH;
        const gashFactor = Math.exp(
          -(m.distToGash * m.distToGash) / (2 * gashSigma * gashSigma),
        );
        let alpha = BASE_ALPHA + (GASH_ALPHA - BASE_ALPHA) * gashFactor;

        // Hover: alpha-only boost, no color change
        if (hoveredPos) {
          const dx = m.x - hoveredPos.cx;
          const dy = m.y - hoveredPos.cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < HOVER_RADIUS) {
            const proximity = 1 - dist / HOVER_RADIUS;
            alpha += HOVER_ALPHA_BOOST * proximity;
          }
        }

        ctx.strokeStyle = strokeColor;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(m.x - cos * halfLen, m.y - sin * halfLen);
        ctx.lineTo(m.x + cos * halfLen, m.y + sin * halfLen);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    },
    [logoPositions],
  );

  // Compute field and size canvas
  const computeAndDraw = useCallback(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const rect = section.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    if (w < MIN_WIDTH) {
      canvas.style.display = "none";
      return;
    }
    canvas.style.display = "";

    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    sizeRef.current = { w, h };

    // Build obstacle list from logo positions
    const obstacles = logoPositions.map((lp) => ({
      cx: lp.cx,
      cy: lp.cy,
      r: lp.r + OBSTACLE_PADDING,
    }));

    const config: FlowFieldConfig = {
      width: w,
      height: h,
      cellSize: CELL_SIZE,
      noiseFreq: NOISE_FREQ,
      gashControlPoints: DEFAULT_GASH_POINTS,
      gashInfluenceRadius: GASH_INFLUENCE_RADIUS,
      gashMouthWidth: GASH_MOUTH_WIDTH,
      obstacles,
      seed: SEED,
    };

    marksRef.current = computeFlowField(config);
    draw(null);
  }, [sectionRef, logoPositions, draw]);

  // Initial compute + resize observer
  useEffect(() => {
    computeAndDraw();

    const section = sectionRef.current;
    if (!section) return;

    let timeout: ReturnType<typeof setTimeout>;
    const observer = new ResizeObserver(() => {
      clearTimeout(timeout);
      timeout = setTimeout(computeAndDraw, 150);
    });
    observer.observe(section);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [sectionRef, computeAndDraw]);

  // Repaint on hover change
  useEffect(() => {
    draw(hoveredLogoIndex);
  }, [hoveredLogoIndex, draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
