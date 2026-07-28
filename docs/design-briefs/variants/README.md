# Variant Flavor Files

One file per design variant, named after the variant: `docs/design-briefs/variants/<name>.md`. The `/design-variant` command reads it after `BASE.md` and `.impeccable.md` to know what makes this variant *this* variant.

A flavor file can be a single sentence or a full art-direction document — both are valid. Two ways to author one:

- **Before creating the worktree:** write the file here on master; `scripts/variant.sh new <name>` inherits it.
- **Inline at creation:** `scripts/variant.sh new <name> "one-line direction"` writes a stub into the new worktree.

Suggested structure for longer briefs (all sections optional):

```markdown
# <name>

## Direction
The core idea in a paragraph. What should someone feel in the first five seconds?

## References
Sites, publications, or imagery that capture the direction — and what specifically to take from each.

## Must-try ideas
Concrete experiments this variant should attempt, even if some get discarded.

## Sources to mix        <!-- mix-* variants only; pre-filled by `variant.sh mix` -->
- worktree-<source-a>: what to take from it
- worktree-<source-b>: what to take from it
```
