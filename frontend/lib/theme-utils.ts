/** Read a resolved CSS custom property value at runtime. */
export function getCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Read all semantic theme colors from CSS custom properties. */
export function getThemeColors() {
  return {
    tealBlue: getCssVar("--color-primary"),
    amber: getCssVar("--color-accent"),
    coralGlow: getCssVar("--color-accent-alt"),
    n950: getCssVar("--color-bg"),
    n900: getCssVar("--color-bg-subtle"),
    n800: getCssVar("--color-surface"),
    n700: getCssVar("--color-surface-hover"),
    n600: getCssVar("--color-border"),
    n400: getCssVar("--color-fg-muted"),
  };
}
