/** Pure computation module for the topological flow field background.
 *  No React imports — generates tick mark data from a 2D vector field. */

interface Vec2 {
  x: number;
  y: number;
}

interface Obstacle {
  cx: number;
  cy: number;
  r: number;
}

export interface FlowFieldConfig {
  width: number;
  height: number;
  cellSize: number;
  noiseFreq: number;
  gashControlPoints: Vec2[];
  gashInfluenceRadius: number;
  gashMouthWidth: number;
  obstacles: Obstacle[];
  seed: number;
}

export interface TickMark {
  x: number;
  y: number;
  angle: number;
  length: number;
  distToGash: number;
  distToNearestObstacle: number;
}

// ---------------------------------------------------------------------------
// Simplex-like 2D noise (self-contained, deterministic via seed)
// ---------------------------------------------------------------------------

function buildPermTable(seed: number): Uint8Array {
  const p = new Uint8Array(512);
  for (let i = 0; i < 256; i++) p[i] = i;
  // Fisher-Yates shuffle with seeded LCG
  let s = seed | 0;
  for (let i = 255; i > 0; i--) {
    s = (s * 1664525 + 1013904223) | 0;
    const j = ((s >>> 0) % (i + 1)) | 0;
    const tmp = p[i];
    p[i] = p[j];
    p[j] = tmp;
  }
  for (let i = 0; i < 256; i++) p[i + 256] = p[i];
  return p;
}

const GRAD2: Vec2[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
  { x: 1, y: 1 },
  { x: -1, y: 1 },
  { x: 1, y: -1 },
  { x: -1, y: -1 },
];

function noise2D(perm: Uint8Array, x: number, y: number): number {
  const xi = Math.floor(x) & 255;
  const yi = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);

  const dot = (g: Vec2, dx: number, dy: number) => g.x * dx + g.y * dy;
  const g00 = GRAD2[perm[perm[xi] + yi] & 7];
  const g10 = GRAD2[perm[perm[xi + 1] + yi] & 7];
  const g01 = GRAD2[perm[perm[xi] + yi + 1] & 7];
  const g11 = GRAD2[perm[perm[xi + 1] + yi + 1] & 7];

  const n00 = dot(g00, xf, yf);
  const n10 = dot(g10, xf - 1, yf);
  const n01 = dot(g01, xf, yf - 1);
  const n11 = dot(g11, xf - 1, yf - 1);

  const nx0 = n00 + u * (n10 - n00);
  const nx1 = n01 + u * (n11 - n01);
  return nx0 + v * (nx1 - nx0);
}

function fbm2D(perm: Uint8Array, x: number, y: number, octaves: number): number {
  let val = 0;
  let amp = 1;
  let freq = 1;
  let max = 0;
  for (let i = 0; i < octaves; i++) {
    val += noise2D(perm, x * freq, y * freq) * amp;
    max += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return val / max;
}

// ---------------------------------------------------------------------------
// Catmull-Rom spline evaluation
// ---------------------------------------------------------------------------

function catmullRom(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number): Vec2 {
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x:
      0.5 *
      (2 * p1.x +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y:
      0.5 *
      (2 * p1.y +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  };
}

function catmullRomTangent(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number): Vec2 {
  const t2 = t * t;
  return {
    x:
      0.5 *
      (-p0.x + p2.x +
        (4 * p0.x - 10 * p1.x + 8 * p2.x - 2 * p3.x) * t +
        (-3 * p0.x + 9 * p1.x - 9 * p2.x + 3 * p3.x) * t2),
    y:
      0.5 *
      (-p0.y + p2.y +
        (4 * p0.y - 10 * p1.y + 8 * p2.y - 2 * p3.y) * t +
        (-3 * p0.y + 9 * p1.y - 9 * p2.y + 3 * p3.y) * t2),
  };
}

/** Find nearest point on the spline, returning distance and tangent angle. */
function nearestOnSpline(
  pts: Vec2[],
  px: number,
  py: number,
  w: number,
  h: number,
): { dist: number; tangentAngle: number } {
  let bestDist = Infinity;
  let bestAngle = 0;
  const samples = 12; // per segment

  for (let seg = 0; seg < pts.length - 1; seg++) {
    const p0 = pts[Math.max(0, seg - 1)];
    const p1 = pts[seg];
    const p2 = pts[Math.min(pts.length - 1, seg + 1)];
    const p3 = pts[Math.min(pts.length - 1, seg + 2)];

    for (let s = 0; s <= samples; s++) {
      const t = s / samples;
      const pt = catmullRom(p0, p1, p2, p3, t);
      const sx = pt.x * w;
      const sy = pt.y * h;
      const dx = px - sx;
      const dy = py - sy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < bestDist) {
        bestDist = dist;
        const tan = catmullRomTangent(p0, p1, p2, p3, t);
        bestAngle = Math.atan2(tan.y, tan.x);
      }
    }
  }
  return { dist: bestDist, tangentAngle: bestAngle };
}

// ---------------------------------------------------------------------------
// Gash mouth width: widens at endpoints, narrows in the middle
// ---------------------------------------------------------------------------

function gashWidthAtPoint(
  pts: Vec2[],
  px: number,
  py: number,
  w: number,
  h: number,
  baseRadius: number,
  mouthWidth: number,
): number {
  // Find parametric position along the spline (0 = start, 1 = end)
  let bestT = 0;
  let bestDist = Infinity;
  const totalSegs = pts.length - 1;
  const samples = 12;

  for (let seg = 0; seg < totalSegs; seg++) {
    const p0 = pts[Math.max(0, seg - 1)];
    const p1 = pts[seg];
    const p2 = pts[Math.min(pts.length - 1, seg + 1)];
    const p3 = pts[Math.min(pts.length - 1, seg + 2)];

    for (let s = 0; s <= samples; s++) {
      const t = s / samples;
      const pt = catmullRom(p0, p1, p2, p3, t);
      const dx = px - pt.x * w;
      const dy = py - pt.y * h;
      const dist = dx * dx + dy * dy;
      if (dist < bestDist) {
        bestDist = dist;
        bestT = (seg + t) / totalSegs;
      }
    }
  }

  // Mouth widens near endpoints (t=0 and t=1), narrows at center
  // Using a U-shaped curve: width = base + mouth * (1 - sin(pi * t))
  const mouthFactor = 1 - Math.sin(Math.PI * bestT);
  return baseRadius + mouthWidth * mouthFactor;
}

// ---------------------------------------------------------------------------
// Main computation
// ---------------------------------------------------------------------------

/** Default gash control points (normalized 0..1).
 *  Wide mouth top-left, shallow right, abrupt left turn, steep dive to center,
 *  sharp U-turn right, descends to exit bottom-right with wide mouth. */
export const DEFAULT_GASH_POINTS: Vec2[] = [
  { x: 0.03, y: 0.04 },  // Entry: wide mouth, upper-left
  { x: 0.35, y: 0.12 },  // Shallow rightward drift
  { x: 0.18, y: 0.28 },  // Abrupt left turn
  { x: 0.42, y: 0.52 },  // Steep dive past center
  { x: 0.55, y: 0.48 },  // Sharp U-turn begins
  { x: 0.72, y: 0.62 },  // Turns right, descending
  { x: 0.88, y: 0.82 },  // Steep descent toward exit
  { x: 0.97, y: 0.96 },  // Exit: wide mouth, bottom-right
];

// Tick mark visual constants — start subtle, adjust up if needed
const BASE_LENGTH = 7;       // px, standard tick
const GASH_LENGTH = 10;      // px, near the gash streamline
const BASE_ALPHA = 0.08;     // light mode baseline (subliminal)
const GASH_ALPHA = 0.14;     // light mode near gash
const NOISE_OCTAVES = 2;

export { BASE_ALPHA, GASH_ALPHA };

export function computeFlowField(config: FlowFieldConfig): TickMark[] {
  const {
    width,
    height,
    cellSize,
    noiseFreq,
    gashControlPoints,
    gashInfluenceRadius,
    gashMouthWidth,
    obstacles,
    seed,
  } = config;

  const perm = buildPermTable(seed);
  const marks: TickMark[] = [];

  const cols = Math.floor(width / cellSize);
  const rows = Math.floor(height / cellSize);
  const offsetX = (width - cols * cellSize) / 2;
  const offsetY = (height - rows * cellSize) / 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = offsetX + col * cellSize + cellSize / 2;
      const cy = offsetY + row * cellSize + cellSize / 2;

      // Check obstacle exclusion
      let minObstDist = Infinity;
      let insideObstacle = false;
      for (const obs of obstacles) {
        const dx = cx - obs.cx;
        const dy = cy - obs.cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < obs.r) {
          insideObstacle = true;
          break;
        }
        if (dist < minObstDist) minObstDist = dist;
      }
      if (insideObstacle) continue;

      // Base angle from noise
      let angle = fbm2D(perm, cx * noiseFreq, cy * noiseFreq, NOISE_OCTAVES) * Math.PI;

      // Gash influence
      const { dist: gashDist, tangentAngle } = nearestOnSpline(
        gashControlPoints,
        cx,
        cy,
        width,
        height,
      );

      const effectiveRadius = gashWidthAtPoint(
        gashControlPoints,
        cx,
        cy,
        width,
        height,
        gashInfluenceRadius,
        gashMouthWidth,
      );

      const sigma = effectiveRadius;
      const gashInfluence = Math.exp(-(gashDist * gashDist) / (2 * sigma * sigma));

      // Blend base noise angle toward gash tangent
      if (gashInfluence > 0.01) {
        // Wrap-safe angle blending
        let diff = tangentAngle - angle;
        while (diff > Math.PI) diff -= 2 * Math.PI;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        angle += diff * gashInfluence;
      }

      // Obstacle deflection (potential flow around cylinder)
      for (const obs of obstacles) {
        const dx = cx - obs.cx;
        const dy = cy - obs.cy;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);
        const influenceR = obs.r * 3;
        if (dist < influenceR && dist > obs.r) {
          const obsAngle = Math.atan2(dy, dx);
          const R2 = obs.r * obs.r;
          // Deflection strength falls off with distance
          const strength = R2 / distSq;
          // Push angle perpendicular to the obstacle direction
          const deflection = Math.sin(2 * (angle - obsAngle)) * strength;
          angle += deflection;
        }
      }

      // Tick mark length: longer near gash
      const length = BASE_LENGTH + (GASH_LENGTH - BASE_LENGTH) * gashInfluence;

      marks.push({
        x: cx,
        y: cy,
        angle,
        length,
        distToGash: gashDist,
        distToNearestObstacle: minObstDist,
      });
    }
  }

  return marks;
}
