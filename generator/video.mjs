import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { SCHEMES } from './config/schemes.mjs';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.resolve(ROOT, 'assets');
const TMP = path.resolve(ROOT, '.tmp');

const FFMPEG = (() => {
  try { return require('ffmpeg-static'); }
  catch { return 'ffmpeg'; }
})();

async function runFF(args) {
  return new Promise((resolve, reject) => {
    const p = spawn(FFMPEG, args, { stdio: ['ignore', 'pipe', 'pipe'], cwd: ROOT });
    let out = '';
    p.stdout.on('data', d => out += d.toString());
    p.stderr.on('data', d => out += d.toString());
    p.on('close', code => {
      if (code === 0) resolve(out);
      else reject(new Error(`ffmpeg exit ${code}:\n${out.slice(-500)}`));
    });
    p.on('error', reject);
  });
}

function allPreviews() {
  const list = [];
  for (const scheme of SCHEMES) {
    const pfx = scheme.id ? `-${scheme.id}` : '';
    for (const v of ['dark', 'dark-contrast', 'light', 'light-contrast']) {
      const fp = path.join(ASSETS, `preview-zairyo${pfx}-${v}.png`);
      if (fs.existsSync(fp)) list.push(fp);
    }
  }
  return list;
}

function groupByVariant() {
  const g = { dark: [], 'dark-contrast': [], light: [], 'light-contrast': [] };
  for (const scheme of SCHEMES) {
    const pfx = scheme.id ? `-${scheme.id}` : '';
    for (const v of Object.keys(g)) {
      g[v].push(path.join(ASSETS, `preview-zairyo${pfx}-${v}.png`));
    }
  }
  return g;
}

function makeFilter(images, dur, trans, crop, scale) {
  const n = images.length;
  const lines = [];
  const inputs = [];

  for (let i = 0; i < n; i++) {
    inputs.push('-loop', '1', '-t', String(dur), '-i', images[i]);
  }

  for (let i = 0; i < n; i++) {
    let f = `[${i}:v]setpts=PTS-STARTPTS`;
    if (crop) f += `,crop=${crop}`;
    if (scale) f += `,scale=${scale}:flags=lanczos`;
    f += `[v${i}]`;
    lines.push(f);
  }

  for (let i = 0; i < n - 1; i++) {
    const offset = ((i + 1) * (dur - trans)).toFixed(2);
    if (i === 0) {
      lines.push(`[v${i}][v${i + 1}]xfade=transition=fade:duration=${trans}:offset=${offset},setpts=PTS-STARTPTS[c${i}]`);
    } else {
      lines.push(`[c${i - 1}][v${i + 1}]xfade=transition=fade:duration=${trans}:offset=${offset},setpts=PTS-STARTPTS[c${i}]`);
    }
  }

  return { inputs, filterGraph: lines.join(';'), lastLabel: `[c${n - 2}]`, total: (n * dur - (n - 1) * trans).toFixed(2) };
}

async function makeGif(images, dur, trans, outName, crop, scale, fps = 10, colors = 64) {
  const n = images.length;
  if (n < 2) { console.log(`  SKIP  ${outName} (< 2 images)`); return; }

  console.log(`  ${outName} (${n} frames)`);

  fs.mkdirSync(TMP, { recursive: true });

  const tmpMp4 = path.join(TMP, `${outName.replace('.gif','')}.mp4`);
  const tmpPal = path.join(TMP, `${outName.replace('.gif','')}_pal.png`);

  const { inputs, filterGraph, lastLabel, total } = makeFilter(images, dur, trans, crop, scale);

  const videoArgs = [
    ...inputs,
    '-filter_complex', filterGraph,
    '-map', lastLabel,
    '-t', total,
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
    '-preset', 'ultrafast', '-crf', '28',
    '-y', tmpMp4,
  ];
  await runFF(videoArgs);

  const palArgs = [
    '-i', tmpMp4,
    '-vf', `fps=${fps},palettegen=max_colors=${colors}:stats_mode=diff`,
    '-y', tmpPal,
  ];
  await runFF(palArgs);

  const gifArgsList = [
    '-i', tmpMp4,
    '-i', tmpPal,
    '-filter_complex', `fps=${fps}[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=2`,
    '-y', path.join(ASSETS, outName),
  ];
  await runFF(gifArgsList);

  try { fs.unlinkSync(tmpMp4); fs.unlinkSync(tmpPal); } catch {}

  const size = fs.statSync(path.join(ASSETS, outName)).size;
  console.log(`  OK    ${outName} (${(size/1024).toFixed(0)} KB)`);
}

async function makeHero(images) {
  console.log('\nHero:');
  const crop = '1100:160:90:50';
  const scale = '640:94';
  await makeGif(images, 1.2, 0.4, 'hero.gif', crop, scale, 10, 64);
}

async function makeVariants(grouped) {
  console.log('\nVariants:');
  const crop = '564:564:382:84';
  const scale = '300:300';
  for (const [variant, imgs] of Object.entries(grouped)) {
    await makeGif(imgs, 1.0, 0.3, `${variant}.gif`, crop, scale, 8, 48);
  }
}

async function main() {
  console.log(`ffmpeg: ${FFMPEG}\n`);

  const all = allPreviews();
  const grouped = groupByVariant();

  await makeHero(all);
  await makeVariants(grouped);

  try { fs.rmSync(TMP, { recursive: true, force: true }); } catch {}

  const gifs = fs.readdirSync(ASSETS).filter(f => f.endsWith('.gif'));
  console.log(`\nDone. Generated ${gifs.length} GIFs in assets/`);
}

main().catch(err => { console.error(err.message); process.exit(1); });
