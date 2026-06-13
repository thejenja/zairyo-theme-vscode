import { Scheme } from '@material/material-color-utilities';

function toHex(n) {
  return '#' + (n & 0xFFFFFF).toString(16).padStart(6, '0').toUpperCase();
}

function argbFromHex(hex) {
  return parseInt(hex.replace('#', ''), 16);
}

function hexToRgb(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function rgbToHex(r, g, b) {
  return '#' +
    Math.round(r).toString(16).padStart(2, '0') +
    Math.round(g).toString(16).padStart(2, '0') +
    Math.round(b).toString(16).padStart(2, '0');
}

function blend(c1, c2, t) {
  const [r1, g1, b1] = hexToRgb(c1);
  const [r2, g2, b2] = hexToRgb(c2);
  return rgbToHex(
    r1 + (r2 - r1) * t,
    g1 + (g2 - g1) * t,
    b1 + (b2 - b1) * t,
  );
}

function generateM3Palette(seedHex, isDark) {
  const argb = argbFromHex(seedHex);
  const scheme = isDark ? Scheme.dark(argb) : Scheme.light(argb);
  return Object.fromEntries(
    Object.entries(scheme.props).map(([k, v]) => [k, toHex(v)])
  );
}

export function buildPalette(scheme, variant) {
  const m3 = generateM3Palette(scheme.seed, variant.isDark);
  const isDark = variant.isDark;

  m3.surfaceContainer = blend(m3.surface, m3.surfaceVariant, 0.35);
  m3.surfaceContainerHigh = blend(m3.surface, m3.surfaceVariant, 0.55);
  m3.surfaceDim = isDark
    ? blend(m3.surface, '#000000', 0.3)
    : blend(m3.surface, '#000000', 0.04);

  if (variant.contrastAdjust) {
    for (const [key, value] of Object.entries(variant.contrastAdjust)) {
      if (key in m3) {
        m3[key] = value;
      }
    }
  }

  return m3;
}
