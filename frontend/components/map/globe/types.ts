import type { BlockProperties } from "../BlockInfoPanel";

export type { BlockProperties };

export type MapState = "loading" | "error" | "empty" | "active";
export type InteractionMode = "idle" | "hovered" | "selected";

export interface UIState {
  blockId: string | null;
  mode: InteractionMode;
}

export interface BlockFeature extends GeoJSON.Feature<GeoJSON.MultiPolygon | GeoJSON.Polygon> {
  id: string;
  properties: BlockProperties;
}

export interface BlocksGeoJSON {
  type: "FeatureCollection";
  features: BlockFeature[];
}

export interface DragBounds {
  lambda: [number, number];
  phi: [number, number];
  rubberBandDim: number;
}
