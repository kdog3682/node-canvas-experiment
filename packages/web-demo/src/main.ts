import { measureText, type FontKey } from '@kdog3682/node-canvas-experiment';
import { loadFonts, CSS_FAMILY } from './fonts';

type Sample = {
  text: string;
  size: number;
  font: string;   // alias: 'crimson' | 'libertinus' | 'inconsolata' | 'ncm' | 'ncm-math'
  bold?: boolean;
  italic?: boolean;
  color: string;
  rect: string;
};

const SAMPLES: Sample[] = [
  { text: 'Typography',    size: 28, font: 'crimson',     color: '#1a3a6e', rect: '#4a80d0' },
  { text: 'AV To Ty',      size: 28, font: 'crimson',     color: '#1a3a6e', rect: '#4a80d0' },
  { text: 'Quartz',        size: 28, font: 'crimson',     italic: true,            color: '#1a3a6e', rect: '#4a80d0' },
  { text: 'Waffles',       size: 22, font: 'crimson',     italic: true,            color: '#1a3a6e', rect: '#4a80d0' },
  { text: 'Hello World',   size: 24, font: 'libertinus',  color: '#3a1a1a', rect: '#c04040' },
  { text: 'AVATAR',        size: 30, font: 'libertinus',  color: '#3a1a1a', rect: '#c04040' },
  { text: 'firm fluff',    size: 22, font: 'libertinus',  italic: true,            color: '#3a1a1a', rect: '#c04040' },
  { text: 'Wavelength',    size: 26, font: 'libertinus',  bold: true,              color: '#3a1a1a', rect: '#c04040' },
  { text: 'code.run()',    size: 18, font: 'inconsolata', color: '#1a3a1a', rect: '#30a050' },
  { text: 'const x = 42', size: 16, font: 'inconsolata', color: '#1a3a1a', rect: '#30a050' },
  { text: 'HELLO',         size: 24, font: 'inconsolata', bold: true,              color: '#1a3a1a', rect: '#30a050' },
  { text: 'Mathematics',   size: 22, font: 'ncm',         color: '#2a1a3a', rect: '#8040c0' },
  { text: 'Proof.',        size: 32, font: 'ncm',         color: '#2a1a3a', rect: '#8040c0' },
];

function draw() {
  const MARGIN = 40, PAD_Y = 8, ROW_GAP = 12;
  const W = 780;

  let y = MARGIN + 24;
  const rows = SAMPLES.map(s => {
    const suffix = s.bold && s.italic ? '-bold-italic' : s.bold ? '-bold' : s.italic ? '-italic' : '-regular';
    const key = (s.font + suffix) as FontKey;
    const m = measureText(s.text, key, s.size);
    const row = { ...s, key, ...m, rowY: y };
    y += m.height + PAD_Y * 2 + ROW_GAP;
    return row;
  });

  const canvas = document.getElementById('c') as HTMLCanvasElement;
  const dpr = window.devicePixelRatio ?? 1;
  const H = y + MARGIN;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = `${W}px`;
  canvas.style.height = `${H}px`;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = '#fafaf8';
  ctx.fillRect(0, 0, W, H);

  ctx.font = `11px "Inconsolata"`;
  ctx.fillStyle = '#888';
  ctx.fillText('font measurements — rect sized from precomputed metrics, text drawn inside', MARGIN, MARGIN);

  for (const row of rows) {
    const rx = MARGIN;
    const ry = row.rowY + PAD_Y;
    const baseline = ry + row.ascent;
    const family = CSS_FAMILY[row.font] ?? row.font;

    ctx.fillStyle = row.rect + '20';
    ctx.fillRect(rx, ry, row.width, row.height);
    ctx.strokeStyle = row.rect;
    ctx.lineWidth = 1;
    ctx.strokeRect(rx, ry, row.width, row.height);

    ctx.strokeStyle = row.rect + '60';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(rx, baseline);
    ctx.lineTo(rx + row.width, baseline);
    ctx.stroke();
    ctx.setLineDash([]);

    const style = `${row.italic ? 'italic ' : ''}${row.bold ? 'bold ' : ''}`;
    ctx.font = `${style}${row.size}px "${family}"`;
    ctx.fillStyle = row.color;
    ctx.fillText(row.text, rx, baseline);

    ctx.font = `10px "Inconsolata"`;
    ctx.fillStyle = '#aaa';
    ctx.fillText(`${row.key}  ${row.size}px`, rx + row.width + 10, baseline);
  }
}

loadFonts().then(draw);
