import { Canvas, FontLibrary } from 'skia-canvas';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { measureText } from '@kdog3682/node-canvas-experiment';
import metrics from '../packages/measure/font-metrics.json' assert { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));
const fonts = join(__dirname, '../fonts');
const sys = '/home/kdog3682/.local/share/fonts';

FontLibrary.use('Libertinus Serif', [
  `${sys}/libertinus_serif/LibertinusSerif-Regular.ttf`,
  `${sys}/libertinus_serif/LibertinusSerif-Bold.ttf`,
  `${sys}/libertinus_serif/LibertinusSerif-Italic.ttf`,
]);
FontLibrary.use('NewComputerModern', [
  `${fonts}/ncm-regular.ttf`,
  `${fonts}/ncm-bold.ttf`,
  `${fonts}/ncm-italic.ttf`,
]);
FontLibrary.use('Inconsolata', [
  `${fonts}/inconsolata-regular.ttf`,
  `${fonts}/inconsolata-bold.ttf`,
]);
FontLibrary.use('Crimson Pro', [
  `${fonts}/crimson-regular.ttf`,
  `${fonts}/crimson-italic.ttf`,
]);

type Sample = {
  text: string;
  canvasFont: string;
  key: keyof typeof metrics;
  size: number;
  color: string;
  rectColor: string;
};

const samples: Sample[] = [
  { text: 'Typography',    canvasFont: '28px "Crimson Pro"',               key: 'crimson-regular',      size: 28, color: '#1a3a6e', rectColor: '#4a80d0' },
  { text: 'AV To Ty',      canvasFont: '28px "Crimson Pro"',               key: 'crimson-regular',      size: 28, color: '#1a3a6e', rectColor: '#4a80d0' },
  { text: 'Quartz',        canvasFont: 'italic 28px "Crimson Pro"',        key: 'crimson-italic',       size: 28, color: '#1a3a6e', rectColor: '#4a80d0' },
  { text: 'Waffles',       canvasFont: 'italic 22px "Crimson Pro"',        key: 'crimson-italic',       size: 22, color: '#1a3a6e', rectColor: '#4a80d0' },
  { text: 'Hello World',   canvasFont: '24px "Libertinus Serif"',          key: 'libertinus-regular',   size: 24, color: '#3a1a1a', rectColor: '#c04040' },
  { text: 'AVATAR',        canvasFont: '30px "Libertinus Serif"',          key: 'libertinus-regular',   size: 30, color: '#3a1a1a', rectColor: '#c04040' },
  { text: 'firm fluff',    canvasFont: 'italic 22px "Libertinus Serif"',   key: 'libertinus-italic',    size: 22, color: '#3a1a1a', rectColor: '#c04040' },
  { text: 'Wavelength',    canvasFont: 'bold 26px "Libertinus Serif"',     key: 'libertinus-bold',      size: 26, color: '#3a1a1a', rectColor: '#c04040' },
  { text: 'code.run()',    canvasFont: '18px "Inconsolata"',               key: 'inconsolata-regular',  size: 18, color: '#1a3a1a', rectColor: '#30a050' },
  { text: 'const x = 42', canvasFont: '16px "Inconsolata"',               key: 'inconsolata-regular',  size: 16, color: '#1a3a1a', rectColor: '#30a050' },
  { text: 'HELLO',         canvasFont: 'bold 24px "Inconsolata"',          key: 'inconsolata-bold',     size: 24, color: '#1a3a1a', rectColor: '#30a050' },
  { text: 'Mathematics',   canvasFont: '22px "NewComputerModern"',         key: 'ncm-regular',          size: 22, color: '#2a1a3a', rectColor: '#8040c0' },
  { text: 'Proof.',        canvasFont: '32px "NewComputerModern"',         key: 'ncm-regular',          size: 32, color: '#2a1a3a', rectColor: '#8040c0' },
];

const MARGIN = 40, ROW_GAP = 14, PAD_Y = 8;

const tmp = new Canvas(1, 1);
const tmp2d = tmp.getContext('2d');
tmp2d.textBaseline = 'alphabetic';

type Row = Sample & { canvasW: number; ourW: number; h: number; rowY: number };

let totalH = MARGIN + 28;
const rows: Row[] = [];

for (const s of samples) {
  tmp2d.font = s.canvasFont;
  const canvasW = tmp2d.measureText(s.text).width;
  const { width: ourW, height: h } = measureText(s.text, s.key, s.size);
  const rowY = totalH;
  totalH += h + PAD_Y * 2 + ROW_GAP;
  rows.push({ ...s, canvasW, ourW, h, rowY });
}
totalH += MARGIN;

const canvas = new Canvas(800, totalH);
const ctx = canvas.getContext('2d');
ctx.textBaseline = 'alphabetic';

ctx.fillStyle = '#fafaf8';
ctx.fillRect(0, 0, 800, totalH);

ctx.font = 'bold 12px "Inconsolata"';
ctx.fillStyle = '#555';
ctx.fillText('FONT MEASUREMENT VERIFICATION  ·  blue rect = canvas.measureText  ·  red rect = our metrics', MARGIN, MARGIN - 10);

for (const row of rows) {
  const f = metrics[row.key];
  const ascent = f.ascender * (row.size / f.unitsPerEm);
  const rx = MARGIN;
  const ry = row.rowY + PAD_Y;
  const baseline = ry + ascent;

  ctx.strokeStyle = '#e05050';
  ctx.lineWidth = 1;
  ctx.strokeRect(rx, ry, row.ourW, row.h);

  ctx.strokeStyle = row.rectColor;
  ctx.lineWidth = 1.5;
  ctx.fillStyle = row.rectColor + '18';
  ctx.fillRect(rx, ry, row.canvasW, row.h);
  ctx.strokeRect(rx, ry, row.canvasW, row.h);

  ctx.strokeStyle = row.rectColor + '55';
  ctx.lineWidth = 0.5;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(rx, baseline);
  ctx.lineTo(rx + Math.max(row.canvasW, row.ourW), baseline);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.font = row.canvasFont;
  ctx.fillStyle = row.color;
  ctx.fillText(row.text, rx, baseline);

  const delta = row.canvasW - row.ourW;
  const sign = delta >= 0 ? '+' : '';
  ctx.font = '10px "Inconsolata"';
  ctx.fillStyle = '#999';
  ctx.fillText(
    `${row.key}  ${row.size}px  |  canvas=${row.canvasW.toFixed(1)}  ours=${row.ourW.toFixed(1)}  Δ=${sign}${delta.toFixed(1)}`,
    rx + Math.max(row.canvasW, row.ourW) + 12,
    baseline,
  );
}

const out = join(__dirname, '../artifacts/verify-metrics.png');
await canvas.toFile(out);
console.log(`Saved → ${out}`);

console.log('\nWidth accuracy (canvas vs our metrics):');
for (const r of rows) {
  const delta = r.canvasW - r.ourW;
  const pct = ((delta / r.canvasW) * 100).toFixed(1);
  console.log(`  ${r.text.padEnd(16)} canvas=${r.canvasW.toFixed(1).padStart(6)}  ours=${r.ourW.toFixed(1).padStart(6)}  Δ=${delta.toFixed(1).padStart(6)}px  (${pct}%)`);
}
