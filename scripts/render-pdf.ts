import { Canvas, FontLibrary } from 'skia-canvas';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fontsDir = join(__dirname, '../fonts');
const sysFont = '/home/kdog3682/.local/share/fonts';

FontLibrary.use('Libertinus Serif', [
  `${sysFont}/libertinus_serif/LibertinusSerif-Regular.ttf`,
  `${sysFont}/libertinus_serif/LibertinusSerif-Bold.ttf`,
  `${sysFont}/libertinus_serif/LibertinusSerif-Italic.ttf`,
  `${sysFont}/libertinus_serif/LibertinusSerif-BoldItalic.ttf`,
]);

FontLibrary.use('NewComputerModern', [
  `${sysFont}/new_computer_modern/otf/NewCM10-Regular.otf`,
  `${sysFont}/new_computer_modern/otf/NewCM10-Bold.otf`,
  `${sysFont}/new_computer_modern/otf/NewCM10-Italic.otf`,
  `${sysFont}/new_computer_modern/otf/NewCM10-BoldItalic.otf`,
]);

FontLibrary.use('NewComputerModernMath', [
  `${sysFont}/new_computer_modern/otf/NewCMMath-Regular.otf`,
]);

FontLibrary.use('Inconsolata', [
  `${fontsDir}/Inconsolata-Regular.ttf`,
  `${fontsDir}/Inconsolata-Bold.ttf`,
]);

FontLibrary.use('Crimson Pro', [
  `${fontsDir}/CrimsonPro-Regular.ttf`,
  `${fontsDir}/CrimsonPro-Italic.ttf`,
]);

// A4 in points
const W = 595;
const H = 842;

const canvas = new Canvas(W, H);
const ctx = canvas.getContext('2d');

// ── Background ──────────────────────────────────────────────────────────────
ctx.fillStyle = '#fafaf8';
ctx.fillRect(0, 0, W, H);

// ── Title ────────────────────────────────────────────────────────────────────
ctx.fillStyle = '#1a1a2e';
ctx.font = 'bold 28px "Libertinus Serif"';
ctx.fillText('Typography & Geometry', 50, 68);

ctx.font = 'italic 14px "Crimson Pro"';
ctx.fillStyle = '#666';
ctx.fillText('A canvas experiment with skia-canvas · Bun · TypeScript', 50, 90);

// rule
ctx.strokeStyle = '#1a1a2e';
ctx.lineWidth = 1.5;
ctx.beginPath(); ctx.moveTo(50, 104); ctx.lineTo(W - 50, 104); ctx.stroke();

// ── Font Showcase ────────────────────────────────────────────────────────────
let y = 128;

function sectionHeader(label: string) {
  ctx.font = 'bold 11px "Inconsolata"';
  ctx.fillStyle = '#888';
  ctx.fillText(label.toUpperCase(), 50, y);
  y += 4;
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(50, y + 6); ctx.lineTo(W - 50, y + 6); ctx.stroke();
  y += 18;
}

// Libertinus Serif
sectionHeader('Libertinus Serif');
ctx.font = '16px "Libertinus Serif"';
ctx.fillStyle = '#1a1a1a';
ctx.fillText('The quick brown fox jumps over the lazy dog.', 50, y); y += 20;
ctx.font = 'italic 14px "Libertinus Serif"';
ctx.fillText('In typography, legibility depends on the design of the typeface.', 50, y); y += 30;

// New Computer Modern
sectionHeader('New Computer Modern');
ctx.font = '16px "NewComputerModern"';
ctx.fillStyle = '#1a1a1a';
ctx.fillText('Mathematics is the language of the universe.', 50, y); y += 20;
ctx.font = 'italic 14px "NewComputerModern"';
ctx.fillText("Euler's identity: e^(i\u03C0) + 1 = 0", 50, y); y += 30;

// New Computer Modern Math
sectionHeader('New Computer Modern Math');
ctx.font = '18px "NewComputerModernMath"';
ctx.fillStyle = '#1a1a1a';
ctx.fillText('\u03A3\u2099\u208C\u2081^\u221E 1/n\u00B2  =  \u03C0\u00B2/6    \u222B\u2080\u00B9 x\u00B2 dx  =  \u2153', 50, y); y += 30;

// Inconsolata
sectionHeader('Inconsolata');
ctx.font = '13px "Inconsolata"';
ctx.fillStyle = '#2a2a3e';
ctx.fillText('const render = async (canvas: Canvas): Promise<void> => {', 50, y); y += 17;
ctx.fillText('  await canvas.saveAs("output.pdf");', 50, y); y += 17;
ctx.fillText('};', 50, y); y += 30;

// Crimson Pro
sectionHeader('Crimson Pro');
ctx.font = '17px "Crimson Pro"';
ctx.fillStyle = '#1a1a1a';
ctx.fillText('A thing of beauty is a joy for ever: its loveliness increases.', 50, y); y += 22;
ctx.font = 'bold italic 14px "Crimson Pro"';
ctx.fillText('\u2014 John Keats, Endymion (1818)', 64, y); y += 32;

// divider
ctx.strokeStyle = '#ccc';
ctx.lineWidth = 1;
ctx.beginPath(); ctx.moveTo(50, y); ctx.lineTo(W - 50, y); ctx.stroke();
y += 22;

// ── Geometric Shapes ─────────────────────────────────────────────────────────
ctx.font = 'bold 13px "Libertinus Serif"';
ctx.fillStyle = '#1a1a2e';
ctx.fillText('Geometric Shapes', 50, y);
y += 22;

const baseY = y;
const shapeColors: [string, string][] = [
  ['rgba(70,110,200,0.18)', '#3050b0'],
  ['rgba(200,70,70,0.18)', '#b03030'],
  ['rgba(50,160,80,0.18)', '#20903a'],
  ['rgba(160,80,210,0.18)', '#7030b0'],
];

// Circle
ctx.beginPath();
ctx.arc(95, baseY + 42, 36, 0, Math.PI * 2);
ctx.fillStyle = shapeColors[0][0]; ctx.fill();
ctx.strokeStyle = shapeColors[0][1]; ctx.lineWidth = 1.8; ctx.stroke();

// Rectangle
ctx.beginPath();
ctx.rect(170, baseY + 10, 74, 64);
ctx.fillStyle = shapeColors[1][0]; ctx.fill();
ctx.strokeStyle = shapeColors[1][1]; ctx.lineWidth = 1.8; ctx.stroke();

// Triangle
ctx.beginPath();
ctx.moveTo(330, baseY + 74); ctx.lineTo(368, baseY + 10); ctx.lineTo(406, baseY + 74);
ctx.closePath();
ctx.fillStyle = shapeColors[2][0]; ctx.fill();
ctx.strokeStyle = shapeColors[2][1]; ctx.lineWidth = 1.8; ctx.stroke();

// Diamond
ctx.beginPath();
ctx.moveTo(470, baseY + 8); ctx.lineTo(506, baseY + 42);
ctx.lineTo(470, baseY + 76); ctx.lineTo(434, baseY + 42);
ctx.closePath();
ctx.fillStyle = shapeColors[3][0]; ctx.fill();
ctx.strokeStyle = shapeColors[3][1]; ctx.lineWidth = 1.8; ctx.stroke();

// Shape labels
y = baseY + 90;
ctx.font = '10px "Inconsolata"';
ctx.fillStyle = '#777';
ctx.textAlign = 'center';
ctx.fillText('circle', 95, y);
ctx.fillText('rect', 207, y);
ctx.fillText('triangle', 368, y);
ctx.fillText('diamond', 470, y);
ctx.textAlign = 'left';
y += 26;

// ── Line Studies ─────────────────────────────────────────────────────────────
ctx.font = 'bold 13px "Libertinus Serif"';
ctx.fillStyle = '#1a1a2e';
ctx.fillText('Line Studies', 50, y);
y += 18;

const lineDefs = [
  { color: '#3050b0', width: 1,   dash: [] as number[] },
  { color: '#b03030', width: 1.5, dash: [8, 5] },
  { color: '#20903a', width: 2,   dash: [3, 4] },
  { color: '#7030b0', width: 2,   dash: [12, 4, 2, 4] },
  { color: '#b07020', width: 3,   dash: [5, 5] },
];

for (const { color, width, dash } of lineDefs) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(50, y); ctx.lineTo(W - 50, y); ctx.stroke();
  y += 20;
}
ctx.setLineDash([]);
y += 12;

// ── Bézier Curves ────────────────────────────────────────────────────────────
ctx.font = 'bold 13px "Libertinus Serif"';
ctx.fillStyle = '#1a1a2e';
ctx.fillText('B\u00E9zier Curves', 50, y);
y += 14;

type Pt = [number, number];
const bCurves = [
  { start: [55, y + 50] as Pt, cp1: [160, y + 5] as Pt, cp2: [300, y + 90] as Pt, end: [W - 55, y + 20] as Pt, color: '#3050b0' },
  { start: [55, y + 30] as Pt, cp1: [200, y + 85] as Pt, cp2: [350, y + 5]  as Pt, end: [W - 55, y + 65] as Pt, color: '#b03030' },
];

for (const c of bCurves) {
  ctx.setLineDash([3, 4]);
  ctx.strokeStyle = '#ccc'; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(...c.start); ctx.lineTo(...c.cp1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(...c.end);  ctx.lineTo(...c.cp2); ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = c.color; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(...c.start);
  ctx.bezierCurveTo(...c.cp1, ...c.cp2, ...c.end);
  ctx.stroke();

  for (const [px, py] of [c.start, c.cp1, c.cp2, c.end]) {
    ctx.beginPath();
    ctx.arc(px, py, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = c.color; ctx.fill();
  }
}

y += 100;

// ── Footer ───────────────────────────────────────────────────────────────────
ctx.strokeStyle = '#1a1a2e';
ctx.lineWidth = 1;
ctx.beginPath(); ctx.moveTo(50, y); ctx.lineTo(W - 50, y); ctx.stroke();

ctx.font = '10px "Crimson Pro"';
ctx.fillStyle = '#aaa';
ctx.textAlign = 'center';
ctx.fillText('Generated with skia-canvas \u00B7 Bun \u00B7 TypeScript', W / 2, y + 16);
ctx.textAlign = 'left';

const out = join(__dirname, '../output.pdf');
await canvas.toFile(out);
console.log(`Saved \u2192 ${out}`);
