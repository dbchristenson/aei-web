#!/usr/bin/env node

/**
 * sync-theme.mjs
 *
 * Reads theme.json and generates the token-driven sections of globals.css.
 * Hand-written CSS (component classes, keyframes, reduced motion) is preserved.
 *
 * Usage:
 *   node scripts/sync-theme.mjs          # One-shot sync
 *   node scripts/sync-theme.mjs --check  # Dry-run: exit 1 if CSS would change
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const THEME_PATH = resolve(__dirname, "../../theme.json");
const CSS_PATH = resolve(__dirname, "../app/globals.css");

// ─── Utilities ───────────────────────────────────────────────────────────────

function camelToKebab(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

/** Flatten palette object: top-level entries + nested neutrals */
function flattenPalette(palette) {
  const entries = [];
  for (const [key, value] of Object.entries(palette)) {
    if (key === "neutrals" && typeof value === "object") {
      for (const [shade, hex] of Object.entries(value)) {
        entries.push([`neutral-${shade}`, hex]);
      }
    } else {
      entries.push([camelToKebab(key), value]);
    }
  }
  return entries;
}

/** Map glass sub-object to CSS variable pairs */
function glassEntries(glass, prefix) {
  return [
    [`${prefix}-bg`, glass.background],
    [`${prefix}-blur`, glass.blur],
    [`${prefix}-border`, glass.border],
    [`${prefix}-shadow`, glass.shadow],
  ];
}

/** Get semantic keys from a theme object (everything except glass/glassLight) */
function semanticKeys(themeObj) {
  return Object.keys(themeObj).filter(
    (k) => k !== "glass" && k !== "glassLight"
  );
}

// ─── Validation ──────────────────────────────────────────────────────────────

function validate(theme) {
  const errors = [];

  const required = [
    "palette",
    "themes",
    "fonts",
    "typeScale",
    "borderRadius",
    "animation",
    "containers",
  ];
  for (const key of required) {
    if (!theme[key]) errors.push(`Missing required key: "${key}"`);
  }

  if (theme.themes) {
    for (const mode of ["dark", "light"]) {
      if (!theme.themes[mode]) {
        errors.push(`Missing theme: "themes.${mode}"`);
        continue;
      }
      const t = theme.themes[mode];
      for (const k of ["bg", "fg", "surface", "primary"]) {
        if (!t[k])
          errors.push(`Missing "themes.${mode}.${k}" — required for ${mode} theme`);
      }
      for (const g of ["glass", "glassLight"]) {
        if (!t[g]) {
          errors.push(`Missing "themes.${mode}.${g}"`);
        } else {
          for (const prop of ["background", "border", "shadow"]) {
            if (!t[g][prop])
              errors.push(`Missing "themes.${mode}.${g}.${prop}"`);
          }
        }
      }
    }
  }

  if (theme.typeScale) {
    for (const [name, entry] of Object.entries(theme.typeScale)) {
      if (!entry.size) errors.push(`typeScale.${name} missing "size"`);
      if (entry.lineHeight == null)
        errors.push(`typeScale.${name} missing "lineHeight"`);
    }
  }

  if (errors.length > 0) {
    console.error("theme.json validation failed:");
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
}

// ─── Section Generators ──────────────────────────────────────────────────────

function generateThemeInline(theme) {
  const lines = [];

  // Palette
  lines.push("@theme inline {");
  lines.push("  /* Palette (static, not theme-dependent) */");
  for (const [name, value] of flattenPalette(theme.palette)) {
    lines.push(`  --color-palette-${name}: ${value};`);
  }
  lines.push("");

  // Semantic indirection
  lines.push("  /* Semantic role tokens (resolved via --theme-* vars) */");
  for (const key of semanticKeys(theme.themes.dark)) {
    const kebab = camelToKebab(key);
    lines.push(`  --color-${kebab}: var(--theme-${kebab});`);
  }
  lines.push("");

  // Fonts
  lines.push("  /* Fonts */");
  for (const [key] of Object.entries(theme.fonts)) {
    lines.push(
      `  --font-${camelToKebab(key)}: var(--font-plus-jakarta), sans-serif;`
    );
  }
  lines.push("");

  // Border radius
  lines.push("  /* Border radius */");
  for (const [key, value] of Object.entries(theme.borderRadius)) {
    lines.push(`  --radius-${camelToKebab(key)}: ${value};`);
  }

  lines.push("}");
  return lines.join("\n");
}

function generateDarkTheme(theme) {
  const dark = theme.themes.dark;
  const lines = [];

  lines.push(":root,");
  lines.push('[data-theme="dark"] {');

  // Semantic tokens
  for (const key of semanticKeys(dark)) {
    lines.push(`  --theme-${camelToKebab(key)}: ${dark[key]};`);
  }
  lines.push("");

  // Glass tokens
  lines.push("  /* Glass tokens */");
  for (const [name, value] of glassEntries(dark.glass, "--glass")) {
    lines.push(`  ${name}: ${value};`);
  }
  for (const [name, value] of glassEntries(dark.glassLight, "--glass-light")) {
    lines.push(`  ${name}: ${value};`);
  }
  lines.push("");

  // Type scale
  lines.push("  /* Type scale */");
  for (const [name, entry] of Object.entries(theme.typeScale)) {
    lines.push(`  --text-${camelToKebab(name)}: ${entry.size};`);
  }
  lines.push("");

  // Font stacks
  lines.push("  /* Font stacks */");
  for (const [key] of Object.entries(theme.fonts)) {
    const kebab = camelToKebab(key);
    lines.push(
      `  --font-${kebab}-stack: var(--font-plus-jakarta), sans-serif;`
    );
  }
  lines.push("");

  // Animation tokens
  lines.push("  /* Animation tokens */");
  for (const [key, value] of Object.entries(theme.animation)) {
    const kebab = camelToKebab(key);
    // If value is a raw number, append "ms"
    const cssValue = typeof value === "number" ? `${value}ms` : value;
    lines.push(`  --${kebab}: ${cssValue};`);
  }
  lines.push("");

  // Containers
  lines.push("  /* Containers */");
  for (const [key, value] of Object.entries(theme.containers)) {
    lines.push(`  --container-${camelToKebab(key)}: ${value};`);
  }

  lines.push("}");
  return lines.join("\n");
}

function generateLightThemeVars(theme) {
  const dark = theme.themes.dark;
  const light = theme.themes.light;
  const lines = [];

  // Only emit semantic tokens that differ from dark
  const diffKeys = semanticKeys(light).filter(
    (k) => light[k] !== dark[k]
  );

  if (diffKeys.length > 0) {
    for (const key of diffKeys) {
      lines.push(`  --theme-${camelToKebab(key)}: ${light[key]};`);
    }
    lines.push("");
  }

  // Always emit glass tokens (they almost always differ)
  lines.push("  /* Glass tokens */");
  for (const [name, value] of glassEntries(light.glass, "--glass")) {
    lines.push(`  ${name}: ${value};`);
  }
  for (const [name, value] of glassEntries(light.glassLight, "--glass-light")) {
    lines.push(`  ${name}: ${value};`);
  }

  return lines.join("\n");
}

function generateLightTheme(theme) {
  const lines = [];
  lines.push('[data-theme="light"] {');
  lines.push(generateLightThemeVars(theme));
  lines.push("}");
  return lines.join("\n");
}

function generateLightFallback(theme) {
  const lines = [];
  lines.push("@media (prefers-color-scheme: light) {");
  lines.push("  :root:not([data-theme]) {");

  // Indent the inner vars by an extra 2 spaces (total 4)
  const varLines = generateLightThemeVars(theme)
    .split("\n")
    .map((l) => (l.trim() ? `  ${l}` : l));
  lines.push(varLines.join("\n"));

  lines.push("  }");
  lines.push("");
  lines.push("  :root:not([data-theme]) .video-overlay-vignette,");
  lines.push("  :root:not([data-theme]) .video-overlay-darken {");
  lines.push("    background: none;");
  lines.push("  }");
  lines.push("}");
  return lines.join("\n");
}

function generateMobileTypeScale(theme) {
  if (!theme.typeScaleMobile) return null;

  const lines = [];
  lines.push("@media (max-width: 767px) {");
  lines.push("  :root {");
  for (const [name, size] of Object.entries(theme.typeScaleMobile)) {
    lines.push(`    --text-${camelToKebab(name)}: ${size};`);
  }
  lines.push("  }");
  lines.push("}");
  return lines.join("\n");
}

function generateTypeUtilities(theme) {
  const lines = [];
  for (const [name, entry] of Object.entries(theme.typeScale)) {
    const kebab = camelToKebab(name);
    lines.push(
      `  .text-${kebab} { font-size: var(--text-${kebab}); line-height: ${entry.lineHeight}; }`
    );
  }
  return lines.join("\n");
}

// ─── Marker-Based Replacement ────────────────────────────────────────────────

const MARKER_SECTIONS = [
  "theme-inline",
  "dark-theme",
  "light-theme",
  "light-fallback",
  "mobile-type-scale",
  "type-utilities",
];

function replaceMarkerSection(css, sectionName, newContent) {
  const startMarker = `/* @generated:${sectionName} start */`;
  const endMarker = `/* @generated:${sectionName} end */`;

  const startIdx = css.indexOf(startMarker);
  const endIdx = css.indexOf(endMarker);

  if (startIdx === -1) {
    console.error(
      `Missing marker: "${startMarker}" not found in globals.css`
    );
    process.exit(1);
  }
  if (endIdx === -1) {
    console.error(
      `Missing marker: "${endMarker}" not found in globals.css`
    );
    process.exit(1);
  }
  if (endIdx < startIdx) {
    console.error(
      `Marker order error: "${endMarker}" appears before "${startMarker}"`
    );
    process.exit(1);
  }

  const before = css.slice(0, startIdx + startMarker.length);
  const after = css.slice(endIdx);

  return `${before}\n${newContent}\n${after}`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  const isCheck = process.argv.includes("--check");

  // Read and validate theme.json
  let themeRaw;
  try {
    themeRaw = readFileSync(THEME_PATH, "utf-8");
  } catch (err) {
    console.error(`Cannot read theme.json at ${THEME_PATH}: ${err.message}`);
    process.exit(1);
  }

  let theme;
  try {
    theme = JSON.parse(themeRaw);
  } catch (err) {
    console.error(`Invalid JSON in theme.json: ${err.message}`);
    process.exit(1);
  }

  validate(theme);

  // Read existing globals.css
  let css;
  try {
    css = readFileSync(CSS_PATH, "utf-8");
  } catch (err) {
    console.error(`Cannot read globals.css at ${CSS_PATH}: ${err.message}`);
    process.exit(1);
  }

  // Generate each section
  const sections = {
    "theme-inline": generateThemeInline(theme),
    "dark-theme": generateDarkTheme(theme),
    "light-theme": generateLightTheme(theme),
    "light-fallback": generateLightFallback(theme),
    "mobile-type-scale": generateMobileTypeScale(theme),
    "type-utilities": generateTypeUtilities(theme),
  };

  // Replace each marker section
  let result = css;
  for (const name of MARKER_SECTIONS) {
    const content = sections[name];
    if (content === null) continue; // Skip optional sections (e.g., no typeScaleMobile)
    result = replaceMarkerSection(result, name, content);
  }

  // Check mode: compare and report
  if (isCheck) {
    if (result === css) {
      console.log("globals.css is in sync with theme.json");
      process.exit(0);
    } else {
      console.error(
        "globals.css is out of sync with theme.json. Run: npm run sync-theme"
      );
      process.exit(1);
    }
  }

  // Write mode
  if (result === css) {
    console.log("sync-theme: globals.css already up to date");
  } else {
    writeFileSync(CSS_PATH, result, "utf-8");
    console.log("sync-theme: globals.css updated from theme.json");
  }
}

main();
