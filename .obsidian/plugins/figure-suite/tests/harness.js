/*
 * Test harness: loads the engine files from src/ into one scope (no Obsidian),
 * with the bundled fonts, and returns its API.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const ENGINE = ['font.js', 'mathtext.js', 'svg.js', 'parse.js', 'blocks.js', 'tree.js', 'graph.js', 'compose.js', 'edit.js', 'templates.js', 'export.js'];

function loadEngine() {
  const code = ENGINE.filter((f) => fs.existsSync(path.join(root, 'src', f)))
    .map((f) => fs.readFileSync(path.join(root, 'src', f), 'utf8')).join('\n');
  const api = new Function(`${code}\nreturn { FS, TTFont, renderFigure, parseFigure, tokenize, typeset, parseLabel, setGraphPositions, pngWithSource, extractSource, pngCssWidth, templates: TEMPLATES };`)();
  const font = (name) => new api.TTFont(fs.readFileSync(path.join(root, 'fonts', `cm-${name}.ttf`)));
  api.FS.fonts = { r: font('regular'), i: font('italic'), b: font('bold') };
  return api;
}

let passed = 0;
let failed = 0;
function check(name, cond, detail) {
  if (cond) passed++;
  else { failed++; console.log(`FAIL ${name}${detail ? `: ${detail}` : ''}`); }
}
function finish() {
  console.log(`${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}

module.exports = { loadEngine, check, finish, root };
