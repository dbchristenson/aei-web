---
name: aei-design
description: AEI website design system and component conventions. Use when creating new components, styling elements, choosing colors/fonts/spacing, or when the user asks about the design system, brand guidelines, or visual standards.
---

# AEI Design System

When working on any visual aspect of the AEI website, always reference these files:
- `theme.json` — Master design tokens (read this first)
- `docs/AEI_Website_Design_Document_v2.md` — Full design specification (§4 for the visual style guide, §6 Component Specifications for component props/states)
- `.impeccable.md` — Design brief: brand personality, emotional goals, aesthetic direction, anti-references

## Key Principles
- Single source of truth: `theme.json` → `frontend/scripts/sync-theme.mjs` → generated token block in `frontend/app/globals.css` → Tailwind tokens
- **Token changes go in root `theme.json` only.** `npm run dev`/`npm run build` regenerate the token block of `globals.css` — never hand-edit that block (hand-written component classes below it are fine)
- Glassmorphism: per-theme glass tokens in theme.json; use `.glass-card` / `.glass-card-dark` classes
- Animation: all durations/easings from theme.json. Always respect `prefers-reduced-motion`
- Accessibility: WCAG 2.1 AA. Founder is color-blind — never rely on red/green. Test with Deuteranopia simulation.
- Type scale: use semantic tokens (`--text-hero`, `--text-h1`, etc.), not arbitrary sizes

## Color Usage Quick Reference (semantic tokens — theme-aware)
- Primary CTA: `bg-primary` (`--color-primary`, deep teal #12587c) + white text
- Hover: `--color-primary-hover` (#1b7fa3)
- Accent / links: `text-accent` (`--color-accent`, cyan #0aadd6); softer variant `text-accent-alt` (#62caeb)
- Surfaces: `bg-bg`, `bg-bg-subtle`, `bg-surface`, `bg-surface-hover`
- Text: `text-fg`, `text-fg-secondary`, `text-fg-muted`, `text-fg-inverse`
- Borders: `border-border`, `border-border-subtle`
- Status: `--color-success` (#2a9d6e), `--color-warning` (#E87C03), `--color-error` (#d93636) — never color-only
- Fixed palette values (category badges, map layers): `--color-palette-*` tokens from the `palette` block of theme.json (primary, alternate, neutrals 950–50)

## Component States Checklist
Every data-fetching component must handle: loading (shimmer/skeleton), error (message + retry), empty (graceful message), and active (normal rendering).
