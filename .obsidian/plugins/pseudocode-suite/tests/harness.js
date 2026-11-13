/*
 * Shared test harness: loads src/ files without Obsidian, finds real
 * ```pseudo blocks to test against, and counts assertions.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, 'src', file), 'utf8');

const fakeDocument = {
  createElement: () => ({ style: { setProperty() {} }, classList: { add() {} }, dataset: {}, appendChild() {}, append() {} }),
  createTextNode: (text) => ({ text }),
};

/** core.js + render.js in one scope, returning PS. */
function loadPS() {
  const scope = { exports: {} };
  new Function('module', 'document', 'MarkdownRenderer', `${read('core.js')}\n${read('render.js')}\nmodule.exports = PS;`)(
    scope, fakeDocument, { render: async () => {} },
  );
  return scope.exports;
}

/** main.js helpers (fence scanning) with Obsidian classes stubbed out. */
function loadMain() {
  const scope = { exports: {} };
  class Stub {}
  new Function(
    'module', 'Plugin', 'PluginSettingTab', 'Setting', 'Notice', 'TFile', 'MarkdownView', 'MarkdownRenderChild', 'Component', 'setIcon', 'PS',
    `${read('main.js')}\nmodule.exports = { scanFences, locateFence, prefixed, CSS_LENGTH };`,
  )(scope, Stub, Stub, Stub, Stub, Stub, Stub, Stub, Stub, () => {}, {});
  return scope.exports;
}

/**
 * Vaults to scan: this plugin's own vault, every vault Obsidian knows on this
 * machine, and any extra paths in PS_VAULTS (path-separated).
 */
function vaults() {
  const found = new Set([path.resolve(root, '..', '..', '..')]);
  const configs = [
    path.join(os.homedir(), 'Library', 'Application Support', 'obsidian', 'obsidian.json'),
    path.join(os.homedir(), '.config', 'obsidian', 'obsidian.json'),
    path.join(process.env.APPDATA || '', 'obsidian', 'obsidian.json'),
  ];
  for (const config of configs) {
    try {
      Object.values(JSON.parse(fs.readFileSync(config, 'utf8')).vaults || {}).forEach((vault) => found.add(vault.path));
    } catch (error) { /* no config here */ }
  }
  (process.env.PS_VAULTS || '').split(path.delimiter).filter(Boolean).forEach((vault) => found.add(path.resolve(vault)));
  return [...found].filter((vault) => fs.existsSync(vault));
}

function collectBlocks() {
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.md')) {
        const text = fs.readFileSync(full, 'utf8');
        for (const match of text.matchAll(/^```pseudo\s*$\n([\s\S]*?)^```\s*$/gm)) out.push({ file: full, source: match[1] });
      }
    }
  };
  vaults().forEach(walk);
  return out;
}

function suite() {
  let passed = 0;
  let failed = 0;
  const ok = (cond, name, extra) => {
    if (cond) passed++;
    else {
      failed++;
      console.log('FAIL:', name, extra === undefined ? '' : typeof extra === 'string' ? extra : JSON.stringify(extra));
    }
  };
  const eq = (a, b, name) => ok(JSON.stringify(a) === JSON.stringify(b), name, `${JSON.stringify(a)} != ${JSON.stringify(b)}`);
  const done = () => {
    console.log(`\n${passed} passed, ${failed} failed`);
    process.exit(failed ? 1 : 0);
  };
  return { ok, eq, done };
}

module.exports = { loadPS, loadMain, collectBlocks, suite };
