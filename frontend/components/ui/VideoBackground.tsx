"use client";

import { useState, useEffect } from "react";
import { getVideo } from "@/lib/media";
import type { VideoKey } from "@/lib/media";

interface VideoBackgroundProps {
  videoKey: VideoKey;
  overlay?: "vignette" | "darken" | "none";
  overlayClassName?: string;
  className?: string;
}

const OVERLAY_CLASSES: Record<string, string> = {
  vignette:
    "bg-gradient-to-b from-neutral-950/10 via-transparent to-neutral-950/90",
  darken: "bg-neutral-950/50",
};

export default function VideoBackground({
  videoKey,
  overlay = "none",
  overlayClassName,
  className = "",
}: VideoBackgroundProps) {
  const [prefersReduced, setPrefersReduced] = useState(false);
  const { videoUrl, posterUrl } = getVideo(videoKey);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {prefersReduced ? (
        <img
          src={posterUrl}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={posterUrl}
          className="h-full w-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
      {overlay !== "none" && (
        <div
          className={`absolute inset-0 pointer-events-none ${
            overlayClassName ?? OVERLAY_CLASSES[overlay] ?? ""
          }`}
        />
      )}
    </div>
  );
}
