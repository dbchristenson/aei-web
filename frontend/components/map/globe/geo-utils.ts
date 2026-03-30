import { geoCentroid as d3GeoCentroid, geoBounds } from "d3-geo";
import type { BlockFeature } from "./types";
import {
  MAX_OVERSHOOT,
  ZOOMED_DRAG_PADDING,
  BLOCK_TARGET_PIXELS,
  ZOOM_SCALE_MIN,
  ZOOM_SCALE_MAX,
} from "./constants";

/** iOS-style rubber-band clamping: allows elastic overshoot then snaps back. */
export function rubberBand(value: number, min: number, max: number, dim: number): number {
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

/** Compute the centroid of a GeoJSON feature in [lon, lat]. */
export function geoCentroid(feature: GeoJSON.Feature): [number, number] {
  return d3GeoCentroid(feature);
}

/** Compute per-block zoom parameters: rotation, scale multiplier, and tightened drag bounds. */
export function getBlockZoomParams(
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

  const bbox = geoBounds(feature);
  const lonSpan = bbox[1][0] - bbox[0][0];
  const latSpan = bbox[1][1] - bbox[0][1];
  const maxSpan = Math.max(lonSpan, latSpan);

  const angularRad = maxSpan * (Math.PI / 180);
  const idealScale = BLOCK_TARGET_PIXELS / angularRad;
  const multiplier = Math.min(Math.max(idealScale / baseScale, ZOOM_SCALE_MIN), ZOOM_SCALE_MAX);

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
