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
│   ├── measure/                 # @kdog3682/node-canvas-experiment (published to npm)
│   │   ├── src/
│   │   │   ├── measure.ts       # measureText(), FontKey
│   │   │   └── families.ts      # CSS_FAMILY alias map
│   │   ├── index.ts             # barrel export
│   │   └── font-metrics.json    # precomputed glyph + kerning data
│   └── web-demo/                # @node-canvas-experiment/web-demo — Vite browser demo
│       └── src/
│           ├── fonts.ts         # loadFonts()
│           └── main.ts          # canvas drawing demo
├── scripts/
│   ├── build-metrics.ts         # extracts font metrics → packages/measure/font-metrics.json
│   ├── typography-demo.ts       # renders a typography + geometry showcase
│   └── verify-metrics.ts        # renders bounding box accuracy verification
```

## `@kdog3682/node-canvas-experiment`

Fast text measurement using precomputed font metrics — no canvas context required.

```
npm install @kdog3682/node-canvas-experiment
```

### API

#### `measureText(text, key, size)`

Measures a string at a given size using precomputed metrics. Returns sub-pixel accurate dimensions for layout without needing a canvas.

```ts
import { measureText } from '@kdog3682/node-canvas-experiment';

const { width, height, ascent } = measureText('Hello world', 'libertinus-regular', 24);
```

| Return field | Description |
|---|---|
| `width` | Total advance width including kerning |
| `height` | Full line box height (ascender to descender) |
| `ascent` | Distance from baseline to top of line box |

#### `FontKey`

Union type of all valid metric keys. Use for type-safe key references.

```ts
import { type FontKey } from '@kdog3682/node-canvas-experiment';
```

Available keys: `crimson-regular`, `crimson-italic`, `inconsolata-regular`, `inconsolata-bold`, `libertinus-regular`, `libertinus-bold`, `libertinus-italic`, `libertinus-bold-italic`, `ncm-regular`, `ncm-bold`, `ncm-italic`, `ncm-bold-italic`, `ncm-math`

#### `CSS_FAMILY`

Maps short aliases to CSS font-family names for use with `ctx.font` or the FontFace API.

```ts
import { CSS_FAMILY } from '@kdog3682/node-canvas-experiment';

// CSS_FAMILY = {
//   crimson:     'Crimson Pro',
//   libertinus:  'Libertinus Serif',
//   inconsolata: 'Inconsolata',
//   ncm:         'NewComputerModern',
//   'ncm-math':  'NewComputerModernMath',
// }

ctx.font = `24px "${CSS_FAMILY['libertinus']}"`;
```

## Scripts

```bash
bun dev                    # Vite dev server at localhost:5173
bun run build-metrics      # regenerate font-metrics.json
bun run typography-demo    # → artifacts/typography-demo.png
bun run verify-metrics     # → artifacts/verify-metrics.png
```
