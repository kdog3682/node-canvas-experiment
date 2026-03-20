import opentype from 'opentype.js';
import { writeFileSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Printable ASCII + common extras
const CHARS = Array.from(
  { length: 95 }, (_, i) => String.fromCharCode(32 + i)  // space .. ~
).join('') + '\u00A0\u2013\u2014\u2018\u2019\u201C\u201D\u2026';

const sysFont = '/home/kdog3682/.local/share/fonts';

const FONTS: Record<string, string[]> = {
  'Libertinus Serif': [
    `${sysFont}/libertinus_serif/LibertinusSerif-Regular.ttf`,
    `${sysFont}/libertinus_serif/LibertinusSerif-Bold.ttf`,
    `${sysFont}/libertinus_serif/LibertinusSerif-Italic.ttf`,
    `${sysFont}/libertinus_serif/LibertinusSerif-BoldItalic.ttf`,
  ],
  'NewComputerModern': [
    `${sysFont}/new_computer_modern/otf/NewCM10-Regular.otf`,
    `${sysFont}/new_computer_modern/otf/NewCM10-Bold.otf`,
    `${sysFont}/new_computer_modern/otf/NewCM10-Italic.otf`,
    `${sysFont}/new_computer_modern/otf/NewCM10-BoldItalic.otf`,
  ],
  'Inconsolata': [
    `${__dirname}/../fonts/Inconsolata-Regular.ttf`,
    `${__dirname}/../fonts/Inconsolata-Bold.ttf`,
  ],
  'Crimson Pro': [
    `${__dirname}/../fonts/CrimsonPro-Regular.ttf`,
    `${__dirname}/../fonts/CrimsonPro-Italic.ttf`,
  ],
};

type FontEntry = {
  path: string;
  unitsPerEm: number;
  ascender: number;
  descender: number;
  /** char -> advanceWidth in font units */
  glyphs: Record<string, number>;
  /** "AB" -> kern delta in font units (only non-zero pairs stored) */
  kerning: Record<string, number>;
};

const output: Record<string, FontEntry> = {};

for (const [family, paths] of Object.entries(FONTS)) {
  for (const path of paths) {
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

    // derive a key from the font's internal full name, fallback to filename
    const names = font.names as any;
    const fullName: string =
      names?.fullName?.en ??
      names?.postScriptName?.en ??
      basename(path, '.ttf').replace(/-/g, ' ');

    output[fullName] = {
      path,
      unitsPerEm: font.unitsPerEm,
      ascender: font.ascender,
      descender: font.descender,
      glyphs,
      kerning,
    };

    console.log(`✓ ${fullName}  (${Object.keys(glyphs).length} glyphs, ${Object.keys(kerning).length} kern pairs, upm=${font.unitsPerEm})`);
  }
}

const outPath = join(__dirname, '../font-metrics.json');
writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log(`\nWrote ${outPath}`);
