# PartnerLogoGrid Responsive Sizing

Technical reference for the responsive image sizing strategy in `frontend/components/sections/PartnerLogoGrid.tsx`.

## Problem

Partner logos have wildly different aspect ratios (0.75 to 6.44). On desktop, a `TARGET_AREA`-based computation normalizes their visual weight. On mobile (375px), these computed sizes (150-262px wide per logo) are too large for even two logos to sit side-by-side, causing a single-column stack.

## Why Next.js Image Makes This Hard

Next.js `<Image>` with `width`/`height` props renders an `<img>` with those values as HTML attributes. This is what controls the rendered size on desktop. The pitfalls:

1. **`style={{ width: "auto", height: "auto" }}`** overrides the HTML attributes, causing images to render at their *source file's natural pixel dimensions*. SVGs with large or undefined viewBoxes become enormous. This breaks desktop sizing completely.

2. **`w-auto` as a Tailwind class** has the same effect as #1. CSS `width: auto` on an `<img>` means "use intrinsic size", not "use the HTML width attribute."

3. **`max-w-full h-auto` is safe** because `max-w-full` only constrains (doesn't expand), and `h-auto` derives height proportionally from whatever the resolved width is. On desktop where the parent is wide, the HTML `width` attribute is the binding constraint. On mobile where the grid cell is narrow, `max-w-full` becomes the binding constraint and `h-auto` scales height down proportionally.

## Computed Desktop Sizes (TARGET_AREA = 40000)

| Logo       | Aspect Ratio | Width  | Height | Cell w/ p-4 |
|------------|-------------|--------|--------|-------------|
| BP         | 0.75        | 150px  | 200px  | 182px       |
| Mitsui     | 0.82        | 164px  | 200px  | 196px       |
| CNOOC      | 1.10        | 210px  | 191px  | 242px       |
| LNG Japan  | 1.00        | 200px  | 200px  | 232px       |
| EnQuest    | 1.46        | 242px  | 166px  | 274px       |
| ENEOS      | 1.72        | 262px  | 152px  | 294px       |
| Mecon      | 0.99        | 198px  | 200px  | 230px       |
| MI Gaea    | 6.44        | 361px  | 56px   | 393px       |

Row 1 total (4 logos + gaps): ~924px. Row 2 total (3 logos + gaps): ~846px. Both exceed a 375px mobile viewport.

## Mobile Sizing Strategy (max-h-[72px])

At `max-h-[72px]` with proportional width:

| Logo       | Width | Height | Cell w/ p-2 |
|------------|-------|--------|-------------|
| BP         | 54px  | 72px   | 70px        |
| Mitsui     | 59px  | 72px   | 75px        |
| CNOOC      | 79px  | 72px   | 95px        |
| LNG Japan  | 72px  | 72px   | 88px        |
| EnQuest    | 105px | 72px   | 121px       |
| ENEOS      | 124px | 72px   | 140px       |
| Mecon      | 71px  | 72px   | 87px        |
| MI Gaea    | 200px | 31px   | (capped)    |

Two logos per row fit comfortably within 343px usable width (375px - 2x16px page padding).

## Solution: Two Layout Modes

**Desktop (>=768px):** `md:flex` rows with `md:gap-6 lg:gap-12` and `md:p-4`. Images render at their `computeLogoSize` dimensions via HTML attributes. `md:max-h-none` removes the mobile cap.

**Mobile (<768px):** `grid grid-cols-2` forces a 2-column layout per row. Images use `max-w-full h-auto max-h-[72px]` to scale proportionally within grid cells. Tighter `gap-3` and `p-2` spacing.

## Rules

- **Never add `style={{ width: "auto", height: "auto" }}` or `w-auto` to Next.js Image with width/height props.** It bypasses the computed sizing and defers to the source file's intrinsic dimensions, which vary wildly (especially SVGs).
- **Use `max-w-full h-auto` + a `max-h` cap for responsive Image scaling.** This constrains without overriding — the tighter of HTML attributes vs CSS wins.
- **Use CSS grid (not flex-wrap) for mobile multi-column logos.** Flex-wrap depends on content size to decide wrapping; grid enforces column count regardless of content.
- **Always use Tailwind responsive prefixes (`md:`) to toggle between mobile and desktop behaviors.** Don't try to make one set of styles work for both — the size difference is too large.
