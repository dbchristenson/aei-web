# AEI Website

## What
B2B investor-facing website for PT Agra Energi Indonesia, an Indonesian oil & gas exploration company. Primary goal: convert prospective investors and operating partners to contact.

## Stack
- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Styling:** CSS custom properties from theme.json (single source of truth)
- **Map:** D3.js with custom orthographic projection (no Mapbox, no API key)
- **Charts:** Plotly (plotly.py → fig.to_json() → react-plotly.js)
- **Content:** MDX for Insights articles
- **Animation:** GSAP (ScrollTrigger) for scroll-driven animations
- **Backend:** FastAPI (Python), PostgreSQL + PostGIS
- **Python Packages:** uv
- **Fonts:** Google Fonts via next/font — Plus Jakarta Sans (single font, Indonesian foundry)

## Directory Structure
```
aei-web/
├── theme.json                    # Master design tokens (colors, fonts, spacing, glass)
├── main.py                       # Root-level Python entry point
├── pyproject.toml / uv.lock      # Python workspace config (uv)
│
├── frontend/                     # Next.js app (all frontend commands run here)
│   ├── app/                      # App Router pages (see design doc §3 for specs)
│   │   ├── layout.tsx            # Root layout (fonts, providers, NavBar, Footer)
│   │   ├── page.tsx              # Home page — 6-section scroll funnel (design doc §3.1)
│   │   ├── globals.css           # @theme inline tokens + CSS custom properties
│   │   ├── about/page.tsx        # /about — history, partner logos, quotes (§3.2)
│   │   ├── blocks/[id]/page.tsx  # /blocks/:id — individual block detail
│   │   ├── contact/page.tsx      # /contact — form + info (§3.5)
│   │   ├── governance/           # /governance + /governance/:policy — footer-only nav (§3.6)
│   │   ├── insights/             # /insights + /insights/:slug — MDX articles (§3.4)
│   │   └── team/page.tsx         # /team — leadership grid (§3.3)
│   ├── components/
│   │   ├── ui/                   # Primitives: Button, GlassCard, PullQuote, StatCounter,
│   │   │                         #   SectionDivider, ThemeToggle, VideoBackground
│   │   ├── layout/               # NavBar (sticky + logo scroll anim, §3.1-S1), Footer (4-col, §3.1-S6)
│   │   ├── sections/             # Home page sections (map to design doc §3.1):
│   │   │                         #   HeroSplash (S1), HeroBanner (S2), PartnerLogoGrid (S3),
│   │   │                         #   TeamCarousel (S4) — map is S5, footer is S6
│   │   ├── map/                  # ExplorationMap (S5), BlockDetailMap, BlockInfoPanel
│   │   │   └── globe/            # D3 globe internals (constants, geo-utils, hooks)
│   │   ├── insights/             # InsightCard, InsightChart (used on /insights)
│   │   └── providers/            # ThemeProvider (dark/light mode switching)
│   ├── content/insights/         # MDX article files (currently empty)
│   ├── data/                     # Static data files
│   │   ├── blocks.ts             # Block/concession data
│   │   └── governance.ts         # Governance policy content
│   ├── hooks/                    # Custom React hooks
│   │   └── usePrefersReducedMotion.ts
│   ├── lib/                      # Utilities
│   │   ├── media.ts              # Media helpers
│   │   └── theme-utils.ts        # Theme/token utilities
│   └── public/                   # Static assets (data/, images/, videos/)
│
├── backend/                      # FastAPI app
│   ├── main.py                   # App entry point
│   ├── db/connection.py          # PostgreSQL + PostGIS connection
│   ├── models/block.py           # Block data model
│   └── routers/                  # API routes
│       ├── blocks.py             # /api/blocks endpoints
│       └── contact.py            # /api/contact endpoint
│
├── analysis/                     # Python data processing → Plotly JSON for frontend
│   ├── main.py                   # Analysis entry point
│   ├── aei_theme.py              # Reads theme.json for chart styling
│   ├── process_blocks.py         # GeoJSON/block processing
│   └── data/                     # Raw + processed geodata
│       ├── blocks.geojson
│       ├── block_data/
│       └── raw/
│
└── docs/                         # Project documentation
    ├── AEI_Website_Design_Document_v2.md  # Full design spec — READ BEFORE building new sections
    ├── team-profiles.md
    ├── governance-content.md
    └── videos.md
```

## Design Tokens
ALL colors, fonts, spacing, border radii, and glass styles come from `theme.json` at the repo root. Never hardcode these values. The frontend reads them via `globals.css` (`@theme inline` block + CSS custom properties) → Tailwind tokens. The analysis scripts read them via `analysis/aei_theme.py`.

## Commands
- `cd frontend && npm run dev` — Start Next.js dev server
- `cd backend && uvicorn main:app --reload` — Start FastAPI dev server
- `cd frontend && npm run build` — Production build
- `cd frontend && npm run lint` — ESLint check

## Code Style
- TypeScript strict mode, no `any`
- Prefer interfaces over type aliases
- All components are functional with hooks
- Tailwind utility classes using semantic token names (e.g., `bg-primary`, `text-fg`, `bg-surface`)
- All components must respect `prefers-reduced-motion`
- WCAG 2.1 AA compliance required — never rely on color alone

## Critical Rules
- NEVER hardcode color hex values in components — always use Tailwind tokens or CSS variables from theme.json
- ALWAYS lazy-load heavy components (D3 map, Plotly charts) with `next/dynamic({ ssr: false })`
- ALWAYS provide loading/error/empty states for data-fetching components
- The design document is at `docs/AEI_Website_Design_Document_v2.md` — read it before building any new section

## Design Context

### Users
Prospective investors and operating partners in the oil & gas / energy sector. Sophisticated institutional professionals — fund managers, O&G executives, government-linked entities — who assess credibility in seconds and are allergic to hype. Secondary users include due-diligence teams who need governance docs and detailed project data.

### Brand Personality
**Sophisticated, Warm, Grounded.** Confident without being boastful, precise without being cold. Human warmth beneath the professionalism. *"We've been here before, we know this landscape, and we'd be good partners."*

### Emotional Goals
Primary emotion: **confidence and trust** — "These people know what they're doing." Every design decision reinforces perceived stability, expertise, and institutional-grade seriousness.

### Aesthetic Direction — Two Modes
1. **Landing & marketing pages** (Home, About, Team, Contact): Editorial, cinematic authority. Clean section hierarchy, strong visual storytelling, frosted glass over video/imagery, measured scroll pacing, generous whitespace, type-driven hierarchy through weight and scale.
2. **Block detail pages** (Gaea, Gaea II, Talu, etc.): Bloomberg-style data density — accolades, production numbers, partners, charts, timelines, news. Same token system, but layout shifts from editorial to dashboard-adjacent.

### Design System Summary
- **Colors:** Cool blue-grey neutral scale (#151E25–#F5F9FC), deep teal primary (#12587c), cyan alternate (#0aadd6), muted cyan (#62caeb). Oceanic and cool. Warm accents may be reintroduced later as complements to the blue-teal foundation.
- **Typography:** Plus Jakarta Sans only (Indonesian foundry). Hierarchy via weight (400–700) and size, not font-family contrast.
- **Glass:** Frosted glass cards with per-theme tokens (opacity, blur, shadow). Signature pattern over video/imagery.
- **Motion:** GSAP ScrollTrigger. Measured, purposeful. Always respect `prefers-reduced-motion`.

### Anti-References
- No crypto/startup aesthetics (neon, particles, hype, countdowns)
- No generic corporate templates (stock photos, blue-grey sameness, SaaS layouts)
- No flashy agency work (wild type, chaotic layouts, style-over-substance)

### Design Principles
1. **Trust before flash.** If a design element doesn't build confidence, remove it.
2. **Earned density.** Landing pages = editorial pacing. Block pages = data density. Match density to context.
3. **Grounded in place.** Indonesia is deep ocean, volcanic ridges, tropical light. The cool blue-teal palette and Plus Jakarta Sans (Indonesian roots) connect back to the landscape.
4. **Warmth through craft.** Custom glass effects, considered weight/scale typography, responsive scroll animations signal care. Never ornament for its own sake.
5. **Accessible by default.** WCAG 2.1 AA. Never color-only. Keyboard navigable. Reduced-motion fallbacks. Legibility is non-negotiable.