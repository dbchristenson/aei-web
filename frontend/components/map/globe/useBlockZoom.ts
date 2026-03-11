"use client";

import { useEffect } from "react";
import gsap from "gsap";
import type { BlocksGeoJSON, MapState, UIState, DragBounds } from "./types";
import {
  INITIAL_ROTATION,
  LAMBDA_BOUNDS,
  PHI_BOUNDS,
  RUBBER_BAND_DIM,
  ZOOM_DURATION,
  ZOOM_EASE,
  ZOOMED_RUBBER_BAND_DIM,
  GLOBE_RADIUS_FACTOR,
  MIN_GLOBE_RADIUS,
} from "./constants";
import { getBlockZoomParams } from "./geo-utils";

export interface UseBlockZoomParams {
  uiState: UIState;
  geoData: BlocksGeoJSON | null;
  mapState: MapState;
  containerRef: React.RefObject<HTMLDivElement | null>;
  rotationRef: React.MutableRefObject<[number, number, number]>;
  rawRotationRef: React.MutableRefObject<[number, number]>;
  scaleMultiplierRef: React.MutableRefObject<number>;
  dragBoundsRef: React.MutableRefObject<DragBounds>;
  bounceAnimRef: React.MutableRefObject<gsap.core.Tween | null>;
  zoomAnimRef: React.MutableRefObject<gsap.core.Tween | null>;
  renderRef: React.MutableRefObject<(() => void) | null>;
  prefersReducedMotion: boolean;
}

export default function useBlockZoom({
  uiState, geoData, mapState,
  containerRef,
  rotationRef, rawRotationRef, scaleMultiplierRef, dragBoundsRef,
  bounceAnimRef, zoomAnimRef, renderRef,
  prefersReducedMotion,
}: UseBlockZoomParams): void {
  useEffect(() => {
    if (mapState !== "active" || !geoData || !containerRef.current) return;

    const doRender = () => renderRef.current?.();

    function killAnimations() {
      if (zoomAnimRef.current) {
        zoomAnimRef.current.kill();
        zoomAnimRef.current = null;
      }
      if (bounceAnimRef.current) {
        bounceAnimRef.current.kill();
        bounceAnimRef.current = null;
      }
    }

    if (uiState.mode === "selected" && uiState.blockId) {
      const feature = geoData.features.find((f) => f.id === uiState.blockId);
      if (!feature) return;

      killAnimations();

      const height = containerRef.current.clientHeight;
      const baseRadius = Math.max(height * GLOBE_RADIUS_FACTOR, MIN_GLOBE_RADIUS);
      const zoomParams = getBlockZoomParams(feature, baseRadius);

      if (prefersReducedMotion) {
        rotationRef.current = zoomParams.rotation;
        rawRotationRef.current = [zoomParams.rotation[0], zoomParams.rotation[1]];
        scaleMultiplierRef.current = zoomParams.scaleMultiplier;
        dragBoundsRef.current = {
          lambda: zoomParams.lambdaBounds,
          phi: zoomParams.phiBounds,
          rubberBandDim: ZOOMED_RUBBER_BAND_DIM,
        };
        doRender();
        return;
      }

      const animState = {
        lambda: rotationRef.current[0],
        phi: rotationRef.current[1],
        scale: scaleMultiplierRef.current,
        lbMin: dragBoundsRef.current.lambda[0],
        lbMax: dragBoundsRef.current.lambda[1],
        pbMin: dragBoundsRef.current.phi[0],
        pbMax: dragBoundsRef.current.phi[1],
        rbDim: dragBoundsRef.current.rubberBandDim,
      };

      zoomAnimRef.current = gsap.to(animState, {
        lambda: zoomParams.rotation[0],
        phi: zoomParams.rotation[1],
        scale: zoomParams.scaleMultiplier,
        lbMin: zoomParams.lambdaBounds[0],
        lbMax: zoomParams.lambdaBounds[1],
        pbMin: zoomParams.phiBounds[0],
        pbMax: zoomParams.phiBounds[1],
        rbDim: ZOOMED_RUBBER_BAND_DIM,
        duration: ZOOM_DURATION,
        ease: ZOOM_EASE,
        onUpdate: () => {
          rotationRef.current = [animState.lambda, animState.phi, 0];
          scaleMultiplierRef.current = animState.scale;
          dragBoundsRef.current = {
            lambda: [animState.lbMin, animState.lbMax],
            phi: [animState.pbMin, animState.pbMax],
            rubberBandDim: animState.rbDim,
          };
          doRender();
        },
        onComplete: () => {
          rawRotationRef.current = [zoomParams.rotation[0], zoomParams.rotation[1]];
          zoomAnimRef.current = null;
        },
      });
    } else if (uiState.mode === "idle" && scaleMultiplierRef.current > 1.05) {
      killAnimations();

      if (prefersReducedMotion) {
        rotationRef.current = INITIAL_ROTATION;
        rawRotationRef.current = [INITIAL_ROTATION[0], INITIAL_ROTATION[1]];
        scaleMultiplierRef.current = 1.0;
        dragBoundsRef.current = {
          lambda: LAMBDA_BOUNDS,
          phi: PHI_BOUNDS,
          rubberBandDim: RUBBER_BAND_DIM,
        };
        doRender();
        return;
      }

      const animState = {
        lambda: rotationRef.current[0],
        phi: rotationRef.current[1],
        scale: scaleMultiplierRef.current,
        lbMin: dragBoundsRef.current.lambda[0],
        lbMax: dragBoundsRef.current.lambda[1],
        pbMin: dragBoundsRef.current.phi[0],
        pbMax: dragBoundsRef.current.phi[1],
        rbDim: dragBoundsRef.current.rubberBandDim,
      };

      zoomAnimRef.current = gsap.to(animState, {
        lambda: INITIAL_ROTATION[0],
        phi: INITIAL_ROTATION[1],
        scale: 1.0,
        lbMin: LAMBDA_BOUNDS[0],
        lbMax: LAMBDA_BOUNDS[1],
        pbMin: PHI_BOUNDS[0],
        pbMax: PHI_BOUNDS[1],
        rbDim: RUBBER_BAND_DIM,
        duration: ZOOM_DURATION,
        ease: ZOOM_EASE,
        onUpdate: () => {
          rotationRef.current = [animState.lambda, animState.phi, 0];
          scaleMultiplierRef.current = animState.scale;
          dragBoundsRef.current = {
            lambda: [animState.lbMin, animState.lbMax],
            phi: [animState.pbMin, animState.pbMax],
            rubberBandDim: animState.rbDim,
          };
          doRender();
        },
        onComplete: () => {
          rawRotationRef.current = [INITIAL_ROTATION[0], INITIAL_ROTATION[1]];
          zoomAnimRef.current = null;
        },
      });
    }
  }, [uiState.mode, uiState.blockId, mapState, geoData, prefersReducedMotion,
      containerRef, rotationRef, rawRotationRef, scaleMultiplierRef, dragBoundsRef,
      bounceAnimRef, zoomAnimRef, renderRef]);
}
