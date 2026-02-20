# PT Agra Energi Indonesia — Website Design Document
**Version 2.0 | For use with Claude Code**

### Changelog
| Version | Date | Changes |
|---|---|---|
| 1.0 | — | Initial design document |
| 1.1 | — | Added theme.json, Plotly pipeline, repo structure |
| 2.0 | 2026-02-19 | Added: complete design token system (neutrals, semantic colors, type scale, spacing scale, container widths). Added: full component specifications with props, states, and edge cases. Added: user flow / conversion funnel. Added: performance budgets, SEO requirements, browser support, accessibility standard. Resolved: partner logo layout → lattice grid (locked). Resolved: hero logo animation → precise scroll-trigger spec. Resolved: "View Projects" CTA → permanent scroll-to-map behavior. Expanded: footer spec with 4-column layout. Expanded: contact page with full form spec, validation, and error states. |

---

## 1. Project Overview

### Company
**PT Agra Energi Indonesia (AEI)** is a privately held Indonesian company, established in 2015, focused on high-impact oil and gas exploration. AEI acquires exploration blocks from the Indonesian government, connects major O&G operators (e.g., ENI) and state enterprises to develop wells, and retains an ownership stake in each project. The company is also expanding into geothermal project development.

### Website Purpose
This is a **B2B / business-to-investor** website. The primary goal is to convey:
- AEI's experience, integrity, and care
- The personal financial commitment AEI makes alongside its investors
- The authority of AEI's leadership and partner network
- The opportunity landscape in Indonesian O&G and geothermal energy

### Primary Call to Action
Prospective investors and operators should feel compelled to make contact.

### Reference Site
Design inspiration: [https://sonauraenergy.com](https://sonauraenergy.com) — clean, editorial, professional energy company with strong visual storytelling and clear section hierarchy.

---

## 2. Site Map

```
/ (Home)
├── /about              → Company history, mission, partner logos
├── /team               → Leadership bios and photos
├── /insights           → Market research, energy trends, geothermal narrative
├── /governance         → (Low visibility) Policy documents
│   ├── /governance/anti-corruption
│   ├── /governance/code-of-conduct
│   ├── /governance/communications
│   └── /governance/drugs-alcohol
└── /contact            → Contact information (embedded in footer + standalone page)
```

**Nav bar items:** `About` | `Insights` | `Contact` | *(Governance hidden — accessible via footer only)*

---

## 2.1 Primary User Flow — Investor / Partner Conversion

The website is designed to move a prospective investor or operating partner from first impression to contact in a single session. Every section on the home page advances one step in this funnel:

```
Landing (Hero)
  → "Who are they?"           Section 1–2: Authority, scale, deep-water positioning
  → "Who backs them?"         Section 3: Partner logos (Goldman Sachs, Temasek, major operators)
  → "Who runs it?"            Section 4: Team carousel — experienced leadership
  → "Where do they operate?"  Section 5: Interactive map — tangible project portfolio
  → "I want to talk."         Section 6: Footer contact info + nav Contact button (always visible)
```

**Key design principle:** The Contact button in the sticky nav bar is always visible after the hero scroll. A visitor should never need to scroll or navigate to find how to reach AEI. Every section should reinforce credibility and reduce perceived risk.

**Secondary flows:**
- **Deep-dive investor:** Home → Insights (reads articles, reviews data) → Contact
- **Due-diligence partner:** Home → About → Team → Governance (footer link) → Contact
- **Returning visitor:** Bookmarked `/insights` or `/contact` directly

**Metrics to track (recommend adding analytics):**
- Scroll depth on home page (what % reach the map? the footer?)
- Click-through rate on "View Projects" CTA
- Bounce rate by referral source

---

## 3. Page-by-Page Specification

---

### 3.1 Home Page (`/`)

The home page is the investor's first impression. It must be visually spectacular and communicate authority immediately. Below is the full scroll sequence.

---

#### Section 1 — Hero / Splash Screen

**Layout:** Full-viewport. Centered logo and company name over a full-bleed video or animated background.

**Content:**
- AEI logo (centered)
- Full company name: *PT Agra Energi Indonesia*
- No nav bar yet — this is a pure visual moment

**Background:** A looping, silent, high-quality video or Apple-style animated background of the ocean — deep water, calm, vast. Could use a royalty-free ocean footage placeholder until client-provided assets are delivered.

**Behavior — Logo Scroll Transition (precise spec):**
- **Trigger:** User scrolls past 30vh (30% of viewport height).
- **Animation:** The centered Lora "AEI" text (`--text-logo-splash`, 5rem) scales down and translates to the top-left corner of the viewport, becoming the nav bar logo (`--text-h4`, 1.25rem). Use GSAP ScrollTrigger with `scrub: true` so the animation is tied 1:1 to scroll position (not time-based).
- **Scroll range:** The animation maps across a 20vh scroll distance (from 30vh to 50vh). At 30vh, the logo is still centered. At 50vh, the logo is fully docked in the nav bar position.
- **What happens to the nav bar:** The full nav bar (links + Contact button) fades in with `opacity: 0 → 1` over the same 30vh–50vh scroll range. Before 30vh, only the logo is visible — no nav bar.
- **After transition:** The nav bar becomes `position: sticky; top: 0` and the logo remains in the top-left for the rest of the session. Scrolling back up to the hero reverses the animation (logo re-centers, nav bar fades out).
- **Mobile:** Same concept, but the logo stays centered until 40vh (slightly longer) and docks into a compact nav with the hamburger menu. The transition scroll range is 40vh–55vh.
- **Reduced motion:** If `prefers-reduced-motion` is enabled, skip the animation entirely. Show the nav bar with the docked logo immediately on page load. The hero section still shows the large centered logo text, but scrolling past it simply snaps to the sticky nav state with no transition.

**Style:** The logo during this splash state should be large and use the **Lora** serif font. The animation transition to the nav should be smooth (ease-in-out, ~600ms equivalent scrub).

---

#### Section 2 — Hero Banner (Post-Splash)

**Layout:** Full-width. Left-aligned text with ocean/nature image or video continuing as background. Frosted glass overlay on the text block for readability.

**Content:**
- **Headline:** `High Impact Deep Water Oil & Gas Exploration.`
- **Subheadline:** `PT Agra Energi Indonesia — privately held, operating at the frontier of Indonesian energy.`
- **CTA Button:** `View Projects` → smooth-scrolls to Section 5 (Interactive Map). This is the intended permanent behavior — the map *is* the projects page. No separate `/projects` route is planned.

**Style:**
- Headline font: Rubik, large, white or near-white
- Frosted glass card behind the text: `backdrop-filter: blur(12px)`, semi-transparent white or blue tint
- CTA button: `--bright-teal-blue` background, white text, rounded corners, subtle hover animation (lift + shadow)

---

#### Section 3 — Partner / Stakeholder Logos

**Layout:** Full-width section. Transition from image/video background to a clean `--neutral-50` plain background. Logo grid below.

**Content:**
- Section label: `Our Partners & Stakeholders`
- Logo display of key companies: **British Gas, ARCO, UNOCAL, Santos, Black Gold Energy, Goldman Sachs, Temasek**
- Note: Use placeholder grayscale versions of logos; client to provide approved assets.

**Display Style — Lattice Grid (Decision locked):**
A geometric lattice grid: logos placed at the intersection points of a subtle diamond/hexagonal pattern. The grid lines themselves are rendered as thin strokes in `--neutral-200` (light mode) or `--neutral-700` (dark mode), and logos sit at key nodes. Each logo is displayed in grayscale at rest. On hover, a logo colorizes, scales up slightly (1.05×), and the nearest lattice lines brighten to `--sky-reflection`. The lattice is responsive — on mobile, it collapses to a 2-column grid with the decorative lines hidden.

**Layout spec:**
- Desktop: 3–4 columns of diamond-shaped cells, logos centered in each. Max row count: 2 rows. If more than 8 logos, the grid scrolls horizontally with arrow buttons.
- Tablet: 3 columns, standard grid (no diamond pattern).
- Mobile: 2 columns, simple grid, no decorative lattice.

**Entrance animation:** Lattice lines draw in from center outward (SVG stroke-dashoffset animation, 800ms, staggered). Logos fade in once their lattice node reaches them.

**Background transition:** The transition from the ocean video/image to this section uses a subtle wave-shaped SVG divider (`<SectionDivider />` component). The video fades to 0 opacity over the divider height (~80px), and the plain background picks up underneath.

---

#### Section 4 — Meet the Team (Preview)

**Layout:** Full-width section on a plain background. Horizontal carousel of team member cards.

**Content:**
- Section heading: `Meet the Team`
- Cards for key leadership (CEO, CFO, CTO, and other major roles)
- Each card: headshot photo, name, title, 1–2 line bio excerpt

**Card Behavior:**
- Default: Card shows photo, name, and title
- On hover: Card expands or flips to reveal the bio excerpt and a "Read more →" link to `/team`
- Carousel: Drag/swipe enabled on mobile, arrow buttons on desktop

**Style:**
- Cards use frosted glass styling when hovering over a background image, or clean white cards on plain background
- Subtle entrance animation on scroll: cards fade in and slide up sequentially

---

#### Section 5 — Interactive Map (Exploration Blocks)

**Layout:** Two-column. Left column: block info panel. Right column: 3D map visualization. The map visually bleeds into the left column (overflow, no hard border between columns).

**Left Column — Info Panel:**
- Heading: `Exploration Blocks`
- List of block names (e.g., Talu, Jelu, Gaia, Gojo, Bulu — placeholders; client to confirm)
- When a block is hovered on the map OR clicked in the list, the panel updates to show:
  - Block name
  - Location / basin
  - Status (e.g., Active Exploration, Under Development, Divested)
  - Brief description (2–3 sentences)

**Right Column — Map Visualization:**
- Covers Southeast Asia, restricted to roughly: 90°E–145°E longitude, 10°S–20°N latitude
- Rendered as a **3D curved surface** (not a full globe) — a subtle curvature to give depth without needing the full sphere. Achieve this with a slight perspective transform and a curved horizon line.
- Style: Dark wireframe / topographic aesthetic. Deep navy or near-black background, teal/cyan grid lines (matching `--bright-teal-blue` / `--sky-reflection`).
- Highlighted block areas: Polygon overlays in `--bright-amber` or `--coral-glow` that glow on hover.
- Controls: Zoom in/out (scroll wheel + buttons). Pan within the Southeast Asia bounds. Elastic bounce-back if user tries to pan outside the defined boundary.
- **Tech:** D3.js with a custom orthographic projection, tilted to simulate a 3D curved surface over Southeast Asia. Block geodata served as GeoJSON from the FastAPI backend (PostGIS source). No API key required.

**Interactions:**
- Hovering a block polygon: Highlights the polygon, updates the left info panel, shows a tooltip with the block name
- Clicking a block: Locks the info panel to that block's data
- Keyboard accessible: Tab through blocks

---

#### Section 6 — Footer

**Layout:** Full-width footer. Dark background (`--jet-black`). Four-column grid on desktop, stacking to two columns on tablet and single column on mobile. Top border: 1px `--neutral-700`.

**Column 1 — Brand:**
- AEI logo (white version, Lora, `--text-h3` size)
- Tagline: "High Impact Deep Water Oil & Gas Exploration" in `--text-small`, `--neutral-400`
- © 2025 PT Agra Energi Indonesia. All rights reserved. (in `--text-xs`, `--neutral-600`)

**Column 2 — Navigation:**
- Heading: "Company" in `--text-xs`, uppercase, `--neutral-400`, letter-spacing 0.1em
- Links: About | Team | Insights | Contact
- Link style: `--text-small`, `--neutral-200` default, `--sky-reflection` on hover, underline on hover

**Column 3 — Legal & Governance:**
- Heading: "Legal" in `--text-xs`, uppercase, `--neutral-400`, letter-spacing 0.1em
- Links: Anti-Corruption Policy | Code of Conduct | Communications Policy | Drugs & Alcohol Policy
- Link style: Same as Column 2 but in `--neutral-400` (more subdued). `--neutral-200` on hover.

**Column 4 — Contact:**
- Heading: "Get in Touch" in `--text-xs`, uppercase, `--neutral-400`, letter-spacing 0.1em
- Phone number (linked with `tel:` href)
- Email address (linked with `mailto:` href)
- Registered address (plain text, `--text-small`, `--neutral-400`)

**Bottom bar (optional):** A single-line bar below the columns (separated by 1px `--neutral-800` border) with the copyright notice if it isn't in Column 1. This is a layout decision — either works, but pick one location for the copyright, not both.

**Style:** Clean, minimal. Vertical padding: `--space-16` top and bottom. Column gap: `--space-8`.

---

### 3.2 About Page (`/about`)

**Sections:**
1. **Hero:** Short headline — `"Over 100 Years of Combined Experience in Indonesian Energy."` — over a nature/geology background image.
2. **History:** Prose paragraph using the existing company history copy. Highlight key year (2015) and key operator names.
3. **Partner Logos:** Same floating logo display as the Home page (reusable component).
4. **Mission Statement:** Two founder-chosen quotes, styled as large pull-quotes in Lora serif italic, centered, with a subtle decorative rule or quotation mark glyph:
   - *"Formula for success: rise early, work hard, strike oil."* — J. Paul Getty
   - *"In the midst of chaos, there is also opportunity."* — Sun Tzu

   Both quotes are included for now; their prominence may be reduced in a future revision.

---

### 3.3 Team Page (`/team`)

**Layout:** Grid of team member cards.

**Each card contains:**
- Professional headshot
- Name (Rubik, bold)
- Title
- Full bio paragraph
- LinkedIn link (optional)

**Style:** Cards with frosted glass or clean white. Hover state: slight lift and shadow. Entrance animation: staggered fade-in on scroll.

---

### 3.4 Insights Page (`/insights`)

**Purpose:** Establish thought leadership. Tell the story of Indonesia's energy landscape — demand trends, decarbonization, energy security — and introduce geothermal development as a natural evolution for AEI. Each article is a narrative with embedded interactive charts, written and analyzed by the AEI team.

#### Content Architecture — MDX + Plotly

Each insight article is an **MDX file** (Markdown + embedded React components). This means:
- Prose is written in plain Markdown
- Interactive Plotly charts are dropped inline as React components wherever they belong in the narrative
- No CMS needed — articles are files in the repo under `/content/insights/`
- Next.js renders each MDX file as a static page at `/insights/[slug]`, fully indexed by search engines

**Article file structure:**
```
/content/insights/
  indonesia-energy-demand-2025.mdx
  geothermal-opportunity-sea.mdx
  deepwater-exploration-outlook.mdx
  ...
```

**Frontmatter schema per article (YAML at top of each MDX file):**
```yaml
---
title: "Indonesia's Energy Demand: The Case for Deepwater"
slug: indonesia-energy-demand-2025
date: 2025-03-01
category: O&G         # O&G | Geothermal | Policy | Market
excerpt: "A data-driven look at why Indonesia's growing demand makes deepwater exploration critical."
coverImage: /images/insights/deepwater-cover.jpg
chartData: /data/insights/indonesia-demand.json
author: AEI Research Team
---
```

**Example MDX article body:**
```mdx
Indonesia's primary energy consumption has grown at an average of 3.2% annually
since 2010, driven by rapid industrialization and a population approaching 280 million.

<InsightChart
  dataPath="/data/insights/indonesia-demand.json"
  title="Indonesia Primary Energy Consumption (2010–2024)"
  caption="Source: IEA, 2024"
/>

Despite this growth, per-capita energy consumption remains well below the global
average, signaling significant headroom — and opportunity — for new supply.
```

#### Python Analysis → Chart Data Pipeline

```
analysis.py (pandas + plotly.py)
    ↓
fig.to_json()              # Full Plotly figure spec serialized to JSON
    ↓
/public/data/insights/indonesia-demand.json    # Static file, committed to repo
    ↓
<InsightChart /> component     # Reads JSON, passes to react-plotly.js
    ↓
Interactive Plotly chart rendered in browser
```

The `fig.to_json()` output is consumed directly by `react-plotly.js` with no translation:

```jsx
// components/InsightChart.jsx
import dynamic from 'next/dynamic';
import chartData from '@/public/data/insights/indonesia-demand.json';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function InsightChart({ dataPath, title, caption }) {
  return (
    <figure className="glass-card-dark my-8 p-4">
      <Plot
        data={chartData.data}
        layout={{ ...chartData.layout, ...aeiTheme.layout }}
        config={{ displayModeBar: false, responsive: true }}
      />
      {caption && <figcaption className="text-sky-reflection text-sm mt-2">{caption}</figcaption>}
    </figure>
  );
}
```

Note: `react-plotly.js` must be loaded with `dynamic(..., { ssr: false })` because it requires the browser's `window` object.

#### AEI Plotly Theme (Python)

Define once in a shared `aei_theme.py` and import into every analysis script:

```python
# analysis/aei_theme.py

AEI_THEME = {
    "font":         {"family": "Manrope, sans-serif", "color": "#84bcda"},
    "paper_bgcolor": "rgba(0,0,0,0)",        # transparent — glass card provides background
    "plot_bgcolor":  "rgba(0,0,0,0)",
    "colorway":     ["#067bc2", "#84bcda", "#ecc30b", "#f37748", "#162521"],
    "xaxis": {
        "gridcolor":  "rgba(132, 188, 218, 0.15)",
        "linecolor":  "rgba(132, 188, 218, 0.30)",
        "tickfont":   {"family": "Manrope, sans-serif", "color": "#84bcda"},
        "title_font": {"family": "Rubik, sans-serif",  "color": "#ffffff"},
    },
    "yaxis": {
        "gridcolor":  "rgba(132, 188, 218, 0.15)",
        "linecolor":  "rgba(132, 188, 218, 0.30)",
        "tickfont":   {"family": "Manrope, sans-serif", "color": "#84bcda"},
        "title_font": {"family": "Rubik, sans-serif",  "color": "#ffffff"},
    },
    "hoverlabel": {
        "bgcolor":    "rgba(22, 37, 33, 0.90)",
        "bordercolor":"rgba(132, 188, 218, 0.40)",
        "font":       {"family": "Manrope, sans-serif", "color": "#ffffff"},
    },
    "legend": {
        "bgcolor":    "rgba(22, 37, 33, 0.60)",
        "bordercolor":"rgba(132, 188, 218, 0.20)",
        "font":       {"family": "Manrope, sans-serif", "color": "#84bcda"},
    },
    "title": {
        "font": {"family": "Rubik, sans-serif", "color": "#ffffff", "size": 18},
        "x": 0.0,     # left-aligned title
    },
    "margin": {"l": 48, "r": 24, "t": 48, "b": 48},
}

def apply_theme(fig):
    """Apply AEI theme to any Plotly figure and export to JSON."""
    fig.update_layout(**AEI_THEME)
    return fig

def export(fig, output_path: str):
    """Theme and export figure to JSON for the frontend."""
    apply_theme(fig)
    with open(output_path, "w") as f:
        f.write(fig.to_json())
```

**Usage in an analysis script:**
```python
# analysis/indonesia_demand.py
import plotly.graph_objects as go
import pandas as pd
from aei_theme import export

df = pd.read_csv("data/raw/indonesia_energy.csv")

fig = go.Figure()
fig.add_trace(go.Scatter(
    x=df["year"], y=df["consumption_mtoe"],
    mode="lines+markers",
    name="Primary Energy (Mtoe)",
    line={"width": 2.5}
))
fig.update_layout(title_text="Indonesia Primary Energy Consumption (2010–2024)")

export(fig, "../../public/data/insights/indonesia-demand.json")
```

#### `/insights` Index Page Sections

1. **Hero stat strip:** 2–3 large animated numbers that count up on scroll entry — e.g., Indonesia's annual energy demand growth rate, Indonesia's geothermal potential in GW, number of active PSCs (Production Sharing Contracts). Values hardcoded from research; `<StatCounter />` component handles animation.

2. **Article index:** Grid of insight cards — cover image, category tag (color-coded: `--bright-teal-blue` for O&G, `--coral-glow` for Geothermal, `--sky-reflection` for Policy/Market), title, date, excerpt, and "Read →" link.

3. **Featured geothermal section:** A visually distinct full-width section between article cards — volcano/geology imagery background, frosted glass overlay, short prose introducing AEI's geothermal expansion thesis. Links to the relevant geothermal insight article.

---

### 3.5 Governance Pages (`/governance/*`)

**Minimal design.** Plain, clean document-style layout. White background, Manrope body text. No hero images. Accessible from footer only — not in main nav.

Each policy page: Title, last updated date, body text.

---

### 3.6 Contact (`/contact` + footer embed)

**Purpose:** This is the primary conversion endpoint. Every other page funnels here. The Contact button in the nav bar links to this page.

**Layout:** Centered card (`<GlassCard variant="light">`, max-width `--container-sm`) on a `--neutral-50` background. Optional: subtle ocean imagery at 5% opacity behind the card for visual continuity with the rest of the site.

**Content — Two-column card interior (stacks on mobile):**

**Left column — Direct contact info:**
- Heading: "Get in Touch" (`--text-h2`)
- Phone number (linked with `tel:` href, with country code: +62)
- Email address (linked with `mailto:` href)
- Registered address (plain text)
- Note: "We typically respond within 2 business days" in `--text-small`, `--neutral-400`

**Right column — Contact form:**

| Field | Type | Required | Validation |
|---|---|---|---|
| Name | text input | Yes | Min 2 characters |
| Organization | text input | No | — |
| Email | email input | Yes | Valid email format |
| Phone | tel input | No | — |
| Message | textarea | Yes | Min 20 characters, max 2000 |

**Form states:**
- **Default:** Fields with `--neutral-200` border, `--text-body` placeholder text in `--neutral-400`.
- **Focus:** Border transitions to `--bright-teal-blue`, subtle blue glow (`box-shadow: 0 0 0 3px rgba(6, 123, 194, 0.15)`).
- **Error:** Border `--color-error`, error message below field in `--text-xs`, `--color-error`.
- **Submitting:** Submit button enters loading state (spinner, disabled). Form fields become read-only.
- **Success:** Form replaced with a success message: "Thank you for reaching out. We'll be in touch shortly." in `--text-h3` with a checkmark icon in `--color-success`.
- **Server error:** Inline error banner above the form: "Something went wrong. Please try again or email us directly at [email]." Banner uses `--color-error` at 10% opacity background with `--color-error` text.

**Submit button:** `<Button variant="primary" size="lg">Send Message</Button>`

**Backend:** `POST /api/contact` — FastAPI endpoint. Validates server-side. Sends notification email to AEI team (email service TBD — suggest Resend or SendGrid). Returns `200` on success, `422` on validation error, `500` on server failure.

**Spam prevention:** Honeypot field (hidden input, if filled → reject) + rate limiting (5 submissions per IP per hour). No CAPTCHA unless abuse is observed post-launch.

---

## 4. Visual Style Guide

### 4.1 Color Palette

#### Brand Colors

| Token | Hex | Usage |
|---|---|---|
| `--bright-teal-blue` | `#067bc2` | Primary brand, CTAs, links, map grid |
| `--sky-reflection` | `#84bcda` | Secondary accent, hover states, subtle tints |
| `--bright-amber` | `#ecc30b` | Highlight, active map blocks, attention |
| `--coral-glow` | `#f37748` | Warm accent, geothermal section, alerts |
| `--jet-black` | `#162521` | Footer, dark sections, map background |

#### Neutral Scale

Used for text, borders, backgrounds, and subtle hierarchy. Derived from `--jet-black` to keep a consistent green-tinted undertone across the palette.

| Token | Hex | Usage |
|---|---|---|
| `--neutral-950` | `#0c1512` | Darkest background (map, overlays) |
| `--neutral-900` | `#162521` | Same as `--jet-black`. Footer, dark sections |
| `--neutral-800` | `#1e332d` | Card backgrounds on dark surfaces |
| `--neutral-700` | `#2d4a42` | Borders on dark surfaces |
| `--neutral-600` | `#3d6358` | Muted text on dark backgrounds |
| `--neutral-400` | `#7a9e94` | Placeholder text, disabled states |
| `--neutral-200` | `#c8dbd6` | Borders on light surfaces |
| `--neutral-100` | `#e8f0ed` | Light card backgrounds, section tints |
| `--neutral-50` | `#f4f8f6` | Page background (light sections) |
| `--white` | `#ffffff` | Text on dark backgrounds, card backgrounds |

#### Semantic Colors

| Token | Hex | Derived From | Usage |
|---|---|---|---|
| `--color-primary` | `#067bc2` | `--bright-teal-blue` | Primary actions, links |
| `--color-primary-hover` | `#0568a3` | Darkened 15% | Hover state for primary elements |
| `--color-success` | `#2a9d6e` | — | Positive status indicators |
| `--color-warning` | `#ecc30b` | `--bright-amber` | Warnings, attention states |
| `--color-error` | `#d93636` | — | Form validation, destructive actions |

#### Accessibility

The founder is color-blind. These rules are non-negotiable:

- **WCAG AA minimum** (4.5:1 for body text, 3:1 for large text / UI elements) on all text/background combinations.
- **Never rely on color alone** to convey information. All status indicators must pair color with an icon, label, or pattern.
- Blue is the primary brand color by design. Avoid red/green distinctions entirely — use blue/amber or blue/coral when contrast between two states is needed.
- The `--coral-glow` and `--bright-amber` combination is acceptable for geothermal vs. O&G differentiation because both are distinguishable by luminance and hue for most color-blind types.
- Test all pages with a Deuteranopia simulation (Chrome DevTools → Rendering → Emulate vision deficiency) before shipping.

### 4.2 Typography

#### Font Families

| Role | Font | Weight | Notes |
|---|---|---|---|
| Logo | **Lora** (Serif) | 700 | Used for AEI wordmark only |
| Section Headers | **Rubik** (Sans-Serif) | 600–700 | H1, H2, hero headlines |
| Body / UI | **Manrope** (Sans-Serif) | 400–500 | Paragraphs, nav items, captions |
| Pull Quotes | **Lora** (Serif) | 400 italic | Founder quotes, featured callouts |

Import from Google Fonts:
```
https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,700;1,400&family=Rubik:wght@400;600;700&family=Manrope:wght@400;500;600&display=swap
```

#### Type Scale

Base unit: `16px` (1rem). Scale factor: ~1.25 (Major Third). All sizes expressed in `rem` for accessibility (respects user font-size preferences).

| Token | Size | Line Height | Weight | Font | Usage |
|---|---|---|---|---|---|
| `--text-hero` | `3.5rem` (56px) | 1.1 | 700 | Rubik | Hero headline only |
| `--text-h1` | `2.5rem` (40px) | 1.2 | 700 | Rubik | Page titles |
| `--text-h2` | `2rem` (32px) | 1.25 | 600 | Rubik | Section headings |
| `--text-h3` | `1.5rem` (24px) | 1.3 | 600 | Rubik | Sub-section headings |
| `--text-h4` | `1.25rem` (20px) | 1.4 | 600 | Rubik | Card titles, sidebar headings |
| `--text-body` | `1rem` (16px) | 1.6 | 400 | Manrope | Body copy, paragraphs |
| `--text-body-lg` | `1.125rem` (18px) | 1.6 | 400 | Manrope | Lead paragraphs, hero subtitles |
| `--text-small` | `0.875rem` (14px) | 1.5 | 400 | Manrope | Captions, metadata, nav items |
| `--text-xs` | `0.75rem` (12px) | 1.4 | 500 | Manrope | Tags, badges, fine print |
| `--text-quote` | `1.75rem` (28px) | 1.4 | 400i | Lora | Pull quotes, featured callouts |
| `--text-stat` | `3rem` (48px) | 1.0 | 700 | Rubik | Stat counter numbers |
| `--text-logo-splash` | `5rem` (80px) | 1.0 | 700 | Lora | Splash screen logo text |

**Mobile overrides (below 768px):**

| Token | Desktop | Mobile |
|---|---|---|
| `--text-hero` | 3.5rem | 2.25rem |
| `--text-h1` | 2.5rem | 1.75rem |
| `--text-h2` | 2rem | 1.5rem |
| `--text-quote` | 1.75rem | 1.375rem |
| `--text-stat` | 3rem | 2.25rem |
| `--text-logo-splash` | 5rem | 3rem |

### 4.2.1 Spacing Scale

Base unit: `4px`. All spacing should use multiples of this base to maintain a consistent vertical rhythm.

| Token | Value | Common Usage |
|---|---|---|
| `--space-1` | `4px` | Inline icon gaps, tight padding |
| `--space-2` | `8px` | Between related elements (label + input) |
| `--space-3` | `12px` | Internal card padding (tight) |
| `--space-4` | `16px` | Standard card padding, element margins |
| `--space-6` | `24px` | Between cards in a grid, section sub-gaps |
| `--space-8` | `32px` | Between major elements within a section |
| `--space-12` | `48px` | Between sections (mobile) |
| `--space-16` | `64px` | Between sections (tablet) |
| `--space-24` | `96px` | Between sections (desktop) |
| `--space-32` | `128px` | Hero vertical padding |

**Container widths:**

| Token | Value | Usage |
|---|---|---|
| `--container-sm` | `640px` | Governance pages, narrow prose |
| `--container-md` | `768px` | Insights article body |
| `--container-lg` | `1024px` | General content |
| `--container-xl` | `1280px` | Max site width, wide sections |

Content is always centered horizontally with `--space-4` (16px) minimum side padding on mobile.

### 4.3 Glassmorphism (Frosted Glass) Style

Use on components overlaid on video/image backgrounds (hero text cards, map info panel, modal overlays).

```css
.glass-card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}
```

For dark-tinted glass (map panel, dark sections):
```css
.glass-card-dark {
  background: rgba(22, 37, 33, 0.55); /* --jet-black at 55% opacity */
  backdrop-filter: blur(14px);
  border: 1px solid rgba(132, 188, 218, 0.2); /* --sky-reflection border */
  border-radius: 16px;
}
```

### 4.4 Imagery

**Provided by client.** Placeholder sources until client assets are delivered:
- Ocean / deepwater imagery: [Unsplash - ocean search](https://unsplash.com/s/photos/deep-ocean)
- Indonesian landscape / jungle
- Volcano / geothermal geology
- Offshore drilling platform (tasteful, distant shot)

**Video backgrounds:** Short (8–15 second) looping MP4s, no audio. Compress to <5MB for web. Use `<video autoplay muted loop playsinline>` with a static image fallback.

**Apple-style animated backgrounds:** Use CSS/Canvas animated gradient blobs or particle effects as an alternative to video for lower-bandwidth contexts. Preferred: slow-drifting radial gradients in blues and teals.

### 4.5 Motion & Animation Principles

- **Scroll-triggered entrance:** Elements fade in + translate Y(20px → 0) on entering viewport. Use `IntersectionObserver`. Stagger delay for grouped items (e.g., cards).
- **Hover effects:** Subtle lift (`transform: translateY(-4px)`), shadow increase, 200ms ease.
- **Logo scroll transition:** Logo shrinks from hero center to nav top-left over ~600ms on first scroll. Use GSAP ScrollTrigger or vanilla CSS scroll listener.
- **Map block hover:** Polygon glow pulse, smooth color transition 150ms.
- **Counter animation:** Stats count up from 0 when scrolled into view (use CountUp.js or vanilla requestAnimationFrame).
- **No aggressive motion:** Respect `prefers-reduced-motion` media query — disable all non-essential animations for users who have it enabled.

---

## 5. Responsive / Mobile Behavior

- **Breakpoints:** Mobile < 768px | Tablet 768–1024px | Desktop > 1024px
- **Nav:** Desktop = horizontal nav bar. Mobile = hamburger menu (slides in from right).
- **Hero logo transition:** On mobile, logo stays centered slightly longer before transitioning to top-left nav.
- **Interactive Map:** On mobile, the two-column layout stacks vertically. Map goes full-width on top; info panel below. Tap to select blocks instead of hover.
- **Team carousel:** Swipeable on touch devices.
- **Partner logos:** Single-speed scroll on mobile (no drift animation — too distracting on small screens).

---

## 6. Technical Notes for Claude Code

### Recommended Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend Framework | **Next.js** (React) | SSR/SSG for SEO — critical for `/insights` articles being indexed. React Bits components are fully compatible. |
| Styling | **Tailwind CSS** + CSS custom properties | Utility-first, pairs well with component libraries |
| Map | **D3.js** | Custom orthographic/tilted projection for 3D curved Southeast Asia view. No API key or usage costs. |
| Charts | **Plotly** (`plotly.py` + `react-plotly.js`) | Python-native analysis pipeline; `fig.to_json()` consumed directly by React. No license cost. Fully themeable to AEI palette. |
| Insights Content | **MDX** (Markdown + JSX) | Articles written in Markdown with `<InsightChart />` components embedded inline. Processed by `@next/mdx` or `next-mdx-remote`. |
| Animation | **GSAP** (ScrollTrigger) | Logo scroll transition, entrance animations. CSS transitions for micro-interactions. |
| Fonts | Google Fonts via `next/font` | Lora, Rubik, Manrope |
| Video | HTML5 `<video>` | `autoplay muted loop playsinline` with static poster fallback |
| Backend | **FastAPI** (Python) | Lightweight, async, JSON-native. Serves GeoJSON block data and contact form endpoint. Shares Python environment with analysis scripts. |
| Database | **PostgreSQL + PostGIS** | Industry standard for GIS/shapefile data storage and geographic queries. Shapefiles imported via `ogr2ogr`. |
| GIS Data Format | **Shapefile → PostGIS** | `ogr2ogr` imports to PostGIS; FastAPI serves as GeoJSON to D3 frontend. |

### CSS Variables to Define Globally
```css
:root {
  --bright-teal-blue: #067bc2;
  --sky-reflection: #84bcda;
  --bright-amber: #ecc30b;
  --coral-glow: #f37748;
  --jet-black: #162521;

  --font-serif: 'Lora', Georgia, serif;
  --font-sans-header: 'Rubik', sans-serif;
  --font-sans-body: 'Manrope', sans-serif;
}
```

### GIS Data Pipeline

Exploration block boundaries will be provided as **shapefiles** (.shp + .dbf + .prj + .shx). The pipeline to get them onto the map:

```
Shapefile → ogr2ogr → PostGIS (PostgreSQL) → FastAPI endpoint → GeoJSON → D3.js
```

1. **Import:** `ogr2ogr -f "PostgreSQL" PG:"dbname=aei_db" blocks.shp -nln exploration_blocks`
2. **FastAPI endpoint:** `GET /api/blocks` returns a GeoJSON FeatureCollection; `GET /api/blocks/{id}` returns a single block with full metadata
3. **D3 renders:** the GeoJSON polygons as SVG paths on the tilted orthographic projection
4. **Block metadata schema (per feature):**
   - `id` — unique block identifier
   - `name` — display name (e.g., "Talu Block")
   - `basin` — geological basin name
   - `status` — enum: `Active Exploration` | `Under Development` | `Divested` | `Pending`
   - `description` — 2–3 sentence summary (plain text)
   - `aei_stake_pct` — AEI ownership percentage (optional, may be sensitive)
   - `partners` — array of partner/operator names

Until shapefiles are available, use placeholder GeoJSON polygons over known Indonesian basins for development purposes.

### Component Specifications

Each component below lists its props, visual states, and edge-case behaviors. All components consume design tokens from `theme.json` via the Tailwind config — no hardcoded colors, sizes, or fonts in component files.

---

#### `<NavBar />`

| Prop | Type | Default | Description |
|---|---|---|---|
| `transparent` | `boolean` | `true` | Whether the navbar is transparent (over hero) or solid |

**States:**
- **Pre-scroll (hero visible):** Hidden entirely. Only the centered splash logo is visible.
- **Transitioning (30vh–50vh):** Fading in. Background is transparent. Logo is mid-animation from center to top-left.
- **Docked (past 50vh):** `position: sticky; top: 0`. Background: `--jet-black` at 85% opacity with `backdrop-filter: blur(12px)`. Logo top-left (Lora, `--text-h4`). Links center-right. Contact button far-right.
- **Mobile docked:** Logo top-left. Hamburger icon top-right. Tapping hamburger opens a full-screen overlay (`--jet-black` 95% opacity) with links stacked vertically, centered, `--text-h3` size. Close button (×) top-right.

**Nav items:** `About` | `Insights` | `Contact` (Governance is footer-only)
**Contact button:** `--bright-teal-blue` background, white text, `--borderRadius-button` (8px), hover: `--color-primary-hover` background + `translateY(-2px)` lift.

**Edge cases:**
- If JavaScript fails to load, the nav bar should be visible in its docked state by default (progressive enhancement). The scroll animation is an enhancement, not a requirement.

---

#### `<GlassCard />`

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'light' \| 'dark'` | `'light'` | Which glass style to apply |
| `hoverable` | `boolean` | `false` | Whether the card lifts on hover |
| `as` | `string` | `'div'` | HTML element to render as |

**States:**
- **Default:** Glass background per variant (from `theme.json → glass.light` or `glass.dark`). Border radius: `--borderRadius-card`.
- **Hover (if `hoverable`):** `translateY(-4px)`, shadow increases, transition `--animation-hoverDuration`.
- **Focus-visible:** 2px solid `--bright-teal-blue` outline, 2px offset. (Keyboard accessibility.)

**Edge case:** On browsers that don't support `backdrop-filter` (rare, but includes some older Firefox versions), fall back to a solid semi-transparent background with no blur. Use `@supports (backdrop-filter: blur(1px))` to feature-detect.

---

#### `<Button />`

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Sizing |
| `href` | `string?` | — | If provided, renders as `<a>` instead of `<button>` |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Loading state (shows spinner, disables click) |

**Variants:**

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| `primary` | `--bright-teal-blue` | `--white` | none | `--color-primary-hover` bg, lift -2px |
| `secondary` | transparent | `--bright-teal-blue` | 1px solid `--bright-teal-blue` | `--bright-teal-blue` bg at 10% opacity |
| `ghost` | transparent | `--neutral-400` | none | text → `--white` |

**Sizes:**

| Size | Padding | Font | Border Radius |
|---|---|---|---|
| `sm` | `--space-2` × `--space-4` | `--text-small` | `--borderRadius-button` |
| `md` | `--space-3` × `--space-6` | `--text-body` | `--borderRadius-button` |
| `lg` | `--space-4` × `--space-8` | `--text-body-lg` | `--borderRadius-button` |

**States:**
- **Disabled:** opacity 0.5, cursor `not-allowed`, no hover effect.
- **Loading:** Content replaced with a 16px spinner (animated SVG circle in current text color). Button width is preserved (doesn't collapse).
- **Focus-visible:** 2px solid `--bright-teal-blue` outline, 2px offset.

---

#### `<TeamCard />`

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | — | Team member name |
| `title` | `string` | — | Job title |
| `bio` | `string` | — | Bio excerpt (1–2 sentences) |
| `photo` | `string?` | — | URL to headshot image |
| `linkedIn` | `string?` | — | LinkedIn profile URL |

**States:**
- **Default:** Photo (if available), name (`--text-h4`, Rubik bold), title (`--text-small`, `--neutral-400`). Card uses `<GlassCard variant="light" hoverable>`.
- **Hover (desktop):** Card expands height to reveal bio text and optional "Read more →" link to `/team`. Transition: `max-height` animation, 300ms ease.
- **Tap (mobile):** Same expand behavior as hover, triggered by tap. Second tap collapses.
- **No photo fallback:** Show a `--neutral-200` circle with the person's initials in `--text-h3`, `--neutral-600` text.

**Carousel behavior:**
- Desktop: Arrow buttons (`<` `>`) at left and right edges. Buttons are `<GlassCard variant="dark">` circles, 40px, with chevron icons.
- Mobile: Swipe-enabled (CSS `scroll-snap-type: x mandatory`). No arrow buttons. Dot indicators below.
- If only 1–2 team members exist, hide carousel controls and center the cards.

---

#### `<ExplorationMap />`

| Prop | Type | Default | Description |
|---|---|---|---|
| `blocksEndpoint` | `string` | `'/api/blocks'` | GeoJSON API URL |

**States:**
- **Loading:** Show the dark map background (`--neutral-950`) with a subtle pulsing grid animation and "Loading exploration data…" text centered.
- **Error / API failure:** Same dark background, message: "Unable to load map data. Please try again later." with a retry button.
- **Empty (0 blocks returned):** Map renders but no polygons. Info panel shows: "Exploration block data coming soon."
- **Active:** Full interactive map with block polygons.
- **Block hover:** Polygon fill transitions to `--bright-amber` at 40% opacity, stroke brightens. Tooltip appears with block name.
- **Block selected (click):** Polygon fill stays `--bright-amber` at 60% opacity. Info panel locks to that block. Clicking elsewhere or clicking the same block again deselects.

**Keyboard navigation:** Tab cycles through blocks in alphabetical order. Enter/Space selects. Escape deselects.

**Performance:** Lazy-load the D3 map component (Next.js `dynamic` with `ssr: false`). The GeoJSON fetch happens only when the map section enters the viewport (IntersectionObserver trigger at 200px before visible).

---

#### `<PartnerLogoGrid />`  *(renamed from PartnerLogoStrip)*

| Prop | Type | Default | Description |
|---|---|---|---|
| `logos` | `Array<{ name: string, src: string, href?: string }>` | — | Partner logo data |

**States:**
- **Loading:** Lattice grid lines drawn, logo positions show `--neutral-200` placeholder circles.
- **Loaded:** Logos appear at lattice nodes, grayscale.
- **Hover (individual logo):** Colorizes, scales 1.05×, nearest lattice lines brighten.
- **No logos (empty array):** Section is hidden entirely. Don't render an empty "Our Partners" heading.

---

#### `<StatCounter />`

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — | Target number |
| `suffix` | `string?` | — | e.g., "%", "GW", "+" |
| `prefix` | `string?` | — | e.g., "$", ">" |
| `label` | `string` | — | Description below the number |
| `duration` | `number` | `2000` | Count-up duration in ms |

**Behavior:** Counts from 0 to `value` when the element enters the viewport. Uses `requestAnimationFrame` with an ease-out curve. Only animates once (does not re-trigger on re-entry).

**Reduced motion:** Displays the final number immediately with no count animation.

---

#### `<SectionDivider />`

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'wave' \| 'straight'` | `'wave'` | Divider shape |
| `fromColor` | `string` | — | Top section color |
| `toColor` | `string` | — | Bottom section color |
| `flip` | `boolean` | `false` | Flip vertically |

Renders an SVG `<path>` that creates a smooth transition between two section backgrounds. Height: 60–80px. The SVG is `width: 100%; height: auto` and uses `preserveAspectRatio="none"` to stretch.

---

#### `<InsightCard />`

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Article title |
| `excerpt` | `string` | — | 1–2 sentence summary |
| `coverImage` | `string?` | — | Cover image URL |
| `category` | `'O&G' \| 'Geothermal' \| 'Policy' \| 'Market'` | — | Category tag |
| `date` | `string` | — | Publication date |
| `slug` | `string` | — | URL slug for link |

**Category tag colors:**

| Category | Background | Text |
|---|---|---|
| O&G | `--bright-teal-blue` at 15% opacity | `--bright-teal-blue` |
| Geothermal | `--coral-glow` at 15% opacity | `--coral-glow` |
| Policy | `--sky-reflection` at 15% opacity | `--sky-reflection` |
| Market | `--bright-amber` at 15% opacity | `--bright-amber` |

**No image fallback:** Use a gradient background (`--neutral-800` → `--neutral-900`) with the category tag color as a subtle overlay.

---

#### `<InsightChart />`

| Prop | Type | Default | Description |
|---|---|---|---|
| `dataPath` | `string` | — | Path to Plotly JSON file |
| `title` | `string?` | — | Override chart title |
| `caption` | `string?` | — | Source attribution below chart |

**States:**
- **Loading:** `--neutral-800` placeholder rectangle with a pulsing shimmer animation, same aspect ratio as final chart.
- **Error:** "Chart data unavailable" message in `--neutral-400` text, centered in the placeholder area.
- **Loaded:** Plotly chart rendered via `react-plotly.js`.

Wrapped in `<GlassCard variant="dark">`. Chart `displayModeBar: false`, `responsive: true`.

---

#### `<PullQuote />`

| Prop | Type | Default | Description |
|---|---|---|---|
| `quote` | `string` | — | Quote text |
| `attribution` | `string?` | — | Author name |

Renders as a `<blockquote>` with Lora italic at `--text-quote` size. Decorative oversized quotation mark glyph (") in `--bright-teal-blue` at 20% opacity, positioned top-left. Attribution in `--text-small`, `--neutral-400`, preceded by an em-dash.

---

## 6.1 Performance, SEO & Browser Support

### Performance Budgets

| Metric | Target | Measurement |
|---|---|---|
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse on 4G throttled |
| First Input Delay (FID) | < 100ms | Chrome UX Report |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse |
| Total page weight (home) | < 2MB initial load | Network tab, uncached |
| JavaScript bundle (main) | < 250KB gzipped | Webpack analyzer |
| Time to Interactive | < 3.5s | Lighthouse on 4G throttled |

### Lazy Loading Strategy

- **Hero video:** Loaded immediately (above fold). Use `poster` attribute for instant visual while video buffers.
- **Partner logos:** Load when Section 3 is 200px from viewport (IntersectionObserver).
- **Team photos:** Load when carousel enters viewport.
- **D3 map + GeoJSON:** Load when Section 5 is 200px from viewport. Use `next/dynamic` with `ssr: false`. Show shimmer placeholder during load.
- **Plotly charts (Insights):** Each chart loads only when its `<InsightChart />` component enters viewport. `react-plotly.js` is imported with `next/dynamic`.
- **Images:** Use Next.js `<Image>` component with automatic WebP/AVIF conversion, responsive `srcSet`, and blur placeholder (`blurDataURL`).

### SEO

- **Meta tags:** Each page has a unique `<title>` and `<meta name="description">`. Defined in page-level metadata exports (Next.js App Router `metadata` object).
- **Open Graph:** og:title, og:description, og:image for each page. Insights articles use their `coverImage` as og:image.
- **Structured data:** `Organization` schema on the home page. `Article` schema on each Insights article.
- **Sitemap:** Auto-generated via `next-sitemap`. Excludes `/governance/*` pages (`noindex`).
- **Robots:** Governance pages: `<meta name="robots" content="noindex, nofollow">`. All other pages: indexable.

### Browser Support

| Browser | Minimum Version |
|---|---|
| Chrome | Last 2 versions |
| Firefox | Last 2 versions |
| Safari | 15.4+ (needed for `backdrop-filter`) |
| Edge | Last 2 versions |
| Mobile Safari (iOS) | 15.4+ |
| Chrome Android | Last 2 versions |

**No IE 11 support.** The site uses CSS custom properties, `backdrop-filter`, CSS Grid, and ES2020+ features throughout.

### Accessibility Standard

**Target: WCAG 2.1 AA.** Key requirements:
- All interactive elements keyboard-navigable and focus-visible.
- All images have meaningful `alt` text (or `alt=""` for decorative images).
- Color contrast ratios meet AA minimums (see Section 4.1 Accessibility).
- `prefers-reduced-motion` respected for all animations.
- Map section is keyboard-navigable (tab through blocks, Enter to select).
- Contact form has proper `<label>` associations, `aria-describedby` for error messages, and `aria-live` regions for form state changes.

---

## 7. Master Theme Configuration

All visual design tokens — colors, fonts, border radii, spacing — live in **one file** at the root of the repo. Both the frontend and the Python analysis scripts read from this file. When the graphic designer updates a color or swaps a font, it propagates everywhere automatically.

### `theme.json` — Single Source of Truth

```json
{
  "_comment": "Master design token file. Edit here; changes propagate to Next.js (via theme.config.ts) and Plotly (via aei_theme.py).",

  "colors": {
    "brightTealBlue": "#067bc2",
    "skyReflection":  "#84bcda",
    "brightAmber":    "#ecc30b",
    "coralGlow":      "#f37748",
    "jetBlack":       "#162521",
    "white":          "#ffffff"
  },

  "neutrals": {
    "950": "#0c1512",
    "900": "#162521",
    "800": "#1e332d",
    "700": "#2d4a42",
    "600": "#3d6358",
    "400": "#7a9e94",
    "200": "#c8dbd6",
    "100": "#e8f0ed",
    "50":  "#f4f8f6"
  },

  "semantic": {
    "primary":       "#067bc2",
    "primaryHover":  "#0568a3",
    "success":       "#2a9d6e",
    "warning":       "#ecc30b",
    "error":         "#d93636"
  },

  "fonts": {
    "serif":      "Lora",
    "sansHeader": "Rubik",
    "sansBody":   "Manrope"
  },

  "fontWeights": {
    "regular": 400,
    "medium":  500,
    "semibold": 600,
    "bold":    700
  },

  "typeScale": {
    "hero":       { "size": "3.5rem",  "lineHeight": 1.1,  "weight": 700, "font": "sansHeader" },
    "h1":         { "size": "2.5rem",  "lineHeight": 1.2,  "weight": 700, "font": "sansHeader" },
    "h2":         { "size": "2rem",    "lineHeight": 1.25, "weight": 600, "font": "sansHeader" },
    "h3":         { "size": "1.5rem",  "lineHeight": 1.3,  "weight": 600, "font": "sansHeader" },
    "h4":         { "size": "1.25rem", "lineHeight": 1.4,  "weight": 600, "font": "sansHeader" },
    "bodyLg":     { "size": "1.125rem","lineHeight": 1.6,  "weight": 400, "font": "sansBody" },
    "body":       { "size": "1rem",    "lineHeight": 1.6,  "weight": 400, "font": "sansBody" },
    "small":      { "size": "0.875rem","lineHeight": 1.5,  "weight": 400, "font": "sansBody" },
    "xs":         { "size": "0.75rem", "lineHeight": 1.4,  "weight": 500, "font": "sansBody" },
    "quote":      { "size": "1.75rem", "lineHeight": 1.4,  "weight": 400, "font": "serif", "style": "italic" },
    "stat":       { "size": "3rem",    "lineHeight": 1.0,  "weight": 700, "font": "sansHeader" },
    "logoSplash": { "size": "5rem",    "lineHeight": 1.0,  "weight": 700, "font": "serif" }
  },

  "spacing": {
    "1":  "4px",
    "2":  "8px",
    "3":  "12px",
    "4":  "16px",
    "6":  "24px",
    "8":  "32px",
    "12": "48px",
    "16": "64px",
    "24": "96px",
    "32": "128px"
  },

  "containers": {
    "sm":  "640px",
    "md":  "768px",
    "lg":  "1024px",
    "xl":  "1280px"
  },

  "borderRadius": {
    "card":   "16px",
    "button": "8px",
    "pill":   "9999px"
  },

  "glass": {
    "light": {
      "background":   "rgba(255, 255, 255, 0.12)",
      "blur":         "14px",
      "border":       "rgba(255, 255, 255, 0.20)",
      "shadow":       "0 8px 32px rgba(0, 0, 0, 0.25)"
    },
    "dark": {
      "background":   "rgba(22, 37, 33, 0.55)",
      "blur":         "14px",
      "border":       "rgba(132, 188, 218, 0.20)",
      "shadow":       "0 8px 32px rgba(0, 0, 0, 0.40)"
    }
  },

  "animation": {
    "entranceDuration":   "600ms",
    "entranceEasing":     "cubic-bezier(0.16, 1, 0.3, 1)",
    "hoverDuration":      "200ms",
    "logoTransitionMs":   600
  }
}
```

---

### Frontend — `frontend/theme.config.ts`

Reads `theme.json` and re-exports everything as typed TypeScript constants. Tailwind and CSS variables both derive from this file.

```typescript
// frontend/theme.config.ts
import theme from '../theme.json';

export const colors = theme.colors;
export const fonts  = theme.fonts;
export const glass  = theme.glass;
export const animation = theme.animation;

// CSS custom property map — consumed by globals.css
export const cssVars = {
  '--bright-teal-blue': theme.colors.brightTealBlue,
  '--sky-reflection':   theme.colors.skyReflection,
  '--bright-amber':     theme.colors.brightAmber,
  '--coral-glow':       theme.colors.coralGlow,
  '--jet-black':        theme.colors.jetBlack,
  '--font-serif':       `'${theme.fonts.serif}', Georgia, serif`,
  '--font-sans-header': `'${theme.fonts.sansHeader}', sans-serif`,
  '--font-sans-body':   `'${theme.fonts.sansBody}', sans-serif`,
};
```

**`frontend/tailwind.config.ts`** — extends Tailwind with AEI tokens so you can write `bg-teal-blue`, `font-sans-header`, etc. in components:

```typescript
// frontend/tailwind.config.ts
import { colors, fonts } from './theme.config';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.mdx'],
  theme: {
    extend: {
      colors: {
        'teal-blue':    colors.brightTealBlue,
        'sky-reflection': colors.skyReflection,
        'bright-amber': colors.brightAmber,
        'coral-glow':   colors.coralGlow,
        'jet-black':    colors.jetBlack,
      },
      fontFamily: {
        serif:       [fonts.serif, 'Georgia', 'serif'],
        'sans-header': [fonts.sansHeader, 'sans-serif'],
        'sans-body':   [fonts.sansBody, 'sans-serif'],
      },
    },
  },
};
```

**`frontend/styles/globals.css`** — CSS custom properties injected at the `:root` level. These are available to any CSS or inline style across the app:

```css
/* Auto-generated from theme.config.ts — do not edit directly */
:root {
  --bright-teal-blue: #067bc2;
  --sky-reflection:   #84bcda;
  --bright-amber:     #ecc30b;
  --coral-glow:       #f37748;
  --jet-black:        #162521;

  --font-serif:       'Lora', Georgia, serif;
  --font-sans-header: 'Rubik', sans-serif;
  --font-sans-body:   'Manrope', sans-serif;
}
```

> **For Claude Code:** Generate `globals.css` CSS variables programmatically from `theme.config.ts` rather than hardcoding them, so they stay in sync with `theme.json` automatically.

---

### Backend / Analysis — `analysis/aei_theme.py`

Reads the same `theme.json` and builds the Plotly layout dict from it. No values are hardcoded:

```python
# analysis/aei_theme.py
import json
from pathlib import Path

# Load shared token file from repo root
_root = Path(__file__).resolve().parents[1]
with open(_root / "theme.json") as f:
    _t = json.load(f)

c = _t["colors"]
f = _t["fonts"]
g = _t["glass"]["dark"]

AEI_THEME = {
    "font":          {"family": f"{f['sansBody']}, sans-serif", "color": c["skyReflection"]},
    "paper_bgcolor": "rgba(0,0,0,0)",
    "plot_bgcolor":  "rgba(0,0,0,0)",
    "colorway":      [c["brightTealBlue"], c["skyReflection"], c["brightAmber"], c["coralGlow"]],
    "xaxis": {
        "gridcolor":  "rgba(132, 188, 218, 0.15)",
        "linecolor":  "rgba(132, 188, 218, 0.30)",
        "tickfont":   {"family": f"{f['sansBody']}, sans-serif",   "color": c["skyReflection"]},
        "title_font": {"family": f"{f['sansHeader']}, sans-serif", "color": c["white"]},
    },
    "yaxis": {
        "gridcolor":  "rgba(132, 188, 218, 0.15)",
        "linecolor":  "rgba(132, 188, 218, 0.30)",
        "tickfont":   {"family": f"{f['sansBody']}, sans-serif",   "color": c["skyReflection"]},
        "title_font": {"family": f"{f['sansHeader']}, sans-serif", "color": c["white"]},
    },
    "hoverlabel": {
        "bgcolor":    g["background"],
        "bordercolor": g["border"],
        "font":       {"family": f"{f['sansBody']}, sans-serif", "color": c["white"]},
    },
    "title": {
        "font": {"family": f"{f['sansHeader']}, sans-serif", "color": c["white"], "size": 18},
        "x": 0.0,
    },
    "margin": {"l": 48, "r": 24, "t": 48, "b": 48},
}

def apply_theme(fig):
    fig.update_layout(**AEI_THEME)
    return fig

def export(fig, output_path: str):
    apply_theme(fig)
    with open(output_path, "w") as f:
        f.write(fig.to_json())
```

---

### Designer Handoff Workflow

When the graphic designer is ready to make changes, their entire surface area is **`theme.json`** at the repo root. They change a hex value or a font name, and:

1. `frontend/theme.config.ts` picks it up → Tailwind classes update → `globals.css` CSS vars update → every component on the site reflects the change
2. `analysis/aei_theme.py` picks it up → every Plotly chart re-exported with the new palette

The designer never touches a component file. The developer never manually hunts for color values scattered across the codebase.

---

## 8. Recommended Repository Structure

```
aei-website/
├── theme.json                         # ← MASTER DESIGN TOKENS (designer edits here)
├── frontend/                          # Next.js app
│   ├── theme.config.ts                # Reads theme.json → typed TS exports + CSS var map
│   ├── tailwind.config.ts             # Extends Tailwind with AEI color/font tokens
│   ├── app/                           # App Router pages
│   │   ├── page.tsx                   # Home
│   │   ├── about/page.tsx
│   │   ├── team/page.tsx
│   │   ├── insights/
│   │   │   ├── page.tsx               # Insights index
│   │   │   └── [slug]/page.tsx        # Individual article
│   │   ├── governance/
│   │   │   └── [policy]/page.tsx
│   │   └── contact/page.tsx
│   ├── components/                    # Reusable components
│   │   ├── ui/
│   │   │   ├── GlassCard.tsx
│   │   │   ├── PullQuote.tsx
│   │   │   ├── StatCounter.tsx
│   │   │   └── SectionDivider.tsx
│   │   ├── layout/
│   │   │   ├── NavBar.tsx
│   │   │   └── Footer.tsx
│   │   ├── map/
│   │   │   └── ExplorationMap.tsx
│   │   ├── insights/
│   │   │   ├── InsightChart.tsx       # react-plotly.js wrapper (SSR disabled)
│   │   │   └── InsightCard.tsx
│   │   └── sections/
│   │       ├── HeroVideo.tsx
│   │       ├── PartnerLogoStrip.tsx
│   │       └── TeamCard.tsx
│   ├── content/
│   │   └── insights/                  # MDX article files
│   │       ├── indonesia-energy-demand.mdx
│   │       └── geothermal-opportunity.mdx
│   ├── public/
│   │   ├── images/
│   │   ├── videos/
│   │   └── data/
│   │       └── insights/              # Plotly JSON exports land here
│   │           ├── indonesia-demand.json
│   │           └── geothermal-potential.json
│   └── styles/
│       └── globals.css                # CSS custom properties (color palette)
│
├── backend/                           # FastAPI app
│   ├── main.py
│   ├── routers/
│   │   ├── blocks.py                  # GET /api/blocks, /api/blocks/{id}
│   │   └── contact.py                 # POST /api/contact
│   ├── models/
│   │   └── block.py                   # SQLAlchemy + GeoAlchemy2 models
│   └── db/
│       └── connection.py
│
└── analysis/                          # Python analysis scripts (not served)
    ├── aei_theme.py                   # Reads theme.json → Plotly theme + export helper
    ├── indonesia_demand.py
    ├── geothermal_potential.py
    └── data/
        └── raw/                       # Source CSVs, Excel files, etc.
```

---

## 8. Content Placeholders (To Be Provided by Client)

- [ ] AEI logo (SVG, light and dark versions)
- [ ] Ocean / deepwater video files (MP4, <5MB each, looping)
- [ ] Volcano / geology imagery for geothermal section
- [ ] Partner/stakeholder logos (SVG or high-res PNG, approved for web use): British Gas, ARCO, UNOCAL, Santos, Black Gold Energy, Goldman Sachs, Temasek
- [ ] Team headshots (professional photos, consistent style)
- [ ] Team bios (text, per person)
- [ ] Exploration block shapefiles (.shp + .dbf + .prj + .shx) with block name, basin, status, description, and partner data
- [ ] Founder quotes — confirmed: J. Paul Getty and Sun Tzu quotes (see Section 3.2); prominence TBD
- [ ] Insights article text and supporting raw data files (CSV/Excel) for Plotly analysis scripts
- [ ] Contact details (phone, email, registered Indonesian business address)
- [ ] Governance policy text (Anti-Corruption, Code of Conduct, Communications, Drugs & Alcohol)

---

## 9. Governance Section — Treatment Decision

The four governance policies are required for Indonesian business compliance but should not be visually prominent.

**Approach:**
- Removed from main navigation entirely
- Small links in the footer under a `Legal & Governance` subheading in subdued gray text
- Each policy at its own URL (`/governance/anti-corruption`, etc.) with a minimal document-style layout — no hero, no decorative elements, purely functional

---

*End of Design Document v2.0*
*Decisions locked: Next.js + FastAPI + D3 + Plotly + MDX + PostGIS | Lattice logo grid | Scroll-driven hero animation | Contact form with validation*
*Next step: Begin Home Page build in Claude Code using this document as the brief.*

