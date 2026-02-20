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
- **Fonts:** Google Fonts via next/font — Lora, Rubik, Manrope

## Key Directories
- `frontend/` — Next.js app
- `frontend/app/` — App Router pages
- `frontend/components/` — Reusable React components (ui/, layout/, map/, sections/, insights/)
- `frontend/content/insights/` — MDX article files
- `backend/` — FastAPI app
- `analysis/` — Python scripts that produce Plotly JSON for the frontend
- `theme.json` — Master design tokens (colors, fonts, spacing, glass styles, animation)

## Design Tokens
ALL colors, fonts, spacing, border radii, and glass styles come from `theme.json` at the repo root. Never hardcode these values. The frontend reads them via `frontend/theme.config.ts` → Tailwind config → CSS variables. The analysis scripts read them via `analysis/aei_theme.py`.

## Commands
- `cd frontend && npm run dev` — Start Next.js dev server
- `cd backend && uvicorn main:app --reload` — Start FastAPI dev server
- `cd frontend && npm run build` — Production build
- `cd frontend && npm run lint` — ESLint check

## Code Style
- TypeScript strict mode, no `any`
- Prefer interfaces over type aliases
- All components are functional with hooks
- Tailwind utility classes using AEI token names (e.g., `bg-teal-blue`, `font-sans-header`)
- All components must respect `prefers-reduced-motion`
- WCAG 2.1 AA compliance required — never rely on color alone

## Critical Rules
- NEVER hardcode color hex values in components — always use Tailwind tokens or CSS variables from theme.json
- ALWAYS lazy-load heavy components (D3 map, Plotly charts) with `next/dynamic({ ssr: false })`
- ALWAYS provide loading/error/empty states for data-fetching components
- The design document is at `docs/DESIGN.md` — read it before building any new section
```

The key insight from best practices: keep this under ~50 instructions. Claude Code's system prompt already takes up a chunk of the instruction budget. Be specific about what matters, and use progressive disclosure (point Claude to `docs/DESIGN.md` for details rather than pasting the whole design doc here).

## Step 3 — Create the `.claude/` folder structure
```
.claude/
├── settings.json          # Hooks, permissions, environment
├── settings.local.json    # Your personal overrides (gitignored)
├── commands/              # Slash commands
│   ├── build-section.md
│   ├── new-component.md
│   └── new-insight.md
└── skills/
    └── aei-design/
        └── SKILL.md       # Design system skill