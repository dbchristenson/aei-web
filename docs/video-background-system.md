# Video Background System

## Overview
A centralized system for managing background videos on the AEI website hero sections. Videos are hosted on Cloudinary with local poster images as fallbacks for low-bandwidth users. Swapping which video plays in each section requires changing a single variable.

## Architecture

### Video Registry (`frontend/lib/media.ts`)
Single source of truth for all video assets. Contains:

- **`VideoKey`** — TypeScript union type of all available video identifiers (e.g., `"bali_beach" | "bali_cliffs" | ...`). Adding a new video means adding a literal to this union.
- **`VIDEO_REGISTRY`** — `Record<VideoKey, { videoUrl: string; posterUrl: string }>` mapping each key to its Cloudinary URL and local poster image path.
- **`HERO_SPLASH_VIDEO`** / **`HERO_BANNER_VIDEO`** — The two config variables. Change these to swap videos.
- **`getVideo(key: VideoKey)`** — Helper that returns the `{ videoUrl, posterUrl }` pair.

### VideoBackground Component (`frontend/components/ui/VideoBackground.tsx`)
Reusable `"use client"` component that renders an absolutely-positioned video filling its parent container.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `videoKey` | `VideoKey` | required | Key into `VIDEO_REGISTRY` |
| `overlay` | `"vignette" \| "darken" \| "none"` | `"none"` | Gradient overlay preset |
| `overlayClassName` | `string` | — | Custom overlay classes (overrides preset) |
| `className` | `string` | `""` | Additional classes on wrapper |

**Behavior:**
- Renders `<video autoPlay muted loop playsInline poster={posterUrl}>` with `object-cover`
- Detects `prefers-reduced-motion` via `matchMedia` — swaps `<video>` for `<img>` of poster
- Overlay presets: `vignette` = dark gradient top/bottom, `darken` = uniform semi-transparent
- `aria-hidden="true"` — purely decorative, no accessibility impact
- No `next/dynamic` needed — native `<video>` is lightweight; browser handles progressive loading

**Parent requirements:** Parent element must have `relative` and `overflow-hidden` positioning.

### Integration Points

**HeroSplash** (`frontend/components/sections/HeroSplash.tsx`):
- Replace the animated gradient blob `<div>` elements with `<VideoBackground videoKey={HERO_SPLASH_VIDEO} overlay="vignette" />`
- Keep `bg-neutral-950` on the `<section>` as a pre-load background color
- All GSAP ScrollTrigger animations, logo, scroll indicator are unaffected

**HeroBanner** (`frontend/components/sections/HeroBanner.tsx`):
- Replace the radial gradient background with `<VideoBackground videoKey={HERO_BANNER_VIDEO} overlay="darken" />`
- Add `overflow-hidden` to the `<section>` to contain the absolute video
- GlassCard content is already `relative`, so it stacks above the video naturally

## Video Assets

### Cloudinary URLs (from `docs/videos.md`)
| Key | Cloudinary URL |
|-----|---------------|
| `bali_beach` | `https://res.cloudinary.com/dozfjnnca/video/upload/v1772652283/bali_beach_dhta8q.mp4` |
| `bali_cliffs` | `https://res.cloudinary.com/dozfjnnca/video/upload/v1772652282/bali_cliffs_nhcl6f.mp4` |
| `beach_populated` | `https://res.cloudinary.com/dozfjnnca/video/upload/v1772652285/beach_populated_axqebb.mp4` |
| `bromo_volcano` | `https://res.cloudinary.com/dozfjnnca/video/upload/v1772652284/bromo_volcano_kdyl7g.mp4` |
| `jakarta_roundie` | `https://res.cloudinary.com/dozfjnnca/video/upload/v1772652285/jakarta_roundie_xbxhmq.mp4` |
| `surabaya_volcano` | `https://res.cloudinary.com/dozfjnnca/video/upload/v1772652284/surabaya_volcano_vmpxpa.mp4` |
| `volcano_drone` | `https://res.cloudinary.com/dozfjnnca/video/upload/v1772652284/volcano_drone_o5tab6.mp4` |

### Poster Images (local, in `frontend/public/images/low_data_video_images/`)
Each video has a matching first-frame JPEG screengrab at 1080p:
- `bali_beach_screengrab.jpg` (424K)
- `bali_cliffs_screengrab.jpg` (389K)
- `beach_populated_screengrab.jpg` (365K)
- `bromo_volcano_screengrab.jpg` (133K)
- `jakarta_roundie_screengrab.jpg` (552K)
- `surabaya_volcano_screengrab.jpg` (526K)
- `volcano_drone_screengrab.jpg` (225K)

## How to Add a New Video
1. Compress with ffmpeg: `ffmpeg -i input.mp4 -an -vf "scale=1920:-2,fps=30" -c:v libx264 -crf 28 -preset slow -movflags +faststart output.mp4`
2. Extract poster: `ffmpeg -i output.mp4 -vframes 1 -q:v 2 name_screengrab.jpg`
3. Upload compressed video to Cloudinary
4. Place poster JPG in `frontend/public/images/low_data_video_images/`
5. Add the key to the `VideoKey` union type in `frontend/lib/media.ts`
6. Add the entry to `VIDEO_REGISTRY` with the Cloudinary URL and poster path
7. Update `docs/videos.md` with the new Cloudinary URL

## How to Swap Videos
Change the value of `HERO_SPLASH_VIDEO` or `HERO_BANNER_VIDEO` in `frontend/lib/media.ts`:
```typescript
export const HERO_SPLASH_VIDEO: VideoKey = "bali_cliffs";  // ← change this
export const HERO_BANNER_VIDEO: VideoKey = "bromo_volcano"; // ← or this
```

## Implementation Order
1. Create `frontend/lib/media.ts` — no dependencies
2. Create `frontend/components/ui/VideoBackground.tsx` — depends on media.ts
3. Modify `HeroSplash.tsx` — remove gradient blobs, add VideoBackground
4. Modify `HeroBanner.tsx` — remove radial gradient, add VideoBackground

## Verification
- `cd frontend && npm run build` — TypeScript/lint check
- `cd frontend && npm run dev` — visual check
- Throttle network in devtools → poster should appear immediately
- Enable `prefers-reduced-motion` in devtools rendering → should show static poster only

## Codebase Conventions (for context)
- TypeScript strict, no `any`
- Tailwind v4 with `@theme inline` blocks in `globals.css` (not `tailwind.config.ts`)
- All colors/fonts from `theme.json` via CSS variables
- Components must respect `prefers-reduced-motion`
- WCAG 2.1 AA required
- Heavy components (D3, Plotly) lazy-loaded via `next/dynamic({ ssr: false })`
