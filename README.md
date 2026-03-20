# node-canvas-experiment

Experiments with canvas-based rendering, font metrics, and typography using [skia-canvas](https://github.com/samizdatco/skia-canvas) and Bun.

## What's in here

### Font metrics system

The core of this project is a precomputed font metrics table (`font-metrics.json`) that lets you measure text width and height at any size without needing a canvas context at runtime.

**How it works:**

For each font variant, `scripts/build-metrics.ts` uses [opentype.js](https://opentype.js.org/) to extract:
- `unitsPerEm` — the font's internal coordinate scale
- `ascender` / `descender` — vertical extents above and below the baseline
- `glyphs` — per-character `advanceWidth` in font units for printable ASCII + common punctuation
- `kerning` — non-zero kern pair deltas (e.g. `"AV": -80`)

At runtime, measuring a string at size `s` is pure arithmetic:

```ts
width  = sum of (advanceWidth[ch] / unitsPerEm * s) + kerning adjustments
height = (ascender - descender) / unitsPerEm * s
```

This is fast, requires no canvas, and is accurate to sub-pixel level for layout purposes. Heights reflect the full line box (ascender to descender), not the ink bounds of a specific string — this is the right behavior for consistent vertical rhythm.

**Note on New Computer Modern:** The OTF files use CFF outlines (OpenType-CFF / `OTTO` format) which Chrome's OTS sanitizer rejects in browser canvas. The metrics are included in `font-metrics.json` and work fine in node/skia-canvas, but `NewComputerModern` is excluded from the browser demo.

### Fonts

Fonts live in `fonts/`. Four families are included:

| Family | Variants | Format |
|---|---|---|
| Crimson Pro | Regular, Italic | TTF |
| Inconsolata | Regular, Bold | TTF |
| Libertinus Serif | Regular, Bold, Italic | TTF |
| New Computer Modern | Regular, Bold, Italic, Bold Italic | OTF (node only) |

### Browser demo (Vite)

`src/main.ts` draws font samples on an HTML canvas, with each word inside a bounding rectangle sized from the precomputed metrics. Demonstrates that the measurements are accurate and that the fonts render correctly.

```bash
bun dev         # starts Vite at http://localhost:5173
```

### Node scripts

All scripts run with Bun:

```bash
bun run build-metrics     # regenerate font-metrics.json from font files
bun run render-pdf        # render a typography + geometry demo to output.pdf
bun run verify-metrics    # render measurement verification to sample.png
```

`render-pdf` produces an A4 PDF showcasing all four font families alongside geometric shapes and Bézier curves.

## Stack

- [Bun](https://bun.sh) — runtime + package manager
- [skia-canvas](https://github.com/samizdatco/skia-canvas) — node canvas with PDF/SVG export
- [opentype.js](https://opentype.js.org/) — font parsing for metrics extraction
- [Vite](https://vite.dev) — browser dev server
