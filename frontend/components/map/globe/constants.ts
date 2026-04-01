// ─── Regional view constants ───

/** Default globe rotation centered on western Indonesia [lambda, phi, gamma] */
export const INITIAL_ROTATION: [number, number, number] = [-118, -2, 0];

/** Longitude bounds for regional drag (rotation-space) */
export const LAMBDA_BOUNDS: [number, number] = [-128, -105];

/** Latitude bounds for regional drag (rotation-space) */
export const PHI_BOUNDS: [number, number] = [-6, 4];

/** Rubber-band elasticity distance (degrees) for regional drag */
export const RUBBER_BAND_DIM = 18;

/** Maximum overshoot distance (degrees) before hard clamp */
export const MAX_OVERSHOOT = 15;

// ─── Zoom-to-block constants ───

/** Duration of zoom animation (seconds) */
export const ZOOM_DURATION = 1.0;

/** GSAP easing function for zoom */
export const ZOOM_EASE = "power2.inOut";

/** Graticule grid density at regional zoom [lon step, lat step] */
export const REGIONAL_GRATICULE_STEP: [number, number] = [10, 10];

/** Graticule grid density when zoomed to a block */
export const ZOOMED_GRATICULE_STEP: [number, number] = [2, 2];

/** Tighter rubber-band distance when zoomed to a block */
export const ZOOMED_RUBBER_BAND_DIM = 8;

/** Padding (degrees) around block centroid for zoomed drag bounds */
export const ZOOMED_DRAG_PADDING = 5;

// ─── Rendering constants ───

/** Minimum globe radius (px) to prevent globe from being too small */
export const MIN_GLOBE_RADIUS = 1200;

/** Globe radius multiplier relative to container height */
export const GLOBE_RADIUS_FACTOR = 2.5;

/** Target pixel size for a zoomed block polygon */
export const BLOCK_TARGET_PIXELS = 200;

/** Min/max scale multiplier for zoom-to-block */
export const ZOOM_SCALE_MIN = 3;
export const ZOOM_SCALE_MAX = 8;

/** Centroid dot radii */
export const DOT_RADIUS = 6;
export const DOT_GLOW_RADIUS = 12;
export const DOT_HOVER_RADIUS = 9;
export const DOT_HOVER_GLOW_RADIUS = 18;

/** D3 transition duration for dot hover (ms) */
export const DOT_TRANSITION_MS = 150;
