import crimsonRegular      from '../../../fonts/crimson-regular.ttf';
import crimsonItalic       from '../../../fonts/crimson-italic.ttf';
import inconsolataRegular  from '../../../fonts/inconsolata-regular.ttf';
import inconsolataBold     from '../../../fonts/inconsolata-bold.ttf';
import libertinusRegular   from '../../../fonts/libertinus-regular.ttf';
import libertinusBold      from '../../../fonts/libertinus-bold.ttf';
import libertinusItalic    from '../../../fonts/libertinus-italic.ttf';
import ncmRegular          from '../../../fonts/ncm-regular.ttf';
import ncmBold             from '../../../fonts/ncm-bold.ttf';
import ncmItalic           from '../../../fonts/ncm-italic.ttf';
import ncmBoldItalic       from '../../../fonts/ncm-bold-italic.ttf';
import ncmMath             from '../../../fonts/ncm-math.ttf';

// Maps short alias → CSS font-family name used in ctx.font
export const CSS_FAMILY: Record<string, string> = {
  crimson:     'Crimson Pro',
  libertinus:  'Libertinus Serif',
  inconsolata: 'Inconsolata',
  ncm:         'NewComputerModern',
  'ncm-math':  'NewComputerModernMath',
};

const SRCS = [
  { family: 'Crimson Pro',           style: 'normal', weight: '400', src: crimsonRegular },
  { family: 'Crimson Pro',           style: 'italic', weight: '400', src: crimsonItalic },
  { family: 'Inconsolata',           style: 'normal', weight: '400', src: inconsolataRegular },
  { family: 'Inconsolata',           style: 'normal', weight: '700', src: inconsolataBold },
  { family: 'Libertinus Serif',      style: 'normal', weight: '400', src: libertinusRegular },
  { family: 'Libertinus Serif',      style: 'normal', weight: '700', src: libertinusBold },
  { family: 'Libertinus Serif',      style: 'italic', weight: '400', src: libertinusItalic },
  { family: 'NewComputerModern',     style: 'normal', weight: '400', src: ncmRegular },
  { family: 'NewComputerModern',     style: 'normal', weight: '700', src: ncmBold },
  { family: 'NewComputerModern',     style: 'italic', weight: '400', src: ncmItalic },
  { family: 'NewComputerModern',     style: 'italic', weight: '700', src: ncmBoldItalic },
  { family: 'NewComputerModernMath', style: 'normal', weight: '400', src: ncmMath },
];

export async function loadFonts(): Promise<void> {
  await Promise.all(SRCS.map(({ family, style, weight, src }) => {
    const ff = new FontFace(family, `url(${src})`, { style, weight });
    return ff.load().then(f => document.fonts.add(f));
  }));
}
