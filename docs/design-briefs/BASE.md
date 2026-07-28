# Design Variant Base Brief

Every design-variant session reads this file first, then `.impeccable.md` (brand personality, emotional goals, aesthetic direction, anti-references), then its own flavor file at `docs/design-briefs/variants/<name>.md`. This file defines what all variants share; the flavor file defines what makes each one different.

## Mission

This round of iteration targets two things:

1. **Messaging.** Sharpen the value proposition for institutional investors and operating partners. Every page should answer, quickly and without hype: who is AEI, why Indonesia, why now, and why are they credible partners? Copy tone may be rewritten freely — facts may not (see constraints).
2. **Visual cohesion.** The site should read as one deliberate system across Home, About, Team, Insights, Governance, and Contact — consistent rhythm, spacing, type hierarchy, and glass usage, with no page feeling like it was designed in a different era.

Variants are **whole-site directions**: you may rethink theme tokens, typography scale, section composition, imagery treatment, and copy voice — a cohesive alternate vision, not a single-section tweak.

## Specific asks (edited by the site owner each round)

<!-- Keep this list current. Variants treat these as required work items. -->

- Improve the clarity and confidence of the home page messaging (hero through footer).
- Strengthen visual cohesion between the editorial marketing pages and the data-dense block pages.

## Visionary direction

Beyond the specific asks, swing bigger: what would a step-change version of this site feel like? The bar is a site that a fund manager screenshots and sends to a colleague. Grounded in the brand ("Sophisticated, Warm, Grounded" — see `.impeccable.md`), but don't be timid; a variant that plays it safe teaches us nothing. Distinct directions are the point — if your flavor file pushes toward an extreme, commit to it.

## Hard constraints (all variants, non-negotiable)

- **Tokens through `theme.json` only.** Color/spacing/type/glass changes go in the root `theme.json`; `npm run dev`/`build` regenerates the token block of `frontend/app/globals.css`. Never hand-edit that generated block, never hardcode hex values in components. Hand-written classes/keyframes below the generated block are fair game.
- **Accessibility:** WCAG 2.1 AA. The founder is color-blind — never encode meaning in red/green alone. Keyboard navigable. `prefers-reduced-motion` fallbacks for every animation.
- **Do not touch:** `frontend/app/api/`, `backend/`, `analysis/`, environment/config handling, or CI.
- **Facts are frozen.** Names, numbers, block details, partner identities, legal/governance claims must not be altered or invented. Voice and framing may change; substance may not.
- **Done means green:** `cd frontend && npm run lint` and `npm run build` must pass before a variant is declared finished.

## Working method

- Commit early and often on your `worktree-<name>` branch; prefix messages with `[<name>]`.
- Useful levers: the `frontend-design` skill and the `impeccable:*` suite (`bolder`, `quieter`, `colorize`, `typeset`, `arrange`, `critique`, …) for pushing a direction; `/design-variant` re-reads your briefs anytime.
- Before declaring done, run the `ux-design-auditor` agent as a self-review and fix what it flags.
- Preview: from the main checkout, `scripts/variant.sh dev <name>` serves this worktree on its assigned port (or run `npm run dev -- -p <port>` in `frontend/` here). Each Next dev server costs roughly 0.5–1 GB of memory — the owner runs 2–3 side by side, so cold-compile your variant once before comparison sessions.

## Mixing recipe (for `mix-*` variants)

A mix variant starts from master and combines ideas from source variants listed in its flavor file:

1. **Wholesale file grabs** when taking an entire component/section from exactly one source: `git checkout worktree-<src> -- <path>`. Exact and conflict-free.
2. **Deliberate synthesis** for contested shared files (`frontend/app/page.tsx`, `layout.tsx`, `theme.json`, hand-written `globals.css` sections): read each side with `git show worktree-<src>:<path>` and write a reconciled version — never merge or cherry-pick variant branches into each other; the diffs conflict beyond usefulness.
3. **`theme.json` rule:** adopt one source's palette wholesale, then adjust individual tokens intentionally. Never splice palettes line-by-line — the result is mud.
