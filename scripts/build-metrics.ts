import opentype from 'opentype.js';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fonts = join(__dirname, '../fonts');
const sys = '/home/kdog3682/.local/share/fonts';

// Printable ASCII + common extras
const CHARS = Array.from(
  { length: 95 }, (_, i) => String.fromCharCode(32 + i)
).join('') + '\u00A0\u2013\u2014\u2018\u2019\u201C\u201D\u2026';

const FONTS: { key: string; path: string }[] = [
  { key: 'crimson-regular',       path: `${fonts}/crimson-regular.ttf` },
  { key: 'crimson-italic',        path: `${fonts}/crimson-italic.ttf` },
  { key: 'inconsolata-regular',   path: `${fonts}/inconsolata-regular.ttf` },
  { key: 'inconsolata-bold',      path: `${fonts}/inconsolata-bold.ttf` },
  { key: 'libertinus-regular',    path: `${sys}/libertinus_serif/LibertinusSerif-Regular.ttf` },
  { key: 'libertinus-bold',       path: `${sys}/libertinus_serif/LibertinusSerif-Bold.ttf` },
  { key: 'libertinus-italic',     path: `${sys}/libertinus_serif/LibertinusSerif-Italic.ttf` },
  { key: 'libertinus-bold-italic',path: `${sys}/libertinus_serif/LibertinusSerif-BoldItalic.ttf` },
  { key: 'ncm-regular',           path: `${sys}/new_computer_modern/otf/NewCM10-Regular.otf` },
  { key: 'ncm-bold',              path: `${sys}/new_computer_modern/otf/NewCM10-Bold.otf` },
  { key: 'ncm-italic',            path: `${sys}/new_computer_modern/otf/NewCM10-Italic.otf` },
  { key: 'ncm-bold-italic',       path: `${sys}/new_computer_modern/otf/NewCM10-BoldItalic.otf` },
  { key: 'ncm-math',              path: `${sys}/new_computer_modern/otf/NewCMMath-Regular.otf` },
];

type FontEntry = {
  path: string;
  unitsPerEm: number;
  ascender: number;
  descender: number;
  glyphs: Record<string, number>;
  kerning: Record<string, number>;
};

const output: Record<string, FontEntry> = {};

for (const { key, path } of FONTS) {
  let font: opentype.Font;
  try {
    font = opentype.loadSync(path);
  } catch (e) {
    console.warn(`Skipping ${path}: ${e}`);
    continue;
  }

  const glyphs: Record<string, number> = {};
  const charGlyphs: [string, opentype.Glyph][] = [];
  for (const ch of CHARS) {
    const glyph = font.charToGlyph(ch);
    glyphs[ch] = glyph.advanceWidth ?? 0;
    charGlyphs.push([ch, glyph]);
  }

  const kerning: Record<string, number> = {};
  for (const [chA, gA] of charGlyphs) {
    for (const [chB, gB] of charGlyphs) {
      const k = font.getKerningValue(gA, gB);
      if (k !== 0) kerning[chA + chB] = k;
    }
  }

  output[key] = { path, unitsPerEm: font.unitsPerEm, ascender: font.ascender, descender: font.descender, glyphs, kerning };
  console.log(`✓ ${key}  (${Object.keys(glyphs).length} glyphs, ${Object.keys(kerning).length} kern pairs, upm=${font.unitsPerEm})`);
}

const outPath = join(__dirname, '../packages/measure/font-metrics.json');
writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log(`\nWrote ${outPath}`);
