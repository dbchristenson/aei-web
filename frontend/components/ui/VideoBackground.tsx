"use client";

import { getVideo } from "@/lib/media";
import type { VideoKey } from "@/lib/media";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

interface VideoBackgroundProps {
  videoKey: VideoKey;
  overlay?: "vignette" | "darken" | "none";
  overlayClassName?: string;
  className?: string;
}

const OVERLAY_CLASSES: Record<string, string> = {
  vignette:
    "video-overlay-vignette",
  darken:
    "video-overlay-darken",
};

export default function VideoBackground({
  videoKey,
  overlay = "none",
  overlayClassName,
  className = "",
}: VideoBackgroundProps) {
  const prefersReduced = usePrefersReducedMotion();
  const { videoUrl, posterUrl } = getVideo(videoKey);

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {prefersReduced ? (
        // eslint-disable-next-line @next/next/no-img-element
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
