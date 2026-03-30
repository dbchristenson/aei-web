/** Read a resolved CSS custom property value at runtime. */
export function getCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Read all semantic theme colors from CSS custom properties.
 *  Uses a single getComputedStyle() handle to avoid repeated style recalcs. */
export function getThemeColors() {
  const s = getComputedStyle(document.documentElement);
  const v = (name: string) => s.getPropertyValue(name).trim();
  return {
    tealBlue: v("--color-primary"),
    amber: v("--color-accent"),
    coralGlow: v("--color-accent-alt"),
    n950: v("--color-bg"),
    n900: v("--color-bg-subtle"),
    n800: v("--color-surface"),
    n700: v("--color-surface-hover"),
    n600: v("--color-border"),
    n400: v("--color-fg-muted"),
  };
}
