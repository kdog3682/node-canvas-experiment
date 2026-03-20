# node-canvas-experiment

Canvas-based rendering, font metrics, and typography using skia-canvas and Bun.

## File tree

```
├── artifacts/
│   ├── typography-demo.png      # output of scripts/typography-demo.ts
│   └── verify-metrics.png       # output of scripts/verify-metrics.ts
├── font-convert/                # uv project: converts OTF/CFF → TTF (glyf) for browser compatibility
├── fonts/                       # bundled TTF font files (kebab-case normalized names)
├── packages/
│   ├── measure/                 # @node-canvas-experiment/measure
│   │   └── src/measure.ts       # measureText(), FontKey
│   └── web-demo/                # @node-canvas-experiment/web-demo — Vite browser demo
│       └── src/
│           ├── fonts.ts         # loadFonts(), CSS_FAMILY aliases
│           └── main.ts          # canvas drawing demo
├── scripts/
│   ├── build-metrics.ts         # extracts font metrics → font-metrics.json
│   ├── typography-demo.ts       # renders a typography + geometry showcase
│   └── verify-metrics.ts        # renders bounding box accuracy verification
└── font-metrics.json            # precomputed per-font glyph + kerning data
```

## Font metrics

`font-metrics.json` stores precomputed data for each font variant: `unitsPerEm`, `ascender`, `descender`, per-character `advanceWidth`, and kerning pairs. Keys are normalized kebab-case: `crimson-regular`, `libertinus-bold`, `ncm-italic`, etc.

At runtime, measuring a string at size `s` is pure arithmetic — no canvas needed:

```ts
width  = sum of (advanceWidth[ch] / unitsPerEm * s) + kerning adjustments
height = (ascender - descender) / unitsPerEm * s
```

## Scripts

```bash
bun dev                    # Vite dev server at localhost:5173
bun run build-metrics      # regenerate font-metrics.json
bun run typography-demo    # → artifacts/typography-demo.png
bun run verify-metrics     # → artifacts/verify-metrics.png
```
