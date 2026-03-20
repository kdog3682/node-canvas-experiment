import { measureText, type FontKey } from './measure';

import CrimsonRegular   from '../fonts/CrimsonPro-Regular.ttf';
import CrimsonItalic    from '../fonts/CrimsonPro-Italic.ttf';
import InconsolataReg   from '../fonts/Inconsolata-Regular.ttf';
import InconsolataBold  from '../fonts/Inconsolata-Bold.ttf';
import LibertinusReg    from '../fonts/LibertinusSerif-Regular.ttf';
import LibertinusBold   from '../fonts/LibertinusSerif-Bold.ttf';
import LibertinusItalic from '../fonts/LibertinusSerif-Italic.ttf';
const FONT_SRCS = [
  { family: 'Crimson Pro',       style: 'normal', weight: '400', src: CrimsonRegular },
  { family: 'Crimson Pro',       style: 'italic', weight: '400', src: CrimsonItalic },
  { family: 'Inconsolata',       style: 'normal', weight: '400', src: InconsolataReg },
  { family: 'Inconsolata',       style: 'normal', weight: '700', src: InconsolataBold },
  { family: 'Libertinus Serif',  style: 'normal', weight: '400', src: LibertinusReg },
  { family: 'Libertinus Serif',  style: 'normal', weight: '700', src: LibertinusBold },
  { family: 'Libertinus Serif',  style: 'italic', weight: '400', src: LibertinusItalic },
];

type Sample = { text: string; font: string; key: FontKey; color: string; rect: string };

const SAMPLES: Sample[] = [
  { text: 'Typography',    font: '28px "Crimson Pro"',              key: 'Crimson Pro Regular',         color: '#1a3a6e', rect: '#4a80d0' },
  { text: 'AV To Ty',      font: '28px "Crimson Pro"',              key: 'Crimson Pro Regular',         color: '#1a3a6e', rect: '#4a80d0' },
  { text: 'Quartz',        font: 'italic 28px "Crimson Pro"',       key: 'Crimson Pro Italic',          color: '#1a3a6e', rect: '#4a80d0' },
  { text: 'Waffles',       font: 'italic 22px "Crimson Pro"',       key: 'Crimson Pro Italic',          color: '#1a3a6e', rect: '#4a80d0' },
  { text: 'Hello World',   font: '24px "Libertinus Serif"',         key: 'Libertinus Serif Regular',    color: '#3a1a1a', rect: '#c04040' },
  { text: 'AVATAR',        font: '30px "Libertinus Serif"',         key: 'Libertinus Serif Regular',    color: '#3a1a1a', rect: '#c04040' },
  { text: 'firm fluff',    font: 'italic 22px "Libertinus Serif"',  key: 'Libertinus Serif Italic',     color: '#3a1a1a', rect: '#c04040' },
  { text: 'Wavelength',    font: 'bold 26px "Libertinus Serif"',    key: 'Libertinus Serif Bold',       color: '#3a1a1a', rect: '#c04040' },
  { text: 'code.run()',    font: '18px "Inconsolata"',              key: 'Inconsolata Regular',         color: '#1a3a1a', rect: '#30a050' },
  { text: 'const x = 42', font: '16px "Inconsolata"',              key: 'Inconsolata Regular',         color: '#1a3a1a', rect: '#30a050' },
  { text: 'HELLO',         font: 'bold 24px "Inconsolata"',         key: 'Inconsolata Bold',            color: '#1a3a1a', rect: '#30a050' },
];

async function loadFonts() {
  await Promise.all(FONT_SRCS.map(({ family, style, weight, src }) => {
    const ff = new FontFace(family, `url(${src})`, { style, weight });
    return ff.load().then(f => document.fonts.add(f));
  }));
}

function draw() {
  const MARGIN = 40, PAD_Y = 8, ROW_GAP = 12;
  const W = 780;

  let y = MARGIN + 24;
  const rows = SAMPLES.map(s => {
    const size = parseInt(s.font.match(/(\d+)px/)![1]);
    const m = measureText(s.text, s.key, size);
    const row = { ...s, ...m, size, rowY: y };
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

  ctx.font = 'bold 11px monospace';
  ctx.fillStyle = '#888';
  ctx.fillText('font measurements — rect sized from precomputed metrics, text drawn inside', MARGIN, MARGIN);

  for (const row of rows) {
    const rx = MARGIN;
    const ry = row.rowY + PAD_Y;
    const baseline = ry + row.ascent;

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

    ctx.font = row.font;
    ctx.fillStyle = row.color;
    ctx.fillText(row.text, rx, baseline);

    ctx.font = '10px monospace';
    ctx.fillStyle = '#aaa';
    ctx.fillText(`${row.key}  ${row.size}px`, rx + row.width + 10, baseline);
  }
}

loadFonts().then(draw);
