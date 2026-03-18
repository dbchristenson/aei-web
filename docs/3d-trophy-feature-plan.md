# 3D Trophy Feature — Workflow Critique & Technical Plan

> **Status**: Deferred — implement after major website components are complete.

## Context

AEI wants to display physical awards/trophies on the website when associated with a block or project (e.g. "2024 Discovery of the Year" crystal award). A friend proposed a Blender → GLB → Three.js/R3F pipeline. This plan critiques that workflow, identifies gaps, and recommends the optimal approach.

**Current stack context**: The project has zero 3D/WebGL dependencies today. It uses D3.js (2D SVG globe), GSAP (scroll animations), and Plotly (charts). Heavy components are already lazy-loaded via `next/dynamic({ ssr: false })` with IntersectionObserver-deferred data fetching — good patterns to build on.

**Scope (from user)**: 3–5 trophies across different blocks/projects. Materials not yet catalogued — need a flexible system. Drag-to-rotate interaction (OrbitControls). Possibly a trophy gallery page showing several at once.

**Key performance implication**: With 3–5 trophies potentially on one page and unknown materials, the system MUST support both expensive glass materials (one at a time) and a lightweight gallery mode (static images or simplified materials for grid views).

---

## Critique of the Proposed Workflow

### Phase 1: Blender Modeling — Solid Foundation

The advice is **correct and well-reasoned**. Specific notes:

- **Low-poly approach**: Right. For a teardrop crystal, target **500–2,000 faces** max. This award shape can be done in ~800 faces with deliberate hard edges.
- **Faceting over subdivision**: Correct — the crystal's flat beveled facets are the visual identity. Subdivision would round them out and inflate geometry.
- **"Keep it hollow"**: Correct for transmission materials. Single-sided meshes are lighter and `MeshTransmissionMaterial` handles them well. Just ensure normals face outward.
- **UV unwrapping**: Correct and essential for decal/text placement.

**What's missing:**
- **Polygon budget guidance**: No concrete targets. For web, stay under 5,000 faces per trophy.
- **Draco/meshopt compression**: Not mentioned. Draco can reduce .glb file size by 70–90%. This is critical for web — a 2MB model becomes 200KB.
- **File size target**: Should aim for **< 500KB per trophy** (model + textures combined).
- **Multiple shape consideration**: Each unique trophy shape is 2–8 hours of modeling work. This is the first major time sink.

### Phase 2: Engraving as Texture — Correct Strategy

The "don't model text as geometry" advice is **absolutely right**. Modeled text on a ~1,000 face trophy would add 10,000+ faces.

**Between the two options offered:**

| Approach | Pros | Cons |
|----------|------|------|
| Normal Map | True "carved in" look, light-reactive | Interacts unpredictably with transmission/refraction shaders; hard to tune |
| Floating Decal | Predictable, "text floating inside glass" look, easy to swap | Slight Z-fighting risk, less physically accurate |

**Recommendation**: The **floating decal is better for this use case**. Glass transmission materials distort normal maps in ways that make text illegible at certain angles. The decal approach gives you the recognizable "laser-etched floating text" look that real crystal awards have.

**What's missing:**
- In React Three Fiber, drei provides a `<Decal>` component that handles UV projection automatically — no need to manually position a plane in Blender.
- For the AEI globe logo, export as SVG and render as a texture at runtime for crisp scaling.

### Phase 3: Export — Correct but Incomplete

- **GLB format**: Correct. This is the web standard.
- **"Don't bother with Blender glass materials"**: Correct — Blender's Glass BSDF doesn't translate to WebGL.

**What's missing:**
- **Draco compression on export**: Use `glTF-Transform` or Blender's built-in Draco option. This is a major omission.
- **Texture resolution**: Cap at **1024x1024** for desktop, **512x512** for mobile. The friend doesn't mention this.
- **Multiple export consideration**: If you have 5 different trophies, that's 5 separate .glb files to manage, host, and preload.

### Phase 4: Web Implementation — Mostly Right, but Performance Claims are Misleading

The R3F + `MeshTransmissionMaterial` recommendation is **the correct choice** for glass. However, the performance narrative has a critical gap:

**The misleading claim**: _"Instead of bouncing millions of light rays, these modern materials take a 'snapshot' of the background canvas..."_

This is half-true. Here's what actually happens:

1. `MeshTransmissionMaterial` renders the **entire scene** (minus the glass object) into a Frame Buffer Object (FBO)
2. It then samples that FBO with distortion based on IOR and thickness
3. `chromaticAberration` renders **additional passes** (one per color channel)
4. **For each glass object on screen, this entire process repeats**

**This means:**
- 1 trophy = 1 extra scene render → fine
- 3 trophies = 3 extra scene renders → noticeable on mid-range hardware
- 5+ trophies = 5+ extra scene renders → will stutter on mobile

**What's entirely missing from Phase 4:**
- **Mobile performance**: Not mentioned once. WebGL glass effects are the most GPU-expensive material type. Mobile GPUs will struggle. Need a fallback.
- **Bundle size impact**: Three.js + R3F + drei + postprocessing adds **~300–500KB gzipped** to your JavaScript bundle. For a B2B site where first-load performance matters for investor confidence, this is significant.
- **Loading strategy**: No mention of progressive loading. A .glb + HDRI + textures = 1–5MB of assets that block rendering.
- **HDRI size**: A quality HDRI is 2–10MB. Need to use a highly compressed .hdr (256x128 is often enough for reflections) or bake environment into a small cubemap.

**The shader settings are good starting points** but will require 4–8 hours of iterative tuning per material type to look right.

### Phase 5: Post-processing — Fine but Keep it Minimal

Bloom is a nice finishing touch. On a B2B investor site, keep the threshold high and intensity very low — this should be barely perceptible, just catching edge highlights.

**Additional concern**: The `@react-three/postprocessing` package adds another ~50KB gzipped and an additional render pass.

---

## The Biggest Time Sinks (Ranked)

| Rank | Task | Est. Time | Why It's Expensive |
|------|------|-----------|-------------------|
| 1 | **Material tuning in browser** | 4–8 hrs per material type | Transmission, IOR, thickness, roughness, environment interaction — all interrelated. Change one, everything shifts. Purely iterative. |
| 2 | **Blender modeling per trophy** | 2–8 hrs each | Each unique shape needs careful topology. The teardrop is medium difficulty. A complex trophy (multi-part, base + plaque + figure) is much harder. |
| 3 | **Performance optimization** | 8–16 hrs | Mobile fallbacks, LOD strategy, lazy loading, HDRI compression, Draco pipeline setup, FBO management for multiple trophies. |
| 4 | **Texture/decal per trophy** | 1–3 hrs each | Recreating each award's text, logos, and graphics as clean vector art + mapping to UV. |
| 5 | **Integration with Next.js** | 4–8 hrs | Component architecture, lazy loading, data model, responsive behavior, theme integration. |

**Total for first trophy**: ~20–40 hours (including pipeline setup)
**Each additional trophy**: ~5–15 hours (model + textures + tuning)

---

## Multiple Materials, Shapes, and Colors

The friend's workflow only addresses **glass/acrylic**. If trophies vary:

| Material | Shader | Complexity | Performance Cost |
|----------|--------|------------|-----------------|
| Crystal/Glass | `MeshTransmissionMaterial` | High (many params to tune) | High (FBO render per object) |
| Polished Metal | `MeshStandardMaterial` (metalness=1, roughness<0.1) | Low | Low |
| Brushed Metal | `MeshStandardMaterial` + roughness map | Medium | Low |
| Wood/Stone | `MeshStandardMaterial` + albedo/normal/roughness textures | Medium (need texture creation) | Low |
| Acrylic (colored) | `MeshPhysicalMaterial` (transmission + color) | Medium | High |

**Key insight**: Non-transparent materials are dramatically cheaper to render. If most trophies are metal or wood, performance is not an issue. Glass/crystal is the expensive outlier.

**Color variations of the same shape**: Trivial. Change the material color/tint parameter. No re-modeling needed. This is the cheapest kind of variation.

**Shape variations**: Most expensive. Each unique shape = new Blender model.

---

## Software-Side Considerations

### 1. Data Architecture
Need a trophy data model that associates trophies with blocks/projects:

```ts
interface Trophy {
  id: string;
  title: string;          // "2024 Discovery of the Year"
  year: number;
  organization: string;   // "AIEN"
  recipients: string[];   // ["Eni", "Neptune", "Agra Energi"]
  blockSlug?: string;     // links to a specific block
  modelPath: string;      // "/models/trophies/aien-2024.glb"
  materialType: "glass" | "metal" | "acrylic" | "wood";
  materialParams: Record<string, number>; // shader-specific overrides
  decalTexture?: string;  // "/textures/trophies/aien-2024-decal.png"
}
```

### 2. Component Architecture
```
TrophyViewer (lazy-loaded via next/dynamic, ssr: false)
├── R3F Canvas
│   ├── Environment (HDRI)
│   ├── TrophyModel (loads .glb)
│   │   ├── GlassMaterial | MetalMaterial | ... (based on materialType)
│   │   └── Decal (text/logo overlay)
│   ├── Lighting (supplemental)
│   └── OrbitControls (user interaction)
└── Fallback (static image for no-WebGL / mobile / prefers-reduced-motion)
```

### 3. Progressive Enhancement Strategy
- **Full 3D**: Desktop with WebGL 2 support → R3F with MeshTransmissionMaterial
- **Simplified 3D**: Mobile or low-GPU → Use `MeshPhysicalMaterial` (no FBO) with lower fidelity
- **Static fallback**: No WebGL, `prefers-reduced-motion`, or SSR → Pre-rendered PNG/WebP of the trophy
- Detection via `navigator.gpu` or `renderer.capabilities` check at runtime

### 4. Asset Pipeline
- .glb files should be Draco-compressed and served from `/public/models/`
- HDRI should be a small (256x128) .hdr or pre-convolved cubemap
- Decal textures as WebP with alpha, max 1024x1024
- Total asset budget per trophy: < 500KB

### 5. Bundle Considerations
New dependencies required:
- `three` (~150KB gzipped)
- `@react-three/fiber` (~40KB gzipped)
- `@react-three/drei` (~80KB gzipped, tree-shakeable)
- `@react-three/postprocessing` (~50KB gzipped, optional)

Since these are lazy-loaded via `next/dynamic({ ssr: false })`, they won't affect initial page load — only loaded when trophy component enters viewport (following the existing IntersectionObserver pattern used by ExplorationMap).

### 6. Theme Integration
- The R3F canvas background should match `var(--theme-bg)` via a transparent canvas + CSS background
- Or use a themed HDRI/environment that complements the dark/light theme
- Trophy component must respect `prefers-reduced-motion` — disable auto-rotation, use static pose

---

## Alternative Approaches Worth Considering

### Option A: Pre-Rendered Turntable (Simplest, Most Reliable)
Render a high-quality 360-degree turntable animation in Blender Cycles (30-60 frames), export as optimized MP4/WebM or sprite sheet. User drags to rotate.

**Pros**: Guaranteed visual quality (ray-traced), works everywhere, tiny JS footprint (~5KB), no WebGL needed, faster to produce per trophy
**Cons**: No true real-time lighting, larger asset size (2-5MB video), less "interactive" feel

### Option B: Google `<model-viewer>` Web Component
Drop-in web component that handles GLTF loading, lighting, interaction, and even AR.

**Pros**: ~45KB, built-in loading/AR, good performance, handles mobile well
**Cons**: Limited material control — no `MeshTransmissionMaterial` equivalent, glass will look mediocre

### Option C: R3F (The Proposed Approach, Enhanced)
Full Three.js/React Three Fiber pipeline as described, with the additions from this critique.

**Pros**: Best possible visual quality, full material control, true interactivity
**Cons**: Heaviest bundle, most complex, highest maintenance burden

### Recommendation
**Use Option C (R3F) as the primary approach**, but with a two-tier rendering strategy:

- **Detail view** (individual block/project page): Full R3F with `MeshTransmissionMaterial` for glass, `MeshStandardMaterial` for metals, drag-to-rotate via `OrbitControls`. One trophy at a time — performance is not a concern.
- **Gallery view** (if showing 3–5 on one page): Use simplified materials (no transmission FBO) or pre-rendered static images as thumbnails. Click to open detail view.

This avoids the multi-trophy transmission performance cliff while keeping the showpiece quality for individual viewing. The data model should support both rendering modes via a `materialType` field that drives shader selection.

---

## Implementation Phases (if proceeding)

### Phase 1: Pipeline Setup (one-time)
- Install Three.js + R3F + drei
- Create `TrophyViewer` component with lazy loading
- Set up HDRI environment + lighting rig
- Create material presets (glass, metal, etc.)
- Build progressive enhancement / fallback system

### Phase 2: First Trophy (the AIEN crystal award)
- Model in Blender (~800 faces)
- Create decal texture (globe logo + text)
- Export with Draco compression
- Tune glass material in browser
- Integration with page layout

### Phase 3: Trophy Data System
- Define data model
- Create trophy data file (like `frontend/data/trophies.ts`)
- Wire trophies to block/project pages
- Build trophy gallery/grid component if showing multiple

### Phase 4: Additional Trophies
- Model + texture each one
- Apply appropriate material preset
- Performance test with multiple on-screen

---

## Verdict on the Friend's Workflow

**Will it work?** Yes — the core pipeline (Blender → GLB → R3F + MeshTransmissionMaterial) is the industry-standard approach for glass objects on the web. The fundamentals are correct.

**Is it the best approach?** It's the best approach for **maximum visual fidelity**. But it's not the only approach, and for a B2B investor site where you might have 3–10 trophies, the performance and maintenance overhead matters. The friend's workflow is optimized for a single showpiece, not a scalable trophy system.

**What's dangerously missing?** Mobile strategy, multi-trophy performance, asset compression, bundle size impact, and progressive enhancement. Without addressing these, you'll ship something that looks stunning on a developer's MacBook Pro and stutters on an investor's iPad.
