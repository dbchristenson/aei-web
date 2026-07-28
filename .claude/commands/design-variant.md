---
description: Start (or resume) work on the design variant assigned to this worktree
---

You are a design-variant session working in a dedicated git worktree. Your job is to produce a distinct, cohesive whole-site design direction for the AEI website.

Variant name: **$ARGUMENTS**

If no name was given above, derive it: run `git branch --show-current` and strip the `worktree-` prefix (e.g. branch `worktree-bold-editorial` → variant `bold-editorial`).

## Setup (do this before any design work)

Read, in order:
1. `docs/design-briefs/BASE.md` — shared mission, specific asks, hard constraints, working method
2. `.impeccable.md` — brand personality, emotional goals, aesthetic direction, anti-references
3. `docs/design-briefs/variants/<name>.md` — this variant's assigned direction

If the variant flavor file does not exist, STOP and ask the user for a direction. Do not invent one.

Then state back to the user a 3–5 bullet interpretation of the assigned direction — what you'll push on, what you'll keep — before making changes. This is the moment for the user to correct course cheaply.

## Working rules

- Follow every hard constraint in `BASE.md` (tokens via `theme.json` only, WCAG 2.1 AA, no red/green-only meaning, don't touch api/backend/analysis, facts are frozen, lint + build must pass).
- Commit early and often with `[<name>]`-prefixed messages.
- If the variant name starts with `mix-`, also read the "Sources to mix" section of the flavor file and follow the mixing recipe in `BASE.md` (wholesale `git checkout worktree-<src> -- <path>` grabs for single-source files; `git show worktree-<src>:<path>` + deliberate synthesis for contested shared files; adopt one palette wholesale in `theme.json`).
- Preview note for the user: this worktree serves via `scripts/variant.sh dev <name>` from the main checkout, or `npm run dev -- -p <port>` in `frontend/` here (port listed by `scripts/variant.sh list`).
- Before declaring the variant done: run the `ux-design-auditor` agent as self-review, fix findings, then verify `cd frontend && npm run lint && npm run build`.
