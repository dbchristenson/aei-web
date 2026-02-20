---
name: aei-design
description: AEI website design system and component conventions. Use when creating new components, styling elements, choosing colors/fonts/spacing, or when the user asks about the design system, brand guidelines, or visual standards.
---

# AEI Design System

When working on any visual aspect of the AEI website, always reference these two files:
- `theme.json` — Master design tokens (read this first)
- `docs/DESIGN.md` — Full design specification (Section 4 for style guide, Component Specifications for component props/states)

## Key Principles
- Single source of truth: `theme.json` → `theme.config.ts` → Tailwind → CSS vars
- Glassmorphism: Two variants (light, dark) defined in theme.json
- Animation: All durations/easings from theme.json. Always respect `prefers-reduced-motion`
- Accessibility: WCAG 2.1 AA. Founder is color-blind — never rely on red/green. Test with Deuteranopia simulation.
- Type scale: Use semantic tokens (`--text-hero`, `--text-h1`, etc.), not arbitrary sizes

## Color Usage Quick Reference
- Primary CTA: `--bright-teal-blue` (bg) + white (text)
- Hover: `--color-primary-hover`
- Dark backgrounds: `--jet-black` or `--neutral-950`
- Light backgrounds: `--neutral-50`
- Muted/secondary text: `--neutral-400`
- Map grid: `--bright-teal-blue` / `--sky-reflection`
- Map highlights: `--bright-amber` (O&G blocks), `--coral-glow` (geothermal)

## Component States Checklist
Every data-fetching component must handle: loading (shimmer/skeleton), error (message + retry), empty (graceful message), and active (normal rendering).