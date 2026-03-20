import { Canvas, FontLibrary } from 'skia-canvas';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { measureText } from '../src/measure.ts';
import metrics from '../font-metrics.json' assert { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));
const fontsDir = join(__dirname, '../fonts');
const sysFont = '/home/kdog3682/.local/share/fonts';

FontLibrary.use('Libertinus Serif', [
  `${sysFont}/libertinus_serif/LibertinusSerif-Regular.ttf`,
  `${sysFont}/libertinus_serif/LibertinusSerif-Bold.ttf`,
  `${sysFont}/libertinus_serif/LibertinusSerif-Italic.ttf`,
]);
FontLibrary.use('NewComputerModern', [
  `${sysFont}/new_computer_modern/otf/NewCM10-Regular.otf`,
]);
FontLibrary.use('Inconsolata', [
  `${fontsDir}/Inconsolata-Regular.ttf`,
  `${fontsDir}/Inconsolata-Bold.ttf`,
]);
FontLibrary.use('Crimson Pro', [
  `${fontsDir}/CrimsonPro-Regular.ttf`,
  `${fontsDir}/CrimsonPro-Italic.ttf`,
]);

// ── Samples ───────────────────────────────────────────────────────────────────

type Sample = {
  text: string;
  canvasFont: string;
  metricsKey: keyof typeof metrics;
  size: number;
  color: string;
  rectColor: string;
};

const samples: Sample[] = [
  { text: 'Typography',   canvasFont: '28px "Crimson Pro"',                metricsKey: 'Crimson Pro Regular',          size: 28, color: '#1a3a6e', rectColor: '#4a80d0' },
  { text: 'AV To Ty',     canvasFont: '28px "Crimson Pro"',                metricsKey: 'Crimson Pro Regular',          size: 28, color: '#1a3a6e', rectColor: '#4a80d0' },
  { text: 'Quartz',       canvasFont: 'italic 28px "Crimson Pro"',         metricsKey: 'Crimson Pro Italic',           size: 28, color: '#1a3a6e', rectColor: '#4a80d0' },
  { text: 'Waffles',      canvasFont: 'italic 22px "Crimson Pro"',         metricsKey: 'Crimson Pro Italic',           size: 22, color: '#1a3a6e', rectColor: '#4a80d0' },
  { text: 'Hello World',  canvasFont: '24px "Libertinus Serif"',           metricsKey: 'Libertinus Serif Regular',     size: 24, color: '#3a1a1a', rectColor: '#c04040' },
  { text: 'AVATAR',       canvasFont: '30px "Libertinus Serif"',           metricsKey: 'Libertinus Serif Regular',     size: 30, color: '#3a1a1a', rectColor: '#c04040' },
  { text: 'firm fluff',   canvasFont: 'italic 22px "Libertinus Serif"',    metricsKey: 'Libertinus Serif Italic',      size: 22, color: '#3a1a1a', rectColor: '#c04040' },
  { text: 'Wavelength',   canvasFont: 'bold 26px "Libertinus Serif"',      metricsKey: 'Libertinus Serif Bold',        size: 26, color: '#3a1a1a', rectColor: '#c04040' },
  { text: 'code.run()',   canvasFont: '18px "Inconsolata"',                metricsKey: 'Inconsolata Regular',          size: 18, color: '#1a3a1a', rectColor: '#30a050' },
  { text: 'const x = 42',canvasFont: '16px "Inconsolata"',                metricsKey: 'Inconsolata Regular',          size: 16, color: '#1a3a1a', rectColor: '#30a050' },
  { text: 'HELLO',        canvasFont: 'bold 24px "Inconsolata"',           metricsKey: 'Inconsolata Bold',             size: 24, color: '#1a3a1a', rectColor: '#30a050' },
  { text: 'Mathematics',  canvasFont: '22px "NewComputerModern"',          metricsKey: 'NewComputerModern10-Regular',  size: 22, color: '#2a1a3a', rectColor: '#8040c0' },
  { text: 'Proof.',       canvasFont: '32px "NewComputerModern"',          metricsKey: 'NewComputerModern10-Regular',  size: 32, color: '#2a1a3a', rectColor: '#8040c0' },
];

// ── Layout pass ───────────────────────────────────────────────────────────────

const MARGIN = 40;
const ROW_GAP = 14;
const PAD_Y = 8;

// Temp canvas to measure actual rendered widths
const tmp = new Canvas(1, 1);
const tmp2d = tmp.getContext('2d');
tmp2d.textBaseline = 'alphabetic';

type Row = Sample & {
  canvasW: number;   // ground truth from ctx.measureText
  ourW: number;      // from our font-measure.ts
  h: number;
  rowY: number;
};

let totalH = MARGIN + 28; // title space
const rows: Row[] = [];

for (const s of samples) {
  tmp2d.font = s.canvasFont;
  const canvasW = tmp2d.measureText(s.text).width;
  const { width: ourW, height: h } = measureText(s.text, s.metricsKey, s.size);
  const rowY = totalH;
  totalH += h + PAD_Y * 2 + ROW_GAP;
  rows.push({ ...s, canvasW, ourW, h, rowY });
}
totalH += MARGIN;

const W = 800;
const H = totalH;

// ── Draw ──────────────────────────────────────────────────────────────────────

const canvas = new Canvas(W, H);
const ctx = canvas.getContext('2d');
ctx.textBaseline = 'alphabetic';

ctx.fillStyle = '#fafaf8';
ctx.fillRect(0, 0, W, H);

// Title
ctx.font = 'bold 12px "Inconsolata"';
ctx.fillStyle = '#555';
ctx.fillText('FONT MEASUREMENT VERIFICATION  ·  blue rect = canvas.measureText  ·  red rect = font-measure.ts', MARGIN, MARGIN - 10);

for (const row of rows) {
  const font = metrics[row.metricsKey];
  const scale = row.size / font.unitsPerEm;
  const ascent = font.ascender * scale;

  const rx = MARGIN;
  const ry = row.rowY + PAD_Y;
  const baseline = ry + ascent;

  // ── Red rect: our precomputed measurement ────────────────────────────────
  ctx.strokeStyle = '#e05050';
  ctx.lineWidth = 1;
  ctx.strokeRect(rx, ry, row.ourW, row.h);

  // ── Blue rect: canvas ground truth ──────────────────────────────────────
  ctx.strokeStyle = row.rectColor;
  ctx.lineWidth = 1.5;
  ctx.fillStyle = row.rectColor + '18';
  ctx.fillRect(rx, ry, row.canvasW, row.h);
  ctx.strokeRect(rx, ry, row.canvasW, row.h);

  // Baseline guide
  ctx.strokeStyle = row.rectColor + '55';
  ctx.lineWidth = 0.5;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(rx, baseline);
  ctx.lineTo(rx + Math.max(row.canvasW, row.ourW), baseline);
  ctx.stroke();
  ctx.setLineDash([]);

  // Text
  ctx.font = row.canvasFont;
  ctx.fillStyle = row.color;
  ctx.fillText(row.text, rx, baseline);

  // Label: show both widths and delta
  const delta = row.canvasW - row.ourW;
  const sign = delta >= 0 ? '+' : '';
  ctx.font = '10px "Inconsolata"';
  ctx.fillStyle = '#999';
  const labelX = rx + Math.max(row.canvasW, row.ourW) + 12;
  ctx.fillText(
    `${row.metricsKey}  ${row.size}px  |  canvas=${row.canvasW.toFixed(1)}  ours=${row.ourW.toFixed(1)}  Δ=${sign}${delta.toFixed(1)}`,
    labelX,
    baseline
  );
}

const out = join(__dirname, '../sample.png');
await canvas.toFile(out);
console.log(`Saved → ${out}`);

// Summary
console.log('\nWidth accuracy (canvas vs font-measure):');
for (const r of rows) {
  const delta = r.canvasW - r.ourW;
  const pct = ((delta / r.canvasW) * 100).toFixed(1);
  console.log(`  ${r.text.padEnd(16)} canvas=${r.canvasW.toFixed(1).padStart(6)}  ours=${r.ourW.toFixed(1).padStart(6)}  Δ=${delta.toFixed(1).padStart(6)}px  (${pct}%)`);
}
