import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SCHEMES } from './config/schemes.mjs';
import { VARIANTS } from './config/variants.mjs';
import { buildPalette } from './lib/palette.mjs';
import { COLOR_MAP, resolveColor } from './lib/resolve.mjs';
import { buildTokenColors } from './templates/tokenColors.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THEMES_DIR = path.resolve(__dirname, '..', 'themes');

function buildTheme(scheme, variant) {
  const palette = buildPalette(scheme, variant);
  const colors = {};

  for (const key of Object.keys(COLOR_MAP)) {
    const value = resolveColor(key, palette);
    if (value !== null) {
      colors[key] = value;
    }
  }

  const tokenColors = buildTokenColors(palette, scheme);

  const name = scheme.id
    ? `Zairyo ${scheme.label.replace('Zairyo ', '')} ${variant.label}`
    : `Zairyo ${variant.label}`;

  return {
    name,
    type: variant.type,
    semanticHighlighting: true,
    colors,
    tokenColors,
  };
}

function buildAll() {
  let total = 0;
  const themeNames = [];

  for (const scheme of SCHEMES) {
    for (const variant of VARIANTS) {
      const theme = buildTheme(scheme, variant);
      const filename = `zairyo${scheme.id ? '-' + scheme.id : ''}-${variant.id}.json`;
      const filepath = path.join(THEMES_DIR, filename);
      fs.writeFileSync(filepath, JSON.stringify(theme, null, '\t') + '\n');
      total++;
      themeNames.push(`${filename} (${Object.keys(theme.colors).length} colors)`);
    }
  }

  console.log(`Generated ${total} themes:`);
  themeNames.forEach(n => console.log(`  ${n}`));
}

buildAll();
