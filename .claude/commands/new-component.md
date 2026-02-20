Create a new reusable component called $ARGUMENTS.

Before writing:
1. Read the component specification in `docs/DESIGN.md` under "Component Specifications"
2. Check `theme.json` for applicable design tokens

Requirements:
- TypeScript with explicit prop interface
- Default export
- All visual tokens from theme.json (no hardcoded values)
- Include JSDoc comment describing the component
- Handle all states documented in the design spec (default, hover, focus, loading, error, empty)
- Keyboard accessible with visible focus indicators