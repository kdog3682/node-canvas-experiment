import metrics from '../../../font-metrics.json';

export type FontKey = keyof typeof metrics;

export function measureText(text: string, key: FontKey, size: number) {
  const f = metrics[key];
  const scale = size / f.unitsPerEm;
  const glyphs = f.glyphs as Record<string, number>;
  const kerning = f.kerning as Record<string, number>;
  let width = 0;
  for (let i = 0; i < text.length; i++) {
    width += (glyphs[text[i]] ?? 0) * scale;
    if (i + 1 < text.length) width += (kerning[text[i] + text[i + 1]] ?? 0) * scale;
  }
  return {
    width,
    height: (f.ascender - f.descender) * scale,
    ascent: f.ascender * scale,
  };
}
