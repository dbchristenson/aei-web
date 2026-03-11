# Exploration Map — Implementation Notes (Mar 4, 2026)

## Overview

The Exploration Map (Section 5) is an interactive D3 orthographic globe showing AEI's five Indonesian exploration blocks. It was designed to match the visual style of the [Acun Medya globe](https://acunmedya.com/tr) — an oversized, draggable sphere with glowing point markers and subtle land outlines against a dark background.

## Architecture

Three components work together:

| Component | Purpose |
|---|---|
| `ExplorationMapLoader.tsx` | `"use client"` wrapper with `next/dynamic({ ssr: false })` — prevents D3 from running during SSR |
| `ExplorationMap.tsx` | Core globe: D3 rendering, drag rotation, auto-rotation, tooltips, selection state |
| `BlockInfoPanel.tsx` | Left-side info card showing block details on hover/select |

Data files served as static assets from `public/data/`:
- `blocks.geojson` — 5 exploration blocks (MultiPolygon geometries + properties)
- `indonesia-10m.json` — Natural Earth 10m TopoJSON (Indonesia only, land object)

## Design Choices

### Globe Positioning & Scale
The globe center sits at **66% from the left edge**, bleeding off the right side of the viewport. Globe radius is `max(containerHeight * 0.6, 280px)`, making it intentionally oversized. This matches the reference design's bold, immersive feel — the globe is a backdrop, not a contained widget.

### Seven-Layer Rendering
Layers are drawn bottom-to-top in a single SVG:

1. **Atmosphere halo** — radial gradient in teal-blue, fading to transparent
2. **Globe disc** — solid dark circle (neutral-950) with faint border
3. **Graticule** — 20-degree grid, very low opacity (0.35), reinforces spherical form
4. **Land masses** — neutral-900 fill with neutral-600 outlines; intentionally dark and recessive
5. **Country borders** — hairline strokes at 0.25px, 50% opacity
6. **Block polygons** — amber at 8% fill opacity; barely visible until hovered
7. **Centroid dots** — amber circles with a glow filter; the primary interactive element

### Color System
All colors are read from CSS custom properties at runtime via `getComputedStyle()`. This avoids importing `theme.config.ts` (which resolves `../theme.json` — a path Turbopack cannot follow into client component bundles). The pattern:

```typescript
function getCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
```

### Interactions

**Drag to rotate** — D3 drag behavior attached to the container div (not the SVG, which gets cleared on re-render). Sensitivity is 0.4; vertical rotation clamped to +/-60 degrees.

**Auto-rotation** — ~3 degrees/second using `requestAnimationFrame` with delta-time. Pauses while dragging, resumes on release. Fully disabled when `prefers-reduced-motion` is active.

**Hover** — Dot enlarges (6px to 9px) with glow expansion. A glass-style tooltip follows the cursor showing the block name. The BlockInfoPanel also updates live.

**Click to select** — Locks the selection; dot turns coral-glow and enlarges to 10px. Click again or press Escape to deselect.

### Pointer-Events Layering
The info panel overlays the globe but must not block drag or hover. Solved with:
- Info panel wrapper: `pointer-events-none`
- Info panel card: `pointer-events-auto`
- Keyboard button overlay: `pointer-events-none`
- Individual keyboard buttons: `pointer-events-auto`

### GeoJSON Winding Order Fix
The source block GeoJSON used counter-clockwise winding (RFC 7946 standard), but D3's spherical geometry interprets CCW exterior rings as the complement — filling the entire globe instead of the small polygon. All exterior rings were reversed to clockwise during the build process. This also fixed centroid calculations, which were returning antipodal points (Brazil instead of Indonesia).

### Accessibility
- Invisible `<button>` elements positioned at each block's centroid, sorted alphabetically for predictable tab order
- `aria-label`: "Block Name — Basin Name"
- `aria-pressed` on selected block
- `aria-live="polite"` on the info panel content region
- `prefers-reduced-motion` suppresses all animation and transitions

## Room for Polish

### Visual Refinements
- **Tooltip background** is hardcoded as `rgba(22, 37, 33, 0.85)` — should use the glass-dark token from `theme.json` for consistency
- **Dot pulse animation** — the reference design has a subtle pulsing glow on idle dots; ours are static
- **Land fill** could be slightly more transparent to better match the ghostly outline-only look of the reference
- **Globe edge highlight** — a thin bright stroke on the globe's silhouette edge would add depth
- **Mobile layout** — currently the globe and panel stack, but the globe is very tall; could reduce globe radius on small screens

### Missing Features
- **Fly-to on select** — clicking a block should smoothly rotate the globe to center that block. Currently the globe stays at its current rotation.
- **Zoom control** — no way to zoom in/out; scale is fixed. Scroll-wheel zoom or pinch zoom would help exploration.
- **Block filtering** — no UI to filter by status (Active vs. Under Development) or basin
- **Legend** — no visual legend explaining what the dots and polygon fills represent
- **Block area labels** — only the centroid dot is labeled; the polygon boundary has no on-map label
- **Touch support** — drag works via D3's touch event handling, but has not been tested on actual mobile devices
- **Loading skeleton** — the pulsing grid is functional but could be replaced with a silhouette globe outline for a more polished feel

### Content Additions
- **Block data enrichment** — each block currently has name, basin, status, and a short description. Future data could include: area (km2), operator name, license expiry date, key wells, and resource estimates.
- **Basin-level grouping** — Gaea, Gaea II, and Palu are all in the Bintuni Basin; a visual grouping or cluster indicator would help communicate this.
- **CTA in info panel** — the panel could include a "Request Block Details" button linking to the contact page, converting interest into inquiries.

### Performance
- `render()` is called on every animation frame during auto-rotation and drag. On low-end devices this could cause jank. Consider throttling or using Canvas instead of SVG for smoother performance.
- The full 110m TopoJSON is ~105KB; a simplified version with only Asia-Pacific land masses would reduce load time.
- No error boundary wraps the D3 rendering — a crash would leave a blank section with no feedback.

### Code Quality
- Drag sensitivity (0.4), auto-rotation speed (0.003), and globe position (0.66) are magic numbers — could be extracted to named constants or component props
- `topojson-client` is used as a transitive dependency of plotly.js but not declared in `package.json` — should be added explicitly
- The keyboard button positions are set to `-999px` in JSX and never updated to actual projected coordinates — they need a positioning effect that syncs with the current projection state
