"use client";

import { useEffect, useState } from "react";
// TODO: Import Plot from react-plotly.js via next/dynamic with ssr: false
// import dynamic from "next/dynamic";
// const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface InsightChartProps {
  dataPath: string;
  title?: string;
  caption?: string;
}

interface PlotlyData {
  data: Record<string, unknown>[];
  layout: Record<string, unknown>;
}

type ChartState = "loading" | "error" | "loaded";

export default function InsightChart({
  dataPath,
  title,
  caption,
}: InsightChartProps) {
  const [state, setState] = useState<ChartState>("loading");
  const [chartData, setChartData] = useState<PlotlyData | null>(null);

  useEffect(() => {
    // TODO: Fetch Plotly JSON from dataPath when component enters viewport
    fetch(dataPath)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch chart data");
        return res.json() as Promise<PlotlyData>;
      })
      .then((data) => {
        setChartData(data);
        setState("loaded");
      })
      .catch(() => {
        setState("error");
      });
  }, [dataPath]);

  return (
    <div className="glass-card-dark p-6">
      {title && (
        <h3
          className="font-sans-header font-semibold text-neutral-50 mb-4"
          style={{ fontSize: "var(--text-h4)" }}
        >
          {title}
        </h3>
      )}

      {state === "loading" && (
        <div
          className="bg-neutral-800 rounded-[var(--radius-card)] animate-pulse"
          style={{ aspectRatio: "16/9" }}
        />
      )}

      {state === "error" && (
        <div
          className="flex items-center justify-center bg-neutral-800 rounded-[var(--radius-card)]"
          style={{ aspectRatio: "16/9" }}
        >
          <p className="text-neutral-400 font-sans-body">
            Chart data unavailable
          </p>
        </div>
      )}

      {state === "loaded" && chartData && (
        // TODO: Replace with <Plot data={chartData.data} layout={chartData.layout}
        //   config={{ displayModeBar: false, responsive: true }} />
        <div
          className="bg-neutral-800 rounded-[var(--radius-card)] flex items-center justify-center"
          style={{ aspectRatio: "16/9" }}
        >
          <p className="text-neutral-400 font-sans-body">
            Chart loaded (Plotly render pending)
          </p>
        </div>
      )}

      {caption && (
        <p
          className="mt-3 text-neutral-400 font-sans-body"
          style={{ fontSize: "var(--text-xs)" }}
        >
          {caption}
        </p>
      )}
    </div>
  );
}
