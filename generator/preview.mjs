import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SCHEMES } from './config/schemes.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THEMES_DIR = path.resolve(__dirname, '..', 'themes');
const ASSETS_DIR = path.resolve(__dirname, '..', 'assets');
const WIDTH = 1280;
const HEIGHT = 720;

function hexToRgb(hex) {
  const v = parseInt(hex.replace('#', ''), 16);
  return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
}

function findTokenColor(tokens, scopes) {
  for (const t of tokens) {
    const s = Array.isArray(t.scope) ? t.scope : [t.scope];
    for (const scopeStr of scopes) {
      if (s.some(ss => ss.startsWith(scopeStr) || scopeStr.startsWith(ss))) {
        return t.settings.foreground || null;
      }
    }
  }
  return null;
}

function extractThemeColors(theme) {
  const c = theme.colors || {};
  const tokens = theme.tokenColors || [];
  const tok = (scopes) => findTokenColor(tokens, scopes);

  return {
    bg: c['editor.background'] || '#1e1e1e',
    fg: c['editor.foreground'] || '#d4d4d4',
    sidebarBg: c['sideBar.background'] || c['editor.background'],
    sidebarFg: c['sideBar.foreground'] || '#cccccc',
    sidebarSectionBg: c['sideBarSectionHeader.background'] || c['editor.background'],
    activityBarBg: c['activityBar.background'] || c['editor.background'],
    activityBarFg: c['activityBar.foreground'] || '#ffffff',
    activityBarInactive: c['activityBar.inactiveForeground'] || '#888888',
    activityBarBorder: c['activityBar.activeBorder'] || c['focusBorder'] || '#ffffff',
    statusBarBg: c['statusBar.background'] || '#68217a',
    statusBarFg: c['statusBar.foreground'] || '#ffffff',
    titleBarBg: c['titleBar.activeBackground'] || c['editor.background'],
    titleBarFg: c['titleBar.activeForeground'] || '#cccccc',
    tabActiveBg: c['tab.activeBackground'] || '#2d2d2d',
    tabActiveFg: c['tab.activeForeground'] || '#ffffff',
    tabInactiveBg: c['tab.inactiveBackground'] || c['editor.background'],
    tabInactiveFg: c['tab.inactiveForeground'] || '#888888',
    focusBorder: c['focusBorder'] || '#ffffff',
    panelBorder: c['panel.border'] || '#333333',
    inputBg: c['input.background'] || '#3c3c3c',
    inputFg: c['input.foreground'] || '#cccccc',
    inputBorder: c['input.border'] || '#555555',

    syntaxComment: tok(['comment']) || '#6a9955',
    syntaxKeyword: tok(['keyword', 'storage']) || '#569cd6',
    syntaxString: tok(['string']) || '#ce9178',
    syntaxNumber: tok(['constant.numeric']) || '#b5cea8',
    syntaxFunction: tok(['entity.name.function', 'support.function']) || '#dcdcaa',
    syntaxType: tok(['entity.name.type', 'support.type']) || '#4ec9b0',
    syntaxVariable: tok(['variable']) || '#9cdcfe',
    syntaxOperator: tok(['keyword.operator']) || '#d4d4d4',
    syntaxPunctuation: tok(['punctuation']) || '#d4d4d4',
    syntaxTag: tok(['entity.name.tag']) || '#569cd6',
    syntaxAttr: tok(['entity.other.attribute-name']) || '#9cdcfe',
  };
}

const EE_JS = [
  '// С 💜 от thejenja 👾',
  '// Built with 💜 by thejenja 👾',
  '// Made by thejenja \u{1F47E} with love \u{1F49C}',
  '// thejenja \u{1F47E} was here \u{1F49C}',
];

const EE_CSS = [
  '/* С \u{1F49C} от thejenja \u{1F47E} */',
  '/* Built with \u{1F49C} by thejenja \u{1F47E} */',
  '/* Made by thejenja \u{1F47E} \u{1F49C} */',
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function vueCode() {
  const ee = pick(EE_JS);
  return `${ee}
<template>
  <div class="theme-preview" :class="theme">
    <TheHeader :title="title" />
    <section>
      <button
        v-for="item in items"
        :key="item"
        @click="handleSelect(item)"
      >
        {{ item }}
      </button>
    </section>
    <p v-if="count">Clicked: <strong>{{ count }}</strong></p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  name: string
  colors: Record<string, string>
  isDark: boolean
}

const props = defineProps<Props>()
const count = ref(0)
const items = ['dark', 'light', 'contrast']

function handleSelect(item: string) {
  count.value++
  console.log('selected:', item)
}
<\/script>

<style scoped>
.theme-preview {
  font-family: 'Inter', system-ui, sans-serif;
}
</style>`;
}

function tsCode() {
  const ee = pick(EE_JS);
  return `${ee}
import { ref, computed } from 'vue'

interface ZairyoState {
  name: string
  variant: 'dark' | 'light'
  accent: string
}

export function useZairyoTheme(initial: ZairyoState) {
  const count = ref(0)
  const items = ['dark', 'light', 'contrast'] as const
  const theme = computed(() => initial.variant)

  function switchVariant(item: string) {
    count.value++
    console.log('theme:', item)
  }

  return { count, items, theme, switchVariant }
}`;
}

function cssCode() {
  const ee = pick(EE_CSS);
  return `${ee}
:root {
  --zairyo-bg: #1e1e1e;
  --zairyo-fg: #d4d4d4;
  --zairyo-accent: #6750a4;
  --zairyo-surface: #2d2d2d;
  --zairyo-border: #333333;
}

.theme-preview {
  font-family: 'Inter', system-ui, sans-serif;
  background: var(--zairyo-bg);
  color: var(--zairyo-fg);
}

.theme-preview.dark {
  --zairyo-bg: #0a0a0d;
  --zairyo-accent: #d0bcff;
}

section button {
  padding: 8px 16px;
  border: 1px solid var(--zairyo-border);
  background: var(--zairyo-surface);
  color: var(--zairyo-fg);
  cursor: pointer;
  border-radius: 4px;
}

section button:hover {
  background: var(--zairyo-accent);
  color: #fff;
}`;
}

function configCode() {
  const ee = pick(EE_JS);
  return `${ee}
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Zairyo Preview',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/color-mode'],
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'dark'
  },
  nitro: {
    preset: 'vercel'
  },
  compatibilityDate: '2025-06-01'
})`;
}

const PRESETS = [
  { active: 'app.vue',        icon: 'vue',    code: vueCode,    tabs: ['app.vue', 'useTheme.ts', 'main.css'] },
  { active: 'composables/useTheme.ts', icon: 'ts', code: tsCode, tabs: ['useTheme.ts', 'app.vue', 'main.css'] },
  { active: 'assets/css/main.css',    icon: 'css',   code: cssCode,   tabs: ['main.css', 'app.vue', 'useTheme.ts'] },
  { active: 'nuxt.config.ts',         icon: 'ts',    code: configCode, tabs: ['nuxt.config.ts', 'app.vue', 'main.css'] },
];

function tokenizeCode(code) {
  const tokens = [];
  const lines = code.split('\n');
  for (const line of lines) {
    const lt = [];
    let i = 0;
    while (i < line.length) {
      let m = false;
      const pats = [
        { t:'comment', re:/^\/\/.*/ },
        { t:'comment', re:/^\/\*[\s\S]*?\*\// },
        { t:'string', re:/^'(?:[^'\\]|\\.)*'/ },
        { t:'string', re:/^"(?:[^"\\]|\\.)*"/ },
        { t:'string', re:/^`(?:[^`\\]|\\.)*`/ },
        { t:'number', re:/^\b\d+(?:\.\d+)?\b/ },
        { t:'keyword', re:/^\b(import|from|export|default|const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|delete|typeof|instanceof|void|this|super|yield|await|async|class|extends|implements|interface|type|enum|namespace|module|declare|public|private|protected|readonly|static|abstract|throws|throw|catch|try|finally|with|defineNuxtConfig|defineProps|v-for|v-if)\b/ },
        { t:'keyword', re:/^\b(true|false|null|undefined|NaN|Infinity)\b/ },
        { t:'function', re:/^\b([a-zA-Z_$][\w$]*)\s*\(/ },
        { t:'tag', re:/^<\/?[a-zA-Z][\w-]*/ },
        { t:'attr', re:/^\b(class|:class|@click|:key|v-for|v-if|v-else|:href|:src|href|src|alt|type|id|key|ref)\s*(?===?)/ },
        { t:'punc', re:/^[{}()\[\]<>.,;:]/ },
        { t:'op', re:/^[+\-*/%&|^~!=<>?]+/ },
        { t:'type', re:/^\b(string|number|boolean|void|never|any|Record|Promise|Array|Readonly|Props|Ref)\b/ },
        { t:'punc', re:/^[@#]/ },
      ];
      for (const p of pats) {
        const r = line.slice(i).match(p.re);
        if (r) { lt.push({ t: p.t, v: r[0] }); i += r[0].length; m = true; break; }
      }
      if (!m) {
        const w = line.slice(i).match(/^[\w$]+/);
        if (w) { lt.push({ t:'var', v: w[0] }); i += w[0].length; }
        else { lt.push({ t:'txt', v: line[i] }); i++; }
      }
    }
    tokens.push(lt);
  }
  return tokens;
}

function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function codeHTML(code, clr) {
  const tok = tokenizeCode(code);
  const map = {
    keyword:`color:${clr.syntaxKeyword};font-weight:600`,
    string:`color:${clr.syntaxString}`,
    number:`color:${clr.syntaxNumber}`,
    comment:`color:${clr.syntaxComment};font-style:italic`,
    function:`color:${clr.syntaxFunction}`,
    type:`color:${clr.syntaxType}`,
    var:`color:${clr.syntaxVariable}`,
    op:`color:${clr.syntaxOperator}`,
    punc:`color:${clr.syntaxPunctuation}`,
    tag:`color:${clr.syntaxTag}`,
    attr:`color:${clr.syntaxAttr}`,
    txt:`color:${clr.fg}`,
  };
  return tok.map(ln =>
    '<div style="line-height:1.6;white-space:pre;font-family:\'Cascadia Code\',\'Fira Code\',\'JetBrains Mono\',Consolas,monospace;font-size:11.5px">' +
    ln.map(t => '<span style="' + (map[t.t]||map.txt) + '">' + esc(t.v) + '</span>').join('') +
    '</div>'
  ).join('\n');
}

function generatePreviewHTML(theme, scheme, variant) {
  const c = extractThemeColors(theme);
  const isDark = theme.type === 'dark';
  const isContrast = variant.id.includes('contrast');
  const s = scheme.seed;
  const sr = hexToRgb(s);

  const bgGrad = isDark
    ? `linear-gradient(135deg,#0a0a0d 0%,rgb(${sr.r},${sr.g},${sr.b}) 100%)`
    : `linear-gradient(135deg,#ffffff 0%,rgb(${sr.r},${sr.g},${sr.b}) 100%)`;

  const preset = pick(PRESETS);
  const codeContent = preset.code();

  const files = [
    { n:'app.vue', ic:'vue' },
    { n:'pages', d:1, k:[ { n:'index.vue', ic:'vue' } ] },
    { n:'components', d:1, k:[ { n:'TheHeader.vue', ic:'vue' }, { n:'ThemeCards.vue', ic:'vue' } ] },
    { n:'composables', d:1, k:[ { n:'useTheme.ts', ic:'ts' }, { n:'useMedia.ts', ic:'ts' } ] },
    { n:'assets/css', d:1, k:[ { n:'main.css', ic:'css' } ] },
    { n:'nuxt.config.ts', ic:'ts' },
    { n:'package.json', ic:'json' },
  ];

  const iconOf = (t) => t === 'ts' || t === 'vue' ? 'symbol-file' : t === 'css' ? 'symbol-color' : t === 'json' ? 'symbol-json' : 'file';

  function ft(f, dep) {
    let h = '';
    for (const x of f) {
      const pd = dep * 16;
      if (x.d) {
        h += `<div style="display:flex;align-items:center;height:24px;color:${c.sidebarFg};font-size:12px;cursor:default;padding-left:${pd}px"><i class="codicon codicon-chevron-down" style="font-size:10px;margin:0 2px"></i><i class="codicon codicon-folder-opened" style="font-size:14px;margin:0 4px;opacity:0.7"></i><span>${x.n}</span></div>`;
        if (x.k) h += ft(x.k, dep + 1);
      } else {
        h += `<div style="display:flex;align-items:center;height:24px;color:${c.sidebarFg};font-size:12px;cursor:default;padding-left:${pd + 14}px"><i class="codicon codicon-${iconOf(x.ic)}" style="font-size:14px;margin:0 4px;opacity:0.7"></i><span>${x.n}</span></div>`;
      }
    }
    return h;
  }

  const activeT = preset.active;
  const tabs = preset.tabs;
  const ch = codeHTML(codeContent, c);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@vscode/codicons@0.0.36/dist/codicon.min.css">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif}
.wp{width:100%;height:100%;background:${bgGrad};display:flex;align-items:center;justify-content:center}
.win{z-index:1;width:1100px;height:620px;background:${c.bg};border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,${isDark?0.7:0.25}),0 0 0 1px rgba(255,255,255,${isDark?0.06:0.1});display:flex;flex-direction:column;overflow:hidden}
.tb{height:34px;background:${c.titleBarBg};display:flex;align-items:center;padding:0 12px;flex-shrink:0;user-select:none}
.tbd{display:flex;gap:6px}
.tbdot{width:12px;height:12px;border-radius:50%}
.tbdot.c{background:#ff5f57}
.tbdot.m{background:#febc2e}
.tbdot.x{background:#28c840}
.tbt{flex:1;text-align:center;font-size:12px;color:${c.titleBarFg};opacity:0.85;margin-right:52px}
.bd{display:flex;flex:1;overflow:hidden}
.ab{width:48px;background:${c.activityBarBg};display:flex;flex-direction:column;align-items:center;padding-top:4px;flex-shrink:0}
.ai{width:44px;height:44px;display:flex;align-items:center;justify-content:center;position:relative;color:${c.activityBarInactive};font-size:22px}
.ai.a{color:${c.activityBarFg}}
.ai.a::before{content:'';position:absolute;left:0;top:6px;width:2px;height:32px;background:${c.activityBarBorder};border-radius:0 2px 2px 0}
.sb{width:240px;background:${c.sidebarBg};display:flex;flex-direction:column;flex-shrink:0;border-right:1px solid ${c.panelBorder}}
.sbh{height:32px;background:${c.activityBarBg};display:flex;align-items:center;padding:0 12px;font-size:11px;color:${c.titleBarFg}}
.sbs{padding:4px 0}
.sbst{padding:3px 16px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:${c.sidebarFg};background:${c.sidebarSectionBg};display:flex;align-items:center;gap:4px}
.ea{flex:1;display:flex;flex-direction:column;overflow:hidden}
.et{height:35px;background:${c.tabInactiveBg};display:flex;align-items:stretch;flex-shrink:0}
.etb{display:flex;align-items:center;padding:0 16px;font-size:12px;cursor:default;border-right:1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}}
.etb.a{background:${c.tabActiveBg};color:${c.tabActiveFg}}
.etb.i{background:${c.tabInactiveBg};color:${c.tabInactiveFg}}
.ec{flex:1;background:${c.bg};padding:8px 0;overflow:hidden}
.stb{height:22px;background:${c.statusBarBg};display:flex;align-items:center;padding:0 12px;font-size:11px;color:${c.statusBarFg};flex-shrink:0;gap:16px}
.sbi{display:flex;align-items:center;gap:4px;opacity:0.85}
.sbr{margin-left:auto;display:flex;gap:12px}
</style>
</head>
<body>
<div class="wp">
<div class="win">
<div class="tb">
<div class="tbd">
<div class="tbdot c"></div>
<div class="tbdot m"></div>
<div class="tbdot x"></div>
</div>
<div class="tbt">${theme.name} — Visual Studio Code</div>
</div>
<div class="bd">
<div class="ab">
<div class="ai a"><i class="codicon codicon-files"></i></div>
<div class="ai"><i class="codicon codicon-search"></i></div>
<div class="ai"><i class="codicon codicon-source-control"></i></div>
<div class="ai"><i class="codicon codicon-debug-alt"></i></div>
<div class="ai"><i class="codicon codicon-extensions"></i></div>
</div>
<div class="sb">
<div class="sbh"><i class="codicon codicon-files" style="font-size:14px;opacity:0.7"></i><span style="margin-left:6px;font-size:12px;font-weight:500">${theme.name}</span></div>
<div class="sbs">
<div class="sbst"><i class="codicon codicon-chevron-down" style="font-size:10px"></i> OPEN EDITORS</div>
${tabs.map(f =>
  `<div style="padding:2px 28px;font-size:12px;color:${c.sidebarFg};display:flex;align-items:center;gap:4px"><i class="codicon codicon-close" style="font-size:12px;opacity:0.4"></i><i class="codicon codicon-${iconOf(f.endsWith('.vue') ? 'vue' : f.endsWith('.css') ? 'css' : 'ts')}" style="font-size:14px;opacity:0.6"></i><span>${f}</span></div>`
).join('')}
</div>
<div class="sbs">
<div class="sbst"><i class="codicon codicon-chevron-down" style="font-size:10px"></i> EXPLORER</div>
${ft(files,0)}
</div>
</div>
<div class="ea">
<div class="et">
${tabs.map(tt =>
  `<div class="etb ${tt === activeT ? 'a' : 'i'}"><i class="codicon ${tt === activeT ? 'codicon-close' : 'codicon-symbol-file'}" style="font-size:12px;margin-right:6px;opacity:${tt === activeT ? 1 : 0.5}"></i><span>${tt}</span></div>`
).join('')}
</div>
<div class="ec"><div style="padding:0 16px">${ch}</div></div>
</div>
</div>
<div class="stb">
<div class="sbi"><i class="codicon codicon-source-control" style="font-size:12px"></i><span>main</span><span style="opacity:0.5">*</span></div>
<div class="sbi"><i class="codicon codicon-error" style="font-size:12px"></i><span>0</span><i class="codicon codicon-warning" style="font-size:12px;opacity:0.5"></i><span>1</span></div>
<div class="sbi"><i class="codicon codicon-check" style="font-size:12px"></i><span>Prettier</span></div>
<div class="sbr"><span>Ln 16, Col 22</span><span>Spaces: 2</span><span>UTF-8</span><span>TypeScript</span>${isContrast ? '<span>Contrast Mode</span>' : ''}</div>
</div>
</div>
</div>
</body>
</html>`;
}

async function main() {
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 },
  });

  const page = await browser.newPage();

  const variants = [
    { id: 'dark', label: 'Dark' },
    { id: 'dark-contrast', label: 'Dark Contrast' },
    { id: 'light', label: 'Light' },
    { id: 'light-contrast', label: 'Light Contrast' },
  ];

  let total = 0;

  for (const scheme of SCHEMES) {
    for (const variant of variants) {
      const schemePrefix = scheme.id ? `-${scheme.id}` : '';
      const filename = `zairyo${schemePrefix}-${variant.id}.json`;
      const filepath = path.join(THEMES_DIR, filename);

      if (!fs.existsSync(filepath)) {
        console.warn(`  SKIP  ${filename} (not found)`);
        continue;
      }

      const themeJSON = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
      const html = generatePreviewHTML(themeJSON, scheme, variant);

      const outName = `preview-zairyo${schemePrefix}-${variant.id}.png`;
      const outPath = path.join(ASSETS_DIR, outName);

      await page.setContent(html, { waitUntil: 'load', timeout: 15000 });
      await page.screenshot({ path: outPath, fullPage: false });

      total++;
      console.log(`  OK    ${outName}`);
    }
  }

  await browser.close();
  console.log(`\nGenerated ${total} preview images in assets/`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
