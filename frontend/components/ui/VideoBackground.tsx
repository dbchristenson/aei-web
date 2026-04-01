"use client";

import Image from "next/image";
import { getVideo } from "@/lib/media";
import type { VideoKey } from "@/lib/media";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

interface VideoBackgroundProps {
  videoKey: VideoKey;
  overlay?: "vignette" | "darken" | "none";
  overlayClassName?: string;
  className?: string;
  priority?: boolean;
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
  priority = false,
}: VideoBackgroundProps) {
  const prefersReduced = usePrefersReducedMotion();
  const { videoUrl, posterUrl } = getVideo(videoKey);

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {prefersReduced ? (
        <Image
          src={posterUrl}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      ) : (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload={priority ? "auto" : "metadata"}
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
